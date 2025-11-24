import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    googleReviewUrl: { type: String, default: null },

    // OTP system
    sendOtp: {                                                                                                                                                                                                                                          
      otp: { type: String },
      exp: { type: Date },
    },
    verifyOtp: {
      otp: { type: String },
      exp: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
