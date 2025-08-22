import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const validateRoomMember = asyncHandler(async (req, res, next) => {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    const roomMember = await prisma.roomMember.findUnique({
        where: {
        roomId_userId: {
            roomId,
            userId,
            isDeleted: false,
        },
        },
    });
    
    if (!roomMember) {
        throw new ApiError(403, "You are not a member of this room or the room does not exist.");
    }
    
    req.room = { id: roomId };
    next();
})
export default validateRoomMember;