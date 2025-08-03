import { Router } from "express";
import {
  sendMessage,
  getMessages,
  getAllMessagesInChat,
  markMessageAsRead,
  editMessage,
  deleteMessage,
  searchMessages
} from "../controllers/message.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Message routes
router.route("/").post(sendMessage);
router.route("/:chatId").get(getMessages);
router.route("/all/:chatId").get(getAllMessagesInChat);
router.route("/:messageId/read").post(markMessageAsRead);
router.route("/:messageId/edit").put(editMessage);
router.route("/:messageId/delete").delete(deleteMessage);
router.route("/search").get(searchMessages);

export default router;
