import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "../lib/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ms from "ms";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture, bio } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new ApiError(500, "Error hashing password");
  }
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profileImage: profilePicture || null,
      bio,
    },
  });
  const accessToken = await generateAccessToken(newUser);
  const refreshToken = await generateRefreshToken(newUser);

  // Clean up any existing refresh tokens (shouldn't exist for new user, but just to be safe)
  await prisma.refreshToken.deleteMany({
    where: {
      userId: newUser.id,
    },
  });

  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          (process.env.JWT_REFRESH_EXPIRES_IN
            ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000
            : 7 * 24 * 60 * 60 * 1000)
      ),
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
          bio: newUser.bio,
        },
      },
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }
  const passwordMatch = await isPasswordCorrect(password, userExists.password);
  if (!passwordMatch) {
    throw new ApiError(401, "Wrong password");
  }

  const accessToken = await generateAccessToken(userExists);
  const refreshToken = await generateRefreshToken(userExists);
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Error generating tokens");
  }

  // Delete existing refresh tokens for this user to avoid unique constraint violation
  await prisma.refreshToken.deleteMany({
    where: {
      userId: userExists.id,
    },
  });

  await prisma.refreshToken.create({
    data: {
      userId: userExists.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          (process.env.JWT_REFRESH_EXPIRES_IN
            ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000
            : 7 * 24 * 60 * 60 * 1000)
      ),
    },
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN),
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN),
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: userExists.id,
          name: userExists.name,
          email: userExists.email,
          profilePicture: userExists.profilePicture,
          bio: userExists.bio,
        },
      },
      "User logged in successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user by authentication middleware
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      bio: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser };
