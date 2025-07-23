import { Router } from "express";
import  {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}
 from '../controllers/users.controllers.js'
 import authMiddleware from '../middlewares/auth.middleware.js';


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser); // Protected route to get current user

export default router;