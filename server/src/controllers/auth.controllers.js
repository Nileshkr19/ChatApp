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
import { sendOtp, shouldSendEmail } from "../utils/email.js";
import { generateOtp } from "../utils/generateOtp.js";
import redisClient from "../utils/redisClient.js";
import { validateEmail } from "../utils/validator.js";
import { setAuthCookies } from "../utils/auth.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, bio } = req.body;

  const token = crypto.randomUUID();

  const profileImage = res.file ? res.file.path : null;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const { isValid, errors } = validatePassword(password);
  if (!isValid) {
    throw new ApiError(400, `Password validation failed: ${errors.join(", ")}`);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new ApiError(500, "Error hashing password");
  }

  const otp = generateOtp();

  // Save data in Redis instead of DB
  const userPayload = {
    name,
    email,
    hashedPassword,
    bio,
    profileImage,
    otp,
    otpExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  await redisClient.setex(
    `register:${token}`,
    900,
    JSON.stringify(userPayload)
  ); // 900s = 15min

  if (shouldSendEmail) {
    try {
      await sendOtp(email, otp);
    } catch (err) {
      console.error("Failed to send OTP:", err.message);
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { context: "REGISTER", token },
        null,
        "OTP sent to your email. Please verify to complete registration."
      )
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp, token, type, } = req.body;

  const key = token ? `${type}:${token}` : null;

  if (!key) {
    throw new ApiError(400, "Invalid token or type");
  }

  const userData = await redisClient.get(key);
  if (!userData) {
    throw new ApiError(404, "OTP expired or invalid token");
  }

  const user = JSON.parse(userData);

  if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (type === "register") {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email");
    }

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.hashedPassword,
        bio: user.bio,
        profileImage: user.profileImage,
        isVerified: true,
      },
    });

    await redisClient.del(key);

    const accessToken = await generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);

    await prisma.refreshToken.create({
      data: {
        userId: newUser.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d")),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

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
  }

  if (type === "forgot") {
    const userExists = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!userExists) {
      throw new ApiError(404, "User not found");
    }

    // Set short-lived flag in Redis to allow reset
    await redisClient.set(`forgot-verified:${token}`, "true", { EX: 300 });

    await redisClient.del(key);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP verified. You may now reset your password."));
  }

  throw new ApiError(400, "Invalid request type");
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = crypto.randomUUID();

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Current time + 15 minutes
  const redisKey = `forgot:${token}`;
  const redisValue = {
    email,
    otp,
    otpExpiresAt, 
  };
  await redisClient.setex(redisKey, 900, JSON.stringify(redisValue));
  if (shouldSendEmail) {
    try {
      await sendOtp(email, otp);
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
      // Don't fail the request if email sending fails
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { context: "FORGOT_PASSWORD" },
        "OTP sent to your email. It is valid for 15 minutes."
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  
   const {token, password, confirmPassword} = req.body;

  if (!password || !confirmPassword) {
    throw new ApiError(400, "Password, and confirm password are required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

   const isVerified = await redisClient.get(`forgot-verified:${token}`);
  if (isVerified !== "true") {
    throw new ApiError(403, "OTP not verified or expired");
  }
  const redisKey = `forgot:${token}`;
  const redisData = await redisClient.get(redisKey);
  if (!redisData) {
    throw new ApiError(404, "Invalid or expired token");
  }
  const userData = JSON.parse(redisData);
  if (userData.otpExpiresAt < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const {isValid, errors} = validatePassword(password);
  if (!isValid) {
    throw new ApiError(400, `Password validation failed: ${errors.join(", ")}`);
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new ApiError(500, "Error hashing password");
  }
  await prisma.user.update({
    where: { email: userData.email },
    data: { password: hashedPassword, isVerified: true },
  });
  await redisClient.del(redisKey);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));

});


export { registerUser, verifyOtp, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword };
