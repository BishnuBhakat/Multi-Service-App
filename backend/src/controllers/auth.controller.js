const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/otp");

/* ================= REGISTER ================= */

// Step 1: Send OTP
exports.registerSendOtp = async (req, res) => {
  const { name, phone, gender, dob } = req.body;

  const exists = await User.findOne({ phone });
  if (exists) {
    return res.status(400).json({ message: "Phone already registered" });
  }

  const otp = generateOTP();

  await User.create({
    name,
    phone,
    gender,
    dob,
    otp,
    otpExpiresAt: Date.now() + 5 * 60 * 1000 // 5 min
  });

  console.log("REGISTER OTP:", otp); // 🔴 SMS later

  res.json({
    success: true,
    message: "OTP sent to phone"
  });
};

// Step 2: Verify OTP
exports.registerVerifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone
    }
  });
};

/* ================= LOGIN ================= */

// Step 1: Send OTP
exports.loginSendOtp = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not registered" });

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
  await user.save();

  console.log("LOGIN OTP:", otp);

  res.json({
    success: true,
    message: "OTP sent"
  });
};

// Step 2: Verify OTP
exports.loginVerifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone
    }
  });
};
