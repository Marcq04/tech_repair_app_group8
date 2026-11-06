import express from "express";
import { 
    getAllGuides, 
    getGuideById, 
    createGuide, 
    upvoteGuide 
} from "../controllers/guideController.js";

const router = express.Router();

router.get("/", getAllGuides);                   
router.get("/:guideId", getGuideById);           
router.post("/", createGuide);                   
router.patch("/:guideId/upvote", upvoteGuide);   

export default router;