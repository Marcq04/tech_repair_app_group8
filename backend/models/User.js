import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"]
        },
        displayName: {
            type: String,
            required: [true, "Display name is required"],
            trim: true
        },
        role: {
            type: String,
            enum: ['device_owner', 'small_business', 'technician'], // Only allow these roles
            default: 'device_owner'
        },
        isVerifiedTechnician: {
            type: Boolean,
            default: false
        },
        bookmarkedGuides: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Guide'
            }
        ],
        upvotedGuides: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Guide'
            }
        ]
    },
    {
        timestamps: true 
    }
);

const User = mongoose.model('User', userSchema, 'users');
export default User;