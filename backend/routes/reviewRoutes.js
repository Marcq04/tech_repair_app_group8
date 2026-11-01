import express from "express";
import { 
    createReview, 
    getGuideReviews 
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/guide/:guideId", createReview);      // POST /api/reviews/guide/:guideId
router.get("/guide/:guideId", getGuideReviews);    // GET /api/reviews/guide/:guideId

export default router;