import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createRoom = asyncHandler(async (req, res) => {
  const { name, isPrivate, roomImage, description } = req.body;
  const { ownerId } = req.user;
  if (!name) {
    throw new ApiError(400, "Room name is required");
  }

  let roomCode = "";
  let isUnique = false;

  if (isPrivate === "PRIVATE") {
    function generateRoomCode() {
      const codeLength = 6;
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    }

    while (!isUnique) {
      roomCode = generateRoomCode();
      const existingRoom = await prisma.room.findUnique({
        where: { roomCode },
      });
      if (!existingRoom) {
        isUnique = true;
      }
    }
  }

  const newRoom = await prisma.room.create({
    data: {
      name,
      isPrivate,
      roomCode: isPrivate === "PRIVATE" ? roomCode : null,
      roomImage,
      description,
      createdBy: {
        connect: { id: ownerId },
      },
    },
  });
  await prisma.roomMember.create({
    data: {
      user: {
        connect: { id: ownerId },
      },
      room: {
        connect: { id: newRoom.id },
      },
    },
  });

  if (!newRoom) {
    throw new ApiError(500, "Failed to create room");
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const inviteUrl =
    isPrivate === "PRIVATE"
      ? `${baseUrl}/join-room?roomId=${newRoom.id}&code=${roomCode}`
      : `${baseUrl}/join-room?roomId=${newRoom.id}`;
  res.status(201).json(
    new ApiResponse(201, "Room created successfully", {
      room: newRoom,
      inviteUrl,
    })
  );
});

const joinRoom = asyncHandler(async (req, res) => {
  const { roomId, code } = req.query;
  const { userId } = req.user;

  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      roomMembers: true,
    },
  });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.isPrivate === "PRIVATE" && room.roomCode !== code) {
    throw new ApiError(403, "Invalid room code");
  }

  const existingMember = await prisma.roomMember.findFirst({
    where: {
      roomId,
      userId,
    },
  });

  if (existingMember) {
    throw new ApiError(400, "You are already a member of this room");
  }

  await prisma.roomMember.create({
    data: {
      user: {
        connect: { id: userId },
      },
      room: {
        connect: { id: roomId },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Joined room successfully", { room }));
});

const getRoomInfo = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }
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
            },  
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
          fileAttachments: true,
          emojis: true,
        },
      },
    },
  });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Room information retrieved successfully", { room })
    );
});

const getUserRooms = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const rooms = await prisma.room.findMany({
    where: {
      roomMembers: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      roomMembers: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
          fileAttachments: true,
          emojis: true,
        },
      },
    },
  });
  if (!rooms) {
    throw new ApiError(404, "No rooms found for this user");
  }
  res.status(200).json(
    new ApiResponse(200, "User rooms retrieved successfully", {
      rooms,cursor
    })
  );
});

const getRoomMembers = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      roomMembers: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
 
  return res.status(200).json(
    new ApiResponse(200, "Room members retrieved successfully", {
      members: room.roomMembers.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        profileImage: member.user.profileImage,
      })),
    })
  );
});

const editRoomDetails = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  const { name, roomImage, description, isPrivate } = req.body;

  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      createdBy: {
        select: {
          id: true,
        }
      }
    },
  });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const isOwner = room.createdBy.id === userId;

  if (!isOwner) {
    throw new ApiError(403, "You are not authorized to edit this room");
  }

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: {
      name,
      roomImage,
      description,
      isPrivate,
    },
  });

  if (!updatedRoom) {
    throw new ApiError(500, "Failed to update room details");
  }
  res.status(200).json(
    new ApiResponse(200, "Room details updated successfully", {
      room: updatedRoom,
    })
  );
});

const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.user;
  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      createdBy: true,
    },
  });
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  const isOwner = room.createdBy.id === userId;
  if (!isOwner) {
    throw new ApiError(403, "You are not authorized to delete this room");
  }
  await prisma.room.delete({
    where: { id: roomId },
    data: {
      isDeleted: true,
      roomMembers: {
        deleteMany: {},
      },
      messages: {
        deleteMany: {},   
      }
    },
  });
  res.status(200).json(new ApiResponse(200, "Room deleted successfully"));
})

const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.user;

  if (!roomId) {
    throw new ApiError(400, "Room ID is required");
  }

  const roomMember = await prisma.roomMember.findFirst({
    where: {
      roomId,
      userId,
    },
  });

  if (!roomMember) {
    throw new ApiError(404, "You are not a member of this room");
  }

  await prisma.roomMember.delete({
    where: {
      id: roomMember.id,
    },
  });

  res.status(200).json(new ApiResponse(200, "Left room successfully"));
})

const kickMember = asyncHandler(async (req, res) => {
  const { roomId, memberId } = req.params;
  const { userId } = req.user;

  if (!roomId || !memberId) {
    throw new ApiError(400, "Room ID and Member ID are required");
  }
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      createdBy: {
        select: {
          id: true,
        }
      }
    },
  })
  if (!room) {
    throw new ApiError(404, "Room not found");
  }
  const isOwner = room.createdBy.id === userId;
  if (!isOwner) {
    throw new ApiError(403, "You are not authorized to kick members from this room");
  }
  const member = await prisma.roomMember.findUnique({
    where: {
      id: memberId, 
    },
  });
  if (!member) {
    throw new ApiError(404, "Member not found in this room");
  }
  await prisma.roomMember.delete({
    where: {
      id: member.id,
    },
  });
  res.status(200).json(new ApiResponse(200, "Member kicked from room successfully"));
})

export { createRoom, joinRoom, getRoomInfo, getUserRooms, getRoomMembers, editRoomDetails, deleteRoom, leaveRoom, kickMember };
