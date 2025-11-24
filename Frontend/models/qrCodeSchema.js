import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    paramCode: { type: String, required: true, unique: true }, // unique param id
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // linked user
    qrImageUrl: { type: String, required: true }, // AWS S3 image URL
  },
  { timestamps: true }
);

export default mongoose.model("QrCode", qrCodeSchema);
