import { Router } from "express";
import { refreshAccessToken } from "../controllers/tokens.controllers.js";// Assuming this is the correct path for getMe controller

const router = Router();

router.post("/refresh-token", refreshAccessToken);

export default router;
