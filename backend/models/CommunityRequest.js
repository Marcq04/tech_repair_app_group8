import mongoose from "mongoose";

// Embedded sub-schema for replies in community threads
const replySchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: [true, "Reply text cannot be empty"],
            trim: true
        },
        videoUrl: {
            type: String,
            trim: true
        },
        isAcceptedSolution: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true 
    }
);

const communityRequestSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: [true, "Question title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Issue description is required"],
            trim: true
        },
        deviceCategory: {
            type: String,
            required: true,
            enum: ['Laptop', 'Desktop', 'OS', 'Peripheral', 'Windows', 'macOS', 'Linux', 'Hardware', 'Network', 'Performance']
        },
        imageUrl: {
            type: String,
            trim: true
        },
        replies: [replySchema], // Embedded array of reply sub-documents
        isResolved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true 
    }
);

const CommunityRequest = mongoose.model('CommunityRequest', communityRequestSchema, 'community_requests');
export default CommunityRequest;