import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express from "express";
import router from "./app.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { initSocket } from "./src/socket/socket.js";
import http from "http";

const app = express();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Add both ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

// Global error handling middleware (should be last)
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("🚀 Socket.io server initialized");
});
