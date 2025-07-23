import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ms from "ms";

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies or request body
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is required. Please provide it in cookies or request body."
    );
  }
  

  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const userExists = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // OPTIONAL: You can check if this refresh token exists in DB
  const storedRefreshToken = await prisma.refreshToken.findFirst({
    where: { token: refreshToken, userId: userExists.id },
  });

  if (!storedRefreshToken) {
    throw new ApiError(401, "Refresh token not recognized");
  }

  // Generate new tokens
  const newAccessToken = jwt.sign(
    { id: userExists.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const newRefreshToken = jwt.sign(
    { id: userExists.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // Update the old refresh token record in DB
  await prisma.refreshToken.update({
    where: { id: storedRefreshToken.id },
    data: { token: newRefreshToken },
  });

  // Send cookies
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN),
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: userExists.id,
          name: userExists.name,
          email: userExists.email,
          profileImage: userExists.profileImage,
          bio: userExists.bio,
        },
      },
      "Tokens refreshed successfully"
    )
  );
});

export { refreshAccessToken };
