// const mongoose = require("mongoose");

// const otpSchema = new mongoose.Schema({
//   phone: {
//     type: String,
//     required: true,
//   },
//   otp: {
//     type: String,
//     required: true,
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
// }, { timestamps: true });

// /* 🔥 Auto delete expired OTPs (VERY IMPORTANT) */
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// module.exports = mongoose.model("Otp", otpSchema);



const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 🔥 auto delete after 5 minutes
  },
});

module.exports = mongoose.model("Otp", otpSchema);
