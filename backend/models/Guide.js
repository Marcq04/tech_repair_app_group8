import mongoose from "mongoose";

// Sub-schema for individual repair steps
const stepSchema = new mongoose.Schema({
    stepNumber: {
        type: Number,
        required: true
    },
    instructionText: {
        type: String,
        required: [true, "Instruction text is required"]
    },
    imageUrl: {
        type: String,
        trim: true
    }
});

const guideSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Guide title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },
        deviceCategory: {
            type: String,
            required: true,
            enum: ['Laptop', 'Desktop', 'OS', 'Peripheral', 'Windows', 'macOS', 'Linux', 'Hardware', 'Network', 'Performance']
        },
        deviceModelYear: {
            type: Number
        },
        difficultyLevel: {
            type: String,
            required: true,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        },
        estimatedTimeMinutes: {
            type: Number,
            required: true
        },
        toolsRequired: {
            type: [String],
            default: []
        },
        partsRequired: {
            type: [String],
            default: []
        },
        safetyNotes: {
            type: String,
            trim: true
        },
        steps: [stepSchema], // Embeds the step sub-documents array
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        upvotes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true // Automatically manages createdAt and updatedAt
    }
);

const Guide = mongoose.model('Guide', guideSchema, 'guides');
export default Guide;