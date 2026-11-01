import CommunityRequest from "../models/CommunityRequest.js";
import mongoose from "mongoose";

// 1. Submit a troubleshooting request
export const createRequest = async (req, res) => {
    try {
        const { title, description, deviceCategory, imageUrl, authorId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ error: "Invalid author ID format" });
        }

        const newRequest = await CommunityRequest.create({
            title,
            description,
            deviceCategory,
            imageUrl: imageUrl || null,
            author: authorId,
            isResolved: false
        });

        res.status(201).json({
            message: "Community request submitted successfully",
            requestId: newRequest._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get all active community help threads
export const getAllRequests = async (req, res) => {
    try {
        const { category, isResolved } = req.query;
        let query = {};

        if (category) query.deviceCategory = category;
        if (isResolved !== undefined) query.isResolved = isResolved === 'true';

        const requests = await CommunityRequest.find(query)
            .populate('author', 'displayName username role isVerifiedTechnician')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get single community request thread by ID with replies populated
export const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: "Invalid request ID format" });
        }

        const request = await CommunityRequest.findById(requestId)
            .populate('author', 'displayName username role isVerifiedTechnician')
            .populate('replies.author', 'displayName username role isVerifiedTechnician');

        if (!request) {
            return res.status(404).json({ error: "Community request thread not found" });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Add a reply or video solution to an open request thread
export const addReply = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { text, videoUrl, authorId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ error: "Invalid request ID or author ID format" });
        }

        const request = await CommunityRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Community request thread not found" });
        }

        // Push new reply matching the replySchema fields (text, author, optional videoUrl)
        request.replies.push({
            text,
            videoUrl: videoUrl || null,
            author: authorId
        });

        await request.save();

        const updatedRequest = await CommunityRequest.findById(requestId)
            .populate('replies.author', 'displayName username role isVerifiedTechnician');

        res.status(200).json({
            message: "Reply added successfully",
            replies: updatedRequest.replies
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Toggle the thread resolution status (isResolved)
export const markResolved = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: "Invalid request ID format" });
        }

        const request = await CommunityRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Community request thread not found" });
        }

        request.isResolved = !request.isResolved;
        await request.save();

        res.status(200).json({
            message: `Thread resolution status updated to ${request.isResolved}`,
            isResolved: request.isResolved
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};