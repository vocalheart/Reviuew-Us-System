import express from "express";
import Feedback from "../models/Feedback.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit feedback
router.post("/feedback", async (req, res) => {
    try {
        const { qrCodeId, userId, name, email, rating, comments } = req.body;
        if (!qrCodeId || !userId || !name || !email || !rating || !comments) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }
        const feedback = await Feedback.create({ qrCodeId, userId, name, email, rating, comments });

        if (rating >= 4) {
            return res.status(201).json({ success: true, message: "Redirect to Google review", googleReviewLink: "" });
        } else {
            return res.status(201).json({ success: true, message: "Feedback saved. Thank you!" });
        }
    } catch (error) {
        console.error("Feedback Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get all feedbacks
router.get("/feedback", authMiddleware, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update feedback
router.put("/feedback/:id", async (req, res) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, feedback: updatedFeedback });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete feedback
router.delete("/feedback/:id", async (req, res) => {
    try {
        const deleted = await Feedback.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Feedback deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
