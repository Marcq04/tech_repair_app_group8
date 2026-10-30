import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        guide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Guide',
            required: [true, "Guide reference is required"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Reviewer user reference is required"]
        },
        rating: {
            type: Number,
            required: [true, "Star rating score is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot be more than 5"]
        },
        reviewText: {
            type: String,
            required: [true, "Review commentary is required"],
            trim: true
        },
        wasFixSuccessful: {
            type: Boolean,
            required: [true, "Must specify whether the fix was successful"]
        }
    },
    {
        timestamps: true // Automatically manages createdAt and updatedAt timestamps
    }
);

// Optional: Prevent a user from leaving multiple reviews on the exact same guide
reviewSchema.index({ guide: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema, 'reviews');
export default Review;