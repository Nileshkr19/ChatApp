import { Router } from "express";
import {
  createChat,
  getUserChats,
  getChatById,
  deleteChat
} from "../controllers/chats.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Chat routes

router.route("/").post(createChat)
router.route("/user/:userId").get(getUserChats);
router.route("/:chatId").get(getChatById);
router.route("/:chatId").delete(deleteChat);


export default router;
