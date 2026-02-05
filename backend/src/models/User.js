const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    dob: {
      type: Date,
      required: true
    },

    // OTP fields (temporary)
    otp: {
      type: String
    },

    otpExpiresAt: {
      type: Date
    },

    // account state
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
