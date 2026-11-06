import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Secret key for signing JWT tokens (In production, use process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || "fixit_super_secret_key";


export const registerUser = async (req, res) => {
    try {
        const { username, email, password, displayName, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already in use" });
        }

        // Hash password securely with bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            passwordHash,
            displayName,
            role: role || 'device_owner'
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id,
            username: newUser.username
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare submitted password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Sign a JWT token valid for 7 days
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                displayName: user.displayName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('bookmarkedGuides upvotedGuides');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            isVerifiedTechnician: user.isVerifiedTechnician,
            bookmarkedGuides: user.bookmarkedGuides,
            upvotedGuides: user.upvotedGuides,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const toggleBookmark = async (req, res) => {
    try {
        const { userId } = req.params;
        const { guideId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if guide is already bookmarked
        const index = user.bookmarkedGuides.indexOf(guideId);

        if (index > -1) {
            // Already bookmarked ==> Remove it (unbookmark)
            user.bookmarkedGuides.splice(index, 1);
            await user.save();
            return res.status(200).json({
                message: "Guide removed from bookmarks",
                bookmarkedGuides: user.bookmarkedGuides
            });
        } else {
            // Not bookmarked -> Add it
            user.bookmarkedGuides.push(guideId);
            await user.save();
            return res.status(200).json({
                message: "Guide added to bookmarks",
                bookmarkedGuides: user.bookmarkedGuides
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Since JWTs are stateless, the primary action happens on the client side 
        // by deleting the stored token. 
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};