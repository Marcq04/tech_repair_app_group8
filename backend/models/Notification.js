import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Notification recipient is required"]
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        type: {
            type: String,
            required: true,
            enum: ['upvote', 'community_reply', 'video_recommendation', 'review']
        },
        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Notification message body is required"],
            trim: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            // Can reference either a Guide or CommunityRequest depending on context
            refPath: 'targetModel'
        },
        targetModel: {
            type: String,
            enum: ['Guide', 'CommunityRequest']
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true 
    }
);

const Notification = mongoose.model('Notification', notificationSchema, 'notifications');
export default Notification;