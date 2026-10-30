import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: './env/atlas-credentials.env' });

const mongodb_atlas_url = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
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

// Mount Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("FixIT API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});