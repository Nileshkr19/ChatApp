import prisma from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { getIo } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content, messageType = "text", fileUrl } = req.body;

  if (!chatId || !content) {
    throw new ApiError(
      400,
      "Chat ID and content are required to send a message"
    );
  }

  const userId = req.user.id;

  // Check if chat exists, is not deleted, and user is a participant 
  const existingChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      isDeleted: false,
    },
    include: {
      participants: {
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!existingChat || existingChat.participants.length === 0) {
    throw new ApiError(
      404,
      "Chat not found or you are not a participant in this chat"
    );
  }

  // Create the message
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: userId,
      content,
      messageType,
      fileUrl,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  // Update chat's lastMessageAt
  await prisma.chat.update({
    where: { id: chatId },
    data: { lastMessageAt: new Date() },
  });

  // Emit to all participants in the chat room
  const io = getIo();
  io.to(chatId).emit("newMessage", {
    id: message.id,
    chatId,
    content,
    messageType,
    fileUrl,
    senderId: userId,
    sender: message.sender,
    createdAt: message.createdAt.toISOString(),
    isEdited: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { message }, "Message sent successfully"));
});

// Get messages for a chat with pagination
export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.id;

  // Verify user is participant in this chat
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      isDeleted: false,
      participants: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or you're not a participant");
  }

  const skip = (page - 1) * limit;
  const messages = await prisma.message.findMany({
    where: {
      chatId,
      isDeleted: false, // Only show non-deleted messages
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
      readBy: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
      messageReactions: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: parseInt(skip),
    take: parseInt(limit),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: messages.length === parseInt(limit),
        },
      },
      "Messages retrieved successfully"
    )
  );
});

export const getAllMessagesInChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;
  const { cursor, limit = 20 } = req.query;

  // Verify user is participant
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      isDeleted: false,
      participants: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or you're not a participant");
  }

  // Fetch messages
  const messages = await prisma.message.findMany({
    where: {
      chatId,
      isDeleted: false,
    },
    include: {
      sender: {
        select: { id: true, name: true, profileImage: true },
      },
      readBy: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
      messageReactions: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit) + 1, // fetch one extra to detect if there's more
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip the cursor itself
    }),
  });

  let nextCursor = null;
  if (messages.length > limit) {
    const nextItem = messages.pop();
    nextCursor = nextItem.id;
  }

  return res.status(200).json(
    new ApiResponse(200, {
      messages: messages.reverse(), // Show oldest first
      nextCursor,
      pagination: {
        limit: parseInt(limit),
        hasMore: nextCursor !== null,
      },
    }, "Messages retrieved successfully")
  );
});


// Mark message as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  // Verify message exists and user has access to it
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      chat: {
        isDeleted: false,
        participants: {
          some: { userId },
        },
      },
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found or you don't have access");
  }

  // Don't mark own messages as read
  if (message.senderId === userId) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Cannot mark your own message as read"));
  }

  // Create or update read receipt
  const readReceipt = await prisma.messageRead.upsert({
    where: {
      messageId_userId: {
        messageId,
        userId,
      },
    },
    update: {
      readAt: new Date(),
    },
    create: {
      messageId,
      userId,
      readAt: new Date(),
    },
  });

  // Emit read receipt to chat participants
  const io = getIo();
  io.to(message.chatId).emit("messageRead", {
    messageId,
    userId,
    readAt: readReceipt.readAt.toISOString(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { readReceipt }, "Message marked as read"));
});

// Edit a message
export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    throw new ApiError(400, "Content is required to edit message");
  }

  // Find message and verify ownership
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      senderId: userId,
      chat: {
        isDeleted: false,
      },
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found or you're not the sender");
  }

  // Update message
  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: {
      content,
      isEdited: true,
      updatedAt: new Date(),
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  // Emit message edit to chat participants
  const io = getIo();
  io.to(message.chatId).emit("messageEdited", {
    messageId,
    content,
    isEdited: true,
    updatedAt: updatedMessage.updatedAt.toISOString(),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: updatedMessage },
        "Message edited successfully"
      )
    );
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  // Find message and verify ownership
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      senderId: userId,
      isDeleted: false, 
      chat: {
        isDeleted: false,
      },
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found or you're not the sender");
  }

  // Soft delete the message instead of hard delete
  const deletedMessage = await prisma.message.update({
    where: { id: messageId },
    data: {
      isDeleted: true,
      content: "This message was deleted", // Optional: Replace content
      updatedAt: new Date(),
    },
  });

  // Emit message deletion to chat participants
  const io = getIo();
  io.to(message.chatId).emit("messageDeleted", {
    messageId,
    deletedAt: deletedMessage.updatedAt.toISOString(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Message deleted successfully"));
});

export const searchMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { query, page = 1, limit = 50 } = req.query;
  const userId = req.user.id;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      isDeleted: false,
      participants: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or you're not a participant");
  }

  const skip = (page - 1) * limit;

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where: {
        chatId,
        content: {
          contains: query,
          mode: "insensitive",
        },
        isDeleted: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    }),
    prisma.message.count({
      where: {
        chatId,
        content: {
          contains: query,
          mode: "insensitive",
        },
        isDeleted: false,
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: messages.length === parseInt(limit),
        },
      },
      "Messages retrieved successfully"
    )
  );
});
