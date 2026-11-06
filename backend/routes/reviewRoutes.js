import express from "express";
import { 
    createReview, 
    getGuideReviews 
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/guide/:guideId", createReview);      
router.get("/guide/:guideId", getGuideReviews);    

export default router;