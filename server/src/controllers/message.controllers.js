import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emitToChat } from "../socket/index.js";

const createMessage = asyncHandler(async (req, res) => {
  const { content, type, attachment, mentions } = req.body;
  const roomId = req.room.id;
  const userId = req.user.id;

  if (!content && (!attachment || attachment.length === 0)) {
    throw new ApiError(400, "Content or attachment is required");
  }
  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }
  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
      isDeleted: false,
    },
  });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  const member = await prisma.roomMember.findFirst({
    where: {
      roomId: room.id,
      userId: userId,
      isDeleted: false,
    },
  });
  if (!member) {
    throw new ApiError(403, "You are not a member of this room");
  }
  const message = await prisma.roomMessage.create({
    data: {
      content: content || null,
      type: type || "text",
      roomId,
      senderId: userId,
      attachments: attachment
        ? {
            createMany: { data: attachment },
          }
        : undefined,
      mentions: mentions
        ? {
            createMany: {
              data: mentions.map((mention) => ({ userId: mention })),
            },
          }
        : undefined,
    },
    include: {
      attachments: true,
      mentions: true,
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!message) {
    throw new ApiError(500, "Failed to create message");
  }

  // Emit the new message to the room via socket.io
  emitToChat(roomId, "newMessage", message);

  return res
    .status(201)
    .json(new ApiResponse(201, "Message created successfully", message));
});

const editMessage = asyncHandler(async (req, res) => {
  const { content, type, attachment, mention } = req.body;
  const { messageId } = req.params;
  const userId = req.user.id;
  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }
  const message = await prisma.roomMessage.findFirst({
    where: {
      id: messageId,
      isDeleted: false,
    },
    include: {
      sender: true,
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found");
  }
  if (message.senderId !== userId) {
    throw new ApiError(403, "You are not allowed to edit this message");
  }

  const data = {
    ...(content !== undefined ? { content } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(
      attachment !== undefined
        ? { attachments: { set: [], createMany: attachment } }
        : {}
    ),
    ...(mention !== undefined
      ? { mentions: { set: [], createMany: mention.map((m) => ({ userId: m })) } }
      : {}),
  };

  const updatedMessage = await prisma.roomMessage.update({
    where: {
      id: messageId,
    },
    data: {
      ...data,
      isEdited: true,
    },
  });
  if (!updatedMessage) {
    throw new ApiError(500, "Failed to update message");
  }

  // Emit the updated message to the room via socket.io
  emitToChat(message.roomId, "messageUpdated", updatedMessage);

  return res
    .status(200)
    .json(new ApiResponse(200, "Message updated successfully", updatedMessage));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;
  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }
  const message = await prisma.roomMessage.findFirst({
    where: {
      id: messageId,
      isDeleted: false,
    },
    include: {
      sender: true,
    },
  });
  if (!message) {
    throw new ApiError(404, "Message not found");
  }
  if (message.senderId !== userId && !req.user.isAdmin) {
    throw new ApiError(
      403,
      "You are not allowed to delete this message, only admin or sender can delete the message"
    );
  }
  const deletedMessage = await prisma.roomMessage.update({
    where: {
      id: messageId,
    },
    data: {
      isDeleted: true,
    },
  });
  if (!deletedMessage) {
    throw new ApiError(500, "Failed to delete message");
  }

  // Emit the deleted message to the room via socket.io
  emitToChat(message.roomId, "messageDeleted", { 
    messageId: deletedMessage.id, 
    roomId: message.roomId
   });


  return res
    .status(200)
    .json(new ApiResponse(200, "Message deleted successfully", {
      messageId: deletedMessage.id,
      isDeleted: true,
    }));
});

const fetchMessages = asyncHandler(async (req, res) => {
  const roomId = req.room.id;
  const { limit = 20, cursor } = req.query;
  const userId = req.user.id;

  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findFirst({
    where: { id: roomId, isDeleted: false },
  });
  if (!room) throw new ApiError(404, "Room not found");

  const member = await prisma.roomMember.findFirst({
    where: { roomId: room.id, userId, isDeleted: false },
  });
  if (!member) throw new ApiError(403, "You are not a member of this room");

  const messages = await prisma.roomMessage.findMany({
    where: {
      roomId: room.id,
      isDeleted: false,
    },
    include: {
      attachments: true,
      mentions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      sender: { select: { id: true, name: true, profileImage: true } },
      parentMessage: {
        select: {
          id: true,
          content: true,
          type: true,
          sender: { select: { id: true, name: true, profileImage: true } },
        },
      },
      messageReactions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const nextCursor =
    messages.length > 0 ? messages[messages.length - 1].id : null;
  return res.status(200).json(
    new ApiResponse(200, "Messages fetched successfully", {
      messages,
      nextCursor,
    })
  );
});

const messageReply = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content, type, attachment, mentions } = req.body;
  const userId = req.user.id;

  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }

  const parentMessage = await prisma.roomMessage.findFirst({
    where: {
      id: messageId,
      isDeleted: false,
    },
    include: {
      sender: true,
    },
  });

  if (!parentMessage) {
    throw new ApiError(404, "Parent message not found");
  }

  const reply = await prisma.roomMessage.create({
    data: {
      content: content || null,
      type: type || "text",
      roomId: parentMessage.roomId,
      senderId: userId,
      parentMessageId: messageId,
      attachments:
        Array.isArray(attachment) && attachment.length
          ? { create: attachment }
          : undefined,
      mentions:
        Array.isArray(mentions) && mentions.length
          ? { create: mentions.map((mentionId) => ({ userId: mentionId })) }
          : undefined,
    },
    include: {
      attachments: true,
      mentions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      sender: {
        select: { id: true, name: true, profileImage: true },
      },
    },
  });

  if (!reply) {
    throw new ApiError(500, "Failed to create reply");
  }

  // Emit the new reply to the room via socket.io
  emitToChat(parentMessage.roomId, "newReply", reply);

  return res
    .status(201)
    .json(new ApiResponse(201, "Reply created successfully", reply));
});

const fetchReplies = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { limit = 20, cursor } = req.query;
  const userId = req.user.id;

  if (!messageId) throw new ApiError(400, "Message ID is required");

  const parentMessage = await prisma.roomMessage.findFirst({
    where: { id: messageId, isDeleted: false },
  });
  if (!parentMessage) throw new ApiError(404, "Parent message not found");

  const member = await prisma.roomMember.findFirst({
    where: { roomId: parentMessage.roomId, userId, isDeleted: false },
  });
  if (!member) throw new ApiError(403, "You are not a member of this room");

  const replies = await prisma.roomMessage.findMany({
    where: {
      parentMessageId: messageId,
      isDeleted: false,
    },
    include: {
      attachments: true,
      mentions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      sender: { select: { id: true, name: true, profileImage: true } },
      messageReactions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const nextCursor = replies.length > 0 ? replies[replies.length - 1].id : null;
  return res.status(200).json(
    new ApiResponse(200, "Replies fetched successfully", {
      replies,
      nextCursor,
    })
  );
});

const messageReactions = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;
  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }
  if (!emoji) {
    throw new ApiError(400, "Reaction emoji is required");
  }
  const message = await prisma.roomMessage.findFirst({
    where: {
      id: messageId,
      isDeleted: false,
    },
    select: { id: true, roomId:true, isDeleted: true },
  });
  if (!message) {
    throw new ApiError(404, "Message not found");
  }
  const existingReaction = await prisma.messageReaction.findFirst({
    where: {
      roomMessageId: messageId,
      userId,
    },
  });
  if (existingReaction) {
    if (existingReaction.emoji === emoji) {
      await prisma.messageReaction.delete({
        where: { id: existingReaction.id },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, "Reaction removed successfully"));
    } else {
      const updateReaction = await prisma.messageReaction.update({
        where: { id: existingReaction.id },
        data: { emoji },
      });
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Reaction updated successfully", updateReaction)
        );
    }
  }
  // Add new reaction
  const newReaction = await prisma.messageReaction.create({
    data: {
      messageId,
      userId,
      emoji,
    },
  });
  if (!newReaction) {
    throw new ApiError(500, "Failed to add reaction");
  }

  // Emit the new reaction to the room via socket.io
  emitToChat(message.roomId, "newReaction", newReaction);

  return res
    .status(201)
    .json(new ApiResponse(201, "Reaction added successfully", newReaction));
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;
  if (!messageId) {
    throw new ApiError(400, "Message ID is required");
  }
  const message = await prisma.roomMessage.findFirst({
    where: {
      id: messageId,
      isDeleted: false,
    },
    select: { id: true, isDeleted: true },
  });
  if (!message) {
    throw new ApiError(404, "Message not found");
  }
  const existingRead = await prisma.messageRead.findFirst({
    where: {
      roomMessageId: messageId,
      userId,
    },
  });
  if (existingRead) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message already marked as read"));
  }
  const markRead = await prisma.messageRead.create({
    data: {
      roomMessageId: messageId,
      userId,
    },
  });
  if (!markRead) {
    throw new ApiError(500, "Failed to mark message as read");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Message marked as read successfully", markRead)
    );
});

const searchMessages = asyncHandler(async (req, res) => {
  const roomId = req.room.id;
  const { query, senderId, limit = 20, cursor } = req.query;
  const userId = req.user.id;

  if (!roomId) throw new ApiError(400, "Room ID is required");
  if (!query) throw new ApiError(400, "Search query is required");

  // Verify user is a member
  const member = await prisma.roomMember.findFirst({
    where: { roomId, userId, isDeleted: false },
  });
  if (!member) throw new ApiError(403, "You are not a member of this room");

  // Search messages
  const messages = await prisma.roomMessage.findMany({
    where: {
      roomId,
      isDeleted: false,
      content: { contains: query, mode: "insensitive" },
      ...(senderId ? { senderId } : {}),
    },
    include: {
      sender: { select: { id: true, name: true, profileImage: true } },
      attachments: true,
      mentions: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
      parentMessage: {
        select: {
          id: true,
          content: true,
          type: true,
          sender: { select: { id: true, name: true, profileImage: true } },
        },
      },
      messageReactions: {
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
        },
      },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  });

  const nextCursor =
    messages.length > 0 ? messages[messages.length - 1].id : null;
  return res.status(200).json(
    new ApiResponse(200, "Messages fetched successfully", {
      messages,
      nextCursor,
    })
  );
});

export {
  createMessage,
  editMessage,
  deleteMessage,
  fetchMessages,
  messageReply,
  fetchReplies,
  messageReactions,
  markMessageAsRead,
  searchMessages,
};
