import express from "express";
import { 
    getAllGuides, 
    getGuideById, 
    createGuide, 
    upvoteGuide 
} from "../controllers/guideController.js";

const router = express.Router();

router.get("/", getAllGuides);                   // GET /api/guides (Supports query filters)
router.get("/:guideId", getGuideById);           // GET /api/guides/:guideId
router.post("/", createGuide);                   // POST /api/guides
router.patch("/:guideId/upvote", upvoteGuide);   // PATCH /api/guides/:guideId/upvote

export default router;