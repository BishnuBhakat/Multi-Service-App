// const mongoose = require("mongoose");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true, required: true },
    gender: String,
    dob: Date,

    otp: String,
    otpExpiresAt: Date,

    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);