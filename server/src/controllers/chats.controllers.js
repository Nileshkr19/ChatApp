import prisma from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "User ID is required to create a chat");
  }
  const currentUserId = req.user.id;
  if (currentUserId === userId) {
    throw new ApiError(400, "You cannot create a chat with yourself");
  }

  // Verify the other user exists
  const otherUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!otherUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if chat already exists between these two users
  const existingChat = await prisma.chat.findFirst({
  where: {
    type: 'private',
    participants: {
      some: { userId: currentUserId }
    },
    AND: {
      participants: {
        some: { userId: userId }
      }
    }
  },
  include: {
    participants: {
      include: { user: true }
    },
    messages: true,
    _count: {
      select: { messages: true }
    }
  }
});

  if (existingChat) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          chat: existingChat,
          lastMessage:
            existingChat.messages.length > 0 ? existingChat.messages[0] : null,
        },
        "Chat already exists"
      )
    );
  }

  // Create new private chat
  const newChat = await prisma.chat.create({
    data: {
      type: "private",
      createdBy: currentUserId,
      participants: {
        create: [
          { userId: currentUserId, role: "member" },
          { userId: userId, role: "member" },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isOnline: true,
            },
          },
        },
      },
    },
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        chat: newChat,
        lastMessage: null,
      },
      "Chat created successfully"
    )
  );
});

// Get all chats for current user
export const getUserChats = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId: currentUserId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isOnline: true,
              lastSeen: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: { id: true, name: true },
          },
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              readBy: {
                none: {
                  userId: currentUserId,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
    skip: parseInt(skip),
    take: parseInt(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { chats }, "Chats retrieved successfully"));
});

// Get chat by ID with messages
export const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const currentUserId = req.user.id;
  const { page = 1, limit = 50 } = req.query;

  // Verify user is participant in this chat
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participants: {
        some: {
          userId: currentUserId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              isOnline: true,
              lastSeen: true,
            },
          },
        },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat not found or you're not a participant");
  }

  // Get messages with pagination
  const skip = (page - 1) * limit;
  const messages = await prisma.message.findMany({
    where: { chatId },
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
    },
    orderBy: { createdAt: "desc" },
    skip: parseInt(skip),
    take: parseInt(limit),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        chat: {
          ...chat,
          messages: messages.reverse(), // Reverse to show oldest first
        },
      },
      "Chat retrieved successfully"
    )
  );
});


// delete chat 

export const deleteChat = asyncHandler(async (req, res) =>{
    const {chatId} = req.params;
    const currentUserId = req.user.id;

    if(!chatId) {
        throw new ApiError(400, "Chat ID is required to delete a chat");
    }

    // Verify user is participant in this chat
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            participants: {
                some: {
                    userId: currentUserId,
                },
            },
        },
    });

    if (!chat) {
        throw new ApiError(404, "Chat not found or you're not a participant");
    }

    // Soft delete the chat
    await prisma.chat.update({
        where: { id: chatId },
        data: { isDeleted: true },
    });

    return res.status(200).json(new ApiResponse(200, null, "Chat deleted successfully"));
})