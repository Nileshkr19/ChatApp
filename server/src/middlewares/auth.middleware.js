import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import prisma  from "../config/prisma.js"; 
import { asyncHandler } from "../utils/AsyncHandler.js";

const authMiddleware = asyncHandler(async(req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];


    if(!token) {
        return next(new ApiError(401, "Access token is missing or invalid"));
    }; 
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique ({
            where: { id: decodedToken.id },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                bio: true,
            }
        })
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        req.user = user; 
        next();
    } catch (error) {
        next(new ApiError(401, "Invalid or expired token"));
    }
}

)
export default authMiddleware;
