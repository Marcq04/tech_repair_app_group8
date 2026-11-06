import Review from "../models/Review.js";
import Guide from "../models/Guide.js";
import mongoose from "mongoose";

// Submit a 1-5 star rating, review commentary, and fix success status for a specific repair guide
export const createReview = async (req, res) => {
    try {
        const { guideId } = req.params;
        const { rating, reviewText, wasFixSuccessful, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(guideId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid guide ID or user ID format" });
        }

        // Verify guide exists
        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ error: "Repair guide not found" });
        }

        const newReview = await Review.create({
            guide: guideId,
            user: userId,
            rating,
            reviewText,
            wasFixSuccessful
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review: newReview
        });
    } catch (error) {
        // Handle unique index error if user tries to review the same guide twice
        if (error.code === 11000) {
            return res.status(400).json({ error: "You have already submitted a review for this guide." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Fetches community reviews for a specific guide
export const getGuideReviews = async (req, res) => {
    try {
        const { guideId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(guideId)) {
            return res.status(400).json({ error: "Invalid guide ID format" });
        }

        const reviews = await Review.find({ guide: guideId })
            .populate('user', 'displayName username role isVerifiedTechnician')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: reviews.length,
            reviews
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};