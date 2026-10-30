import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    toggleBookmark 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:userId", getUserProfile);
router.patch("/bookmark/:userId", toggleBookmark);

export default router;