import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import QrImage from "../models/QrImage.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage});

// AWS S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Upload QR
router.post("/upload-qr", authMiddleware, upload.single("qr"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileName, Body: req.file.buffer, ContentType: req.file.mimetype };
        await s3.send(new PutObjectCommand(params));

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        const qrDoc = await QrImage.create({ user: req.user._id, imageUrl });
        res.status(200).json({ success: true, message: "QR uploaded successfully", url: imageUrl });
    } catch (error) {
        console.error("Upload QR Error:", error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});

// Get latest QR for logged-in user
router.get("/qr", authMiddleware, async (req, res) => {
    try {
        const qr = await QrImage.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        if (!qr) return res.status(404).json({ message: "No QR found" });
        res.json({ success: true, qr });
    } catch (error) {
        console.error("Fetch QR Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
