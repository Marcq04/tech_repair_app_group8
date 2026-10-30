import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Models
import "./models/User.js";
import "./models/Guide.js";
import "./models/CommunityRequest.js";
import "./models/Notification.js";
import "./models/Review.js";

// Routes
import userRoutes from "./routes/userRoutes.js";

// Load environment variables from your custom path
dotenv.config({ path: './env/atlas-credentials.env' });

const mongodb_atlas_url = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(mongodb_atlas_url);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// --- MOUNT ROUTES ---
app.use("/api/users", userRoutes);

// Basic root test route
app.get("/", (req, res) => {
    res.send("FixIT API is running...");
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});