import { Router } from "express";
import {
  createMessage,
  editMessage,
  deleteMessage,
  fetchMessages,
  messageReply,
  fetchReplies,
  messageReactions,
  markMessageAsRead,
  searchMessages,
} from "../controllers/message.controllers.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import validateRoomMember from "../middlewares/validateRoomMember.js";
import validateMessageOwnership from "../middlewares/validateMessageOwnership.js";
import rateLimiterMiddleware from "../middlewares/rateLimiterMiddleware.js";
import validateRoomOwnershipOrAdmin from "../middlewares/validateRoomOwnershipOrAdmin.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ------------------ Message Routes ------------------

// Create a new message
router.post(
  "/:roomId/messages",
  validateRoomMember,       // Verify user is a member of the room
  rateLimiterMiddleware,    // Rate limit to prevent spam
  createMessage
);

// Edit a message (only owner can edit)
router.put(
  "/:roomId/messages/:messageId",
  validateMessageOwnership,
  editMessage
);

// Delete a message (only owner can delete)
router.delete(
  "/:roomId/messages/:messageId",
  validateMessageOwnership,
  deleteMessage
);

// Fetch messages in a room with optional cursor-based pagination
router.get(
  "/:roomId/messages",
  validateRoomMember,
  fetchMessages
);

// Reply to a message
router.post(
  "/:roomId/messages/:messageId/reply",
  validateRoomMember,
  rateLimiterMiddleware,
  messageReply
);

// Fetch replies for a message
router.get(
  "/:roomId/messages/:messageId/replies",
  validateRoomMember,
  fetchReplies
);

// Add/update/remove reactions on a message
router.post(
  "/:roomId/messages/:messageId/reactions",
  validateRoomMember,
  rateLimiterMiddleware,
  messageReactions
);

// Mark a message as read
router.post(
  "/:roomId/messages/:messageId/read",
  validateRoomMember,
  markMessageAsRead
);

// Search messages in a room
router.get(
  "/:roomId/messages/search",
  validateRoomMember,
  searchMessages
);

// ------------------ Admin/Owner Only Example ------------------
// Delete any message as room admin/owner
router.delete(
  "/:roomId/messages/:messageId/admin-delete",
  validateRoomOwnershipOrAdmin,
  deleteMessage
);

export default router;
