import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Retrieves alerts/notifications for a specific user (with option to filter unread only)
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const { unreadOnly } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        let query = { recipient: userId };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .populate('sender', 'displayName username role isVerifiedTechnician')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Updates notification status (isRead: true) when viewed
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ error: "Invalid notification ID format" });
        }

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to create a notification (can be called inside guide or community controllers)
export const createNotification = async ({ recipientId, senderId, type, message, targetId, targetModel }) => {
    try {
        await Notification.create({
            recipient: recipientId,
            sender: senderId || null,
            type,
            message,
            relatedTargetId: targetId || null,
            targetModel: targetModel || null,
            isRead: false
        });
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};