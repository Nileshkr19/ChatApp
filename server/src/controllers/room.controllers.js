// controllers/room.controller.js
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateRoomCode } from "../utils/generateCode.js";
import { emitToUser, emitToChat } from "../socket/index.js";

// --- Helpers ---
const normalizeRoomType = (raw) => {
  const t = (raw || "PUBLIC").toString().toUpperCase();
  const allowed = ["PUBLIC", "PRIVATE", "INVITE_ONLY"];
  if (!allowed.includes(t)) return "PUBLIC";
  return t;
};

const isOwnerOrAdmin = async (room, userId) => {
  const member = await prisma.roomMember.findFirst({
    where: { roomId: room.id, userId },
  });

  if (!room || room.isDeleted) {
    throw new ApiError(404, "Room not found");
  }
  if (!member) {
    throw new ApiError(403, "You are not a member of this room");
  }

  return member.role === "ADMIN" || room.ownerId === userId;

};

// ========== CREATE ROOM ==========
export const createRoom = asyncHandler(async (req, res) => {
  const { name, roomType, roomImage, description } = req.body;
  const userId = req.user.id;

  if (!name?.trim()) throw new ApiError(400, "Room name is required");

  const normalizedType = normalizeRoomType(roomType);

  // Generate a unique roomCode for PRIVATE or INVITE_ONLY rooms
  let roomCode = null;
  if (normalizedType === "PRIVATE" || normalizedType === "INVITE_ONLY") {
    // ensure uniqueness
    while (true) {
      const code = generateRoomCode();
      const exists = await prisma.room.findUnique({
        where: { roomCode: code },
      });
      if (!exists) {
        roomCode = code;
        break;
      }
    }
  }

  const room = await prisma.room.create({
    data: {
      name: name.trim(),
      roomType: normalizedType,
      roomCode,
      roomImage: roomImage || null,
      description: description || null,
      owner: { connect: { id: userId } },
      roomMembers: {
        create: { userId, role: "ADMIN" }, // owner becomes ADMIN member
      },
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true, profileImage: true },
      },
    },
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const inviteUrl =
    normalizedType === "PUBLIC"
      ? `${baseUrl}/join-room?roomId=${room.id}`
      : `${baseUrl}/join-room?roomId=${room.id}&code=${room.roomCode}`;


  emitToUser(userId, "newRoom", { room });


  return res
    .status(201)
    .json(
      new ApiResponse(201, { room, inviteUrl }, "Room created successfully")
    );
});

// ========== JOIN ROOM ==========
export const joinRoom = asyncHandler(async (req, res) => {
  const { roomId, code } = req.query; // keeping your query-style input
  const userId = req.user.id;

  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { roomMembers: true },
  });
  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  // Gate by roomType
  if (room.roomType === "PRIVATE" || room.roomType === "INVITE_ONLY") {
    if (!code || room.roomCode !== code) {
      throw new ApiError(403, "Valid room code is required to join this room");
    }
  }

  // Prevent duplicate membership
  const member = await prisma.roomMember.findFirst({
    where: { roomId, userId },
  });
  if (member) throw new ApiError(400, "You are already a member of this room");

  const newMember = await prisma.roomMember.create({
    data: { roomId, userId, role: "MEMBER" },
  });

  emitToChat(roomId, "memberJoined", { userId, roomId });
  emitToUser(userId, "joinedRoom", { roomId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: room.id, member: newMember },
        "Joined room successfully"
      )
    );
});

// ========== GET ROOM INFO ==========
export const getRoomInfo = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      owner: {
        select: { id: true, name: true, email: true, profileImage: true },
      },
      roomMembers: {
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

  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { room }, "Room information retrieved successfully")
    );
});

// ========== GET USER ROOMS ==========
export const getUserRooms = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Return rooms user belongs to, plus last message as preview
  const rooms = await prisma.room.findMany({
    where: {
      isDeleted: false,
      roomMembers: { some: { userId } },
    },
    include: {
      owner: { select: { id: true, name: true, profileImage: true } },
      roomMembers: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              isOnline: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, name: true, profileImage: true } },
          attachments: true,
          messageReactions: true,
        },
      },
      _count: {
        select: { roomMembers: true, messages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { rooms }, "User rooms retrieved successfully"));
});

// ========== GET ROOM MEMBERS ==========
export const getRoomMembers = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      roomMembers: {
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

  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  const members = room.roomMembers.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    profileImage: m.user.profileImage,
    isOnline: m.user.isOnline,
    lastSeen: m.user.lastSeen,
    role: m.role,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, { members }, "Room members retrieved successfully")
    );
});

// ========== EDIT ROOM DETAILS ==========
export const editRoomDetails = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;
  const { name, roomImage, description, roomType } = req.body;

  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, ownerId: true, isDeleted: true },
  });
  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  const authorized = await isOwnerOrAdmin(room, userId);
  if (!authorized) {
    throw new ApiError(403, "Only room owner or admin can edit details");
  }

  const nextType = roomType ? normalizeRoomType(roomType) : undefined;
  const data = {
    ...(name !== undefined ? { name } : {}),
    ...(roomImage !== undefined ? { roomImage } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(nextType !== undefined ? { roomType: nextType } : {}),
  };

  // If switching to PRIVATE/INVITE_ONLY and no code exists, generate one
  if (data.roomType === "PRIVATE" || data.roomType === "INVITE_ONLY") {
    const fresh = await prisma.room.findUnique({ where: { id: roomId } });
    if (!fresh.roomCode) {
      let newCode = null;
      while (true) {
        const code = generateRoomCode();
        const exists = await prisma.room.findUnique({
          where: { roomCode: code },
        });
        if (!exists) {
          newCode = code;
          break;
        }
      }
      data.roomCode = newCode;
    }
  }

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data,
  });

  emitToChat(roomId, "roomUpdated", { roomId, updates: data });


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { room: updatedRoom },
        "Room details updated successfully"
      )
    );
});

// ========== DELETE ROOM (SOFT DELETE) ==========
export const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, ownerId: true, isDeleted: true },
  });
  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  if (room.ownerId !== userId) {
    throw new ApiError(403, "You are not authorized to delete this room");
  }

  // Soft delete to preserve history
  await prisma.room.update({
    where: { id: roomId },
    data: { isDeleted: true },
  });

  emitToChat(roomId, "roomDeleted", { roomId });
  emitToUser(userId.toString(), "deletedRoom", { roomId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Room deleted successfully"));
});

// ========== LEAVE ROOM ==========
export const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  if (!roomId) throw new ApiError(400, "Room ID is required");

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, ownerId: true, isDeleted: true },
  });
  if (!room || room.isDeleted) throw new ApiError(404, "Room not found");

  if (room.ownerId === userId) {
    throw new ApiError(
      400,
      "Owner cannot leave the room. Transfer ownership first."
    );
  }

  const membership = await prisma.roomMember.findFirst({
    where: { roomId, userId },
  });
  if (!membership) throw new ApiError(404, "You are not a member of this room");

  await prisma.roomMember.delete({ where: { id: membership.id } });

  emitToChat(roomId, "memberLeft", { userId, roomId });
  emitToUser(userId.toString(), "leftRoom", { roomId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Left room successfully"));
});

// ========== KICK MEMBER ==========
export const kickMember = asyncHandler(async (req, res) => {
  const { roomId, memberId } = req.params; 
  const userId = req.user.id;

  if (!roomId || !memberId) {
    throw new ApiError(400, "Room ID and Member ID are required");
  }

  const authorized = await isOwnerOrAdmin(roomId, userId);
  if (!authorized) {
    throw new ApiError(403, "Only room owner or admin can kick members");
  }
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, ownerId: true, isDeleted: true },
  });
  if (!room || room.isDeleted) {
    throw new ApiError(404, "Room not found");
  }
  if (room.ownerId === memberId) {
    throw new ApiError(400, "Cannot kick the room owner");
  }
  const member = await prisma.roomMember.findFirst({
    where: { roomId, userId: memberId },
  });
  if (!member) {
    throw new ApiError(404, "Member not found in this room");
  }
  if (member.role === "ADMIN") {
    throw new ApiError(403, "Cannot kick an admin member");
  }
  await prisma.roomMember.delete({ where: { id: member.id } });

  emitToUser(memberId, "kicked", { roomId });
  emitToChat(roomId, "memberKicked", { memberId, roomId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member kicked from room successfully"));
});

// ========== TRANSFER OWNERSHIP ==========
export const TransferOwnerShip = asyncHandler(async (req, res) => {
  const { roomId, newOwnerId } = req.body;
  const userId = req.user.id;

  if (!roomId || !newOwnerId) {
    throw new ApiError(400, "Room ID and New Owner ID are required");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room || room.isDeleted) {
    throw new ApiError(404, "Room not found");
  }
  if (room.ownerId !== userId) {
    throw new ApiError(403, "Only the owner can transfer ownership");
  }

  const newOwner = await prisma.user.findUnique({
    where: { id: newOwnerId },
  });
  if (!newOwner) {
    throw new ApiError(404, "New owner must be a room member  ");
  }

  await prisma.room.update({
    where: { id: roomId },
    data: { ownerId: newOwnerId },
  });

  if (newOwner.role !== "ADMIN") {
    await prisma.roomMember.update({
      where: { userId: newOwnerId },
      data: { role: "ADMIN" },
    });
  }

  emitToChat(roomId, "ownershipTransferred", { newOwnerId, roomId });
  emitToUser(newOwnerId, "becameOwner", { roomId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Ownership transferred successfully"));
});
