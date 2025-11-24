import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update Google Review URL
router.post('/google-reviewurl', authMiddleware, async (req, res) => {
    const userId = req.user._id;
    const { url } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { googleReviewUrl: url }, { new: true });
        if (!updatedUser) return res.status(404).json({ ok: false, msg: "User not found" });

        res.json({ ok: true, msg: "Google Review URL updated", googleReviewUrl: updatedUser.googleReviewUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Server error" });
    }
});

// Get Google Review URL
router.get('/google-reviewurl', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ ok: false, msg: "User not found" });

        res.json({ ok: true, googleReviewUrl: user.googleReviewUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Server error" });
    }
});

export default router;
