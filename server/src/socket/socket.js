import { Server } from "socket.io";
import jwt from "jsonwebtoken";

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

  // Middleware for authentication
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
      console.error("Socket auth error:", error);
      next(); // Allow connection even without valid token for now
    }
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    if (socket.userId) {
      // Join user to their personal room
      socket.join(socket.userId);
      console.log(`👤 User ${socket.userId} joined personal room`);
    }

    // Handle joining chat rooms (Frontend expects this)
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`💬 User ${socket.id} joined chat: ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`👋 User ${socket.id} left chat: ${chatId}`);
    });

    // Handle new messages (Frontend expects this)
    socket.on("newMessage", (messageData) => {
      console.log("📤 New message:", messageData);
      // Broadcast to all users in the chat room except sender
      socket.to(messageData.chatId).emit("newMessage", {
        ...messageData,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicators (Frontend expects this)
    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("userTyping", data);
    });

    // Handle message editing
    socket.on("editMessage", (data) => {
      socket.to(data.chatId).emit("messageEdited", data);
    });

    // Handle message deletion
    socket.on("deleteMessage", (data) => {
      socket.to(data.chatId).emit("messageDeleted", data);
    });

    // Handle message read receipts
    socket.on("markAsRead", (data) => {
      socket.to(data.chatId).emit("messageRead", data);
    });

    // Your existing events (keep for compatibility)
    socket.on("join", ({ userId }) => {
      socket.join(userId);
      console.log(`🔴 User ${userId} joined: ${socket.id}`);
    });

    socket.on("send_message", ({ toUserId, message, fromUser }) => {
      io.to(toUserId).emit("receive_message", {
        message,
        fromUser,
        timestamp: new Date().toISOString(),
      });
    });

    // Message status events
    socket.on("message_seen", ({ messageId, byUserId }) => {
      io.to(byUserId).emit("message_seen_ack", { messageId });
    });

    socket.on("message_delivered", ({ messageId, toUserId }) => {
      io.to(toUserId).emit("message_delivered_ack", { messageId });
    });

    // Video call events
    socket.on("call_user", ({ toUserId, callType, fromUser }) => {
      io.to(toUserId).emit("incoming_call", { fromUser, callType });
    });

    socket.on("answer_call", ({ toUserId, answer }) => {
      io.to(toUserId).emit("call_accepted", { fromUser, answer });
    });

    socket.on("ice_candidate", ({ toUserId, candidate }) => {
      io.to(toUserId).emit("ice_candidate", { candidate });
    });

    // User status updates
    socket.on("updateStatus", (status) => {
      socket.broadcast.emit("userStatusChanged", {
        userId: socket.userId,
        status,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);

      // Notify other users about offline status
      if (socket.userId) {
        socket.broadcast.emit("userStatusChanged", {
          userId: socket.userId,
          status: "offline",
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
};

const getIo = () => io;

// Helper function to emit to specific chat
const emitToChat = (chatId, event, data) => {
  if (io) {
    io.to(chatId).emit(event, data);
  }
};

// Helper function to emit to specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

export { initSocket, getIo, emitToChat, emitToUser };
