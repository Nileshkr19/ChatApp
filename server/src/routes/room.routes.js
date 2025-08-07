import {Router} from 'express';
import { createRoom, joinRoom, getRoomInfo, getUserRooms, getRoomMembers, editRoomDetails, deleteRoom, leaveRoom, kickMember } from '../controllers/room.controllers.js';

import authMiddleware from '../middlewares/auth.middleware.js';
const router = Router();

router.use(authMiddleware);


// Route to create a new room
router.post('/create', createRoom);
router.post('/:roomId/join', joinRoom);
router.get('/:roomId/info', getRoomInfo);
router.get('/', getUserRooms);
router.get('/:roomId/members', getRoomMembers);
router.put('/:roomId/edit', editRoomDetails);
router.delete('/:roomId/delete', deleteRoom);
router.post('/:roomId/leave', leaveRoom);
router.post('/:roomId/kick/:memberId', kickMember);



export default router;

