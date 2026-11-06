import Guide from "../models/Guide.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Get all guides with optional query filtering (device category, type, model year, keyword search)
export const getAllGuides = async (req, res) => {
    try {
        const { category, type, modelYear, search } = req.query;
        let query = {};

        // Filter by device category if provided
        if (category) {
            query.deviceCategory = category;
        }

        // Filter by repair type if provided
        if (type) {
            query.repairType = type;
        }

        // Filter by model year if provided
        if (modelYear) {
            query.modelYear = Number(modelYear);
        }

        // Keyword search across title, description, or tags
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const guides = await Guide.find(query)
            .populate('author', 'displayName username role isVerifiedTechnician')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: guides.length,
            guides
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single guide by ID with full details, step-by-step instructions, and author data
export const getGuideById = async (req, res) => {
    try {
        const { guideId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(guideId)) {
            return res.status(400).json({ error: "Invalid guide ID format" });
        }

        const guide = await Guide.findById(guideId)
            .populate('author', 'displayName username role isVerifiedTechnician');

        if (!guide) {
            return res.status(404).json({ error: "Repair guide not found" });
        }

        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new repair guide (for authorized users/technicians)
export const createGuide = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            deviceCategory, 
            repairType, 
            modelYear, 
            difficulty, 
            estimatedTimeMinutes, 
            toolsNeeded, 
            partsNeeded, 
            steps, 
            safetyWarnings, 
            tags, 
            authorId 
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ error: "Invalid author ID format" });
        }

        const newGuide = await Guide.create({
            title,
            description,
            deviceCategory,
            repairType,
            modelYear,
            difficulty,
            estimatedTimeMinutes,
            toolsNeeded,
            partsNeeded,
            steps,
            safetyWarnings,
            tags,
            author: authorId
        });

        res.status(201).json({
            message: "Repair guide created successfully",
            guideId: newGuide._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upvote a guide and record the voter's user ID
export const upvoteGuide = async (req, res) => {
    try {
        const { guideId } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(guideId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid guide ID or user ID format" });
        }

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ error: "Repair guide not found" });
        }

        // Check if user already upvoted this guide
        const hasUpvoted = guide.upvotedBy.includes(userId);

        if (hasUpvoted) {
            // Remove upvote (toggle off)
            guide.upvotedBy = guide.upvotedBy.filter(id => id.toString() !== userId);
            guide.upvotes = Math.max(0, guide.upvotes - 1);
            await guide.save();

            // Also remove from user's upvotedGuides array
            await User.findByIdAndUpdate(userId, { $pull: { upvotedGuides: guideId } });

            return res.status(200).json({
                message: "Upvote removed",
                upvotes: guide.upvotes
            });
        } else {
            // Add upvote
            guide.upvotedBy.push(userId);
            guide.upvotes += 1;
            await guide.save();

            // Also add to user's upvotedGuides array
            await User.findByIdAndUpdate(userId, { $addToSet: { upvotedGuides: guideId } });

            return res.status(200).json({
                message: "Guide upvoted successfully",
                upvotes: guide.upvotes
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};