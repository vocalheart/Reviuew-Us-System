import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    qrCodeId: { type: mongoose.Schema.Types.ObjectId, ref: "QrCode", required: true }, // which QR was scanned
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // which user owns that QR

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
