import express from "express";
import { 
    getUserNotifications, 
    markAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/user/:userId", getUserNotifications);     
router.patch("/:notificationId/read", markAsRead);     

export default router;