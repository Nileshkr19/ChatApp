// socket/index.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import chatSocket from "./chat.socket.js";
import roomSocket from "./room.socket.js";
import callSocket from "./call.socket.js";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // 🔹 Middleware for authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userInfo = decoded;
      }
      next();
    } catch (error) {
      console.error("Socket auth error:", error.message);
      next(new Error("Invalid token"));
    }
  });

  // 🔹 On connection
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join a "private room" with their userId
    if (socket.userId) {
      socket.join(socket.userId.toString());
    }

    // Register feature-specific socket handlers
    chatSocket(io, socket);
    roomSocket(io, socket);
    callSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });
};

// 🔹 Get the global io instance
const getIo = () => io;

// 🔹 Emit to a specific chat/room
const emitToChat = (chatId, event, data) => {
  if (io) {
    io.to(chatId.toString()).emit(event, data);
  }
};

// 🔹 Emit to a specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

export { initSocket, getIo, emitToChat, emitToUser };
