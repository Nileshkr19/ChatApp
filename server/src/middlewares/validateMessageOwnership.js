import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const validateMessageOwnership = asyncHandler(async (req, res, next) => {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await prisma.roomMessage.findUnique({
        where: {
            id: messageId,
        },
    });
    
    if (!message) {
      throw new ApiError(404, "Message not found");
    }
    
    if (message.senderId !== userId) {
        throw new ApiError(403, "You do not have permission to access this message");
    }
    
    req.message = message;
    next();
})
export default validateMessageOwnership;