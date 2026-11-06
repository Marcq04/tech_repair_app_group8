import express from "express";
import {
    createRequest,
    getAllRequests,
    getRequestById,
    addReply,
    markResolved
} from "../controllers/communityRequestController.js";

const router = express.Router();

router.get("/", getAllRequests);                      
router.get("/:requestId", getRequestById);              
router.post("/", createRequest);                      
router.post("/:requestId/replies", addReply);           
router.patch("/:requestId/resolve", markResolved);      

export default router;