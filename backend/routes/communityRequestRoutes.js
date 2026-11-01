import express from "express";
import {
    createRequest,
    getAllRequests,
    getRequestById,
    addReply,
    markResolved
} from "../controllers/communityRequestController.js";

const router = express.Router();

router.get("/", getAllRequests);                      // GET /api/requests
router.get("/:requestId", getRequestById);              // GET /api/requests/:requestId
router.post("/", createRequest);                      // POST /api/requests
router.post("/:requestId/replies", addReply);           // POST /api/requests/:requestId/replies
router.patch("/:requestId/resolve", markResolved);      // PATCH /api/requests/:requestId/resolve

export default router;