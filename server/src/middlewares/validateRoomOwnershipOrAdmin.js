import { asyncHandler } from "../utils/AsyncHandler.js";

const validateRoomOwnershipOrAdmin = asyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const userId = req.user.id;

    if(!roomId) {
      if (!roomId) throw new ApiError(400, "Room ID is required");
    }
    
    const room = await prisma.room.findUnique({
        where: {
            id: roomId,
        },
        include: {
            owner: true,
        },
    });
    
    if (!room || room.isDeleted) {
        throw new ApiError(404, "Room not found");
    }
    
    if (room.ownerId !== userId && !req.user.isAdmin) {
        throw new ApiError(403, "You do not have permission to access this room");
    }
    
    req.room = room;
    next();
});

export default validateRoomOwnershipOrAdmin;