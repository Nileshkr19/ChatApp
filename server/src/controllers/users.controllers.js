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
import validatePassword from "../utils/validatePassword.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profileImage, bio } = req.body;
  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate password strength
  const { isValid, errors } = validatePassword(password);
  if (!isValid) {
    throw new ApiError(400, `Password validation failed: ${errors.join(", ")}`);
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

  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImage: profileImage || null,
        bio: bio || null,
      },
    });

    const accessToken = await generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error generating tokens");
    }

    // Clean up any existing refresh tokens (shouldn't exist for new user, but just to be safe)
    await tx.refreshToken.deleteMany({
      where: {
        userId: newUser.id,
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: newUser.id,
        token: refreshToken,
        expiresAt: new Date(
          Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d") // Default to 7 days if not set
        ),
      },
    });
    return { newUser, accessToken, refreshToken };
  });

  const { newUser, accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d"), // Default to 7 days if not set
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN || "2h"), // Default to 15 minutes if not set,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profileImage: newUser.profileImage,
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

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
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

  const result = await prisma.$transaction(async (tx) => {
    const accessToken = await generateAccessToken(userExists);
    const refreshToken = await generateRefreshToken(userExists);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error generating tokens");
    }

    await tx.refreshToken.deleteMany({
      where: {
        userId: userExists.id,
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: userExists.id,
        token: refreshToken,
        expiresAt: new Date(
          Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d") // Default to 7 days if not set
        ),
      },
    });
    return { accessToken, refreshToken };
  });

  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d"), // Default to 7 days if not set
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ms(process.env.JWT_EXPIRES_IN || "2h"), // Default to 2 hours if not set
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

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

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
