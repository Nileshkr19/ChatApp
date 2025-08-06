import { Router } from "express";
import  {
    registerUser,
    verifyOtp,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
}
 from '../controllers/auth.controllers.js'
 import authMiddleware from '../middlewares/auth.middleware.js';
 import upload from "../middlewares/multer.middleware.js";


const   router = Router();

router.post("/register",
    upload.single("profileImage"), 
    registerUser);

router.post("/verify-otp", verifyOtp);  
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getCurrentUser); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;