import { Router } from "express";
import {
  createRoom,
  joinRoom,
  getRoomInfo,
  getUserRooms,
  getRoomMembers,
  editRoomDetails,
  deleteRoom,
  leaveRoom,
  kickMember,
  TransferOwnerShip,
} from "../controllers/room.controllers.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import validateRoomOwnershipOrAdmin from "../middlewares/validateRoomOwnershipOrAdmin.js";
import validateRoomMember from "../middlewares/validateRoomMember.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ------------------ Room Routes ------------------

// Create a new room
router.post("/create", createRoom);

// Join a room
router.post("/:roomId/join", joinRoom);

// Get room info (any member)
router.get("/:roomId/info", validateRoomMember, getRoomInfo);

// Get all rooms of the user
router.get("/", getUserRooms);

// Get members of a room (any member)
router.get("/:roomId/members", validateRoomMember, getRoomMembers);

// Edit room details (owner only)
router.put("/:roomId/edit", validateRoomOwnershipOrAdmin, editRoomDetails);

// Delete a room (owner only)
router.delete("/:roomId/delete", validateRoomOwnershipOrAdmin, deleteRoom);

// Leave a room (member only)
router.post("/:roomId/leave", validateRoomMember, leaveRoom);

// Kick a member (owner/admin only)
router.post("/:roomId/kick/:memberId", validateRoomOwnershipOrAdmin, kickMember);

// Transfer room ownership (owner only)
router.post("/:roomId/transfer-ownership/:newOwnerId", validateRoomOwnershipOrAdmin, TransferOwnerShip);

export default router;
