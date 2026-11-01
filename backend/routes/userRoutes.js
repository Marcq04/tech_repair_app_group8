import express from "express";
import { 
    registerUser, 
    loginUser,
    logoutUser, 
    getUserProfile, 
    toggleBookmark 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:userId", getUserProfile);
router.patch("/bookmark/:userId", toggleBookmark);

export default router;