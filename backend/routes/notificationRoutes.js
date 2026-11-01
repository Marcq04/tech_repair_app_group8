import express from "express";
import { 
    getUserNotifications, 
    markAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/user/:userId", getUserNotifications);     // GET /api/notifications/user/:userId
router.patch("/:notificationId/read", markAsRead);     // PATCH /api/notifications/:notificationId/read

export default router;