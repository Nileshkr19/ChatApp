import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import tokensRoutes from "./src/routes/tokens.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import messagesRoutes from "./src/routes/message.routes.js";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/tokens", tokensRoutes);
router.use("/api/v1/room", roomRoutes);
router.use("/api/v1/messages", messagesRoutes);

export default router;
