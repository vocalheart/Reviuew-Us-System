
import mongoose from "mongoose";

const feedbacksSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: Number, required: true },
    email: { type: Number, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedbacks", feedbacksSchema);
