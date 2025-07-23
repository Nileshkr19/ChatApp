import { Router } from "express";
import userRoutes from "./src/routes/user.routes.js";
import tokensRoutes from "./src/routes/tokens.routes.js";
import chatsRoutes from "./src/routes/chats.routes.js";
import messagesRoutes from "./src/routes/message.routes.js";

const router = Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/tokens", tokensRoutes);
router.use("/api/v1/chats", chatsRoutes);
router.use("/api/v1/messages", messagesRoutes);

export default router;
