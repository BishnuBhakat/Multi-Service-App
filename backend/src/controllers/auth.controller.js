// const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { generateOTP } = require("../models/Otp");  ----->>> eta off 

//Send OTP
const User = require("../models/User");
const Otp = require("../models/Otp");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.status(400).json({ message: "Phone required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndUpdate(
    { phone },
    { otp: code, createdAt: Date.now() },
    { upsert: true }
  );

  console.log("OTP:", code); // SMS later

  res.json({ success: true });
};


//Verify OTP
// const jwt = require("jsonwebtoken");   ----->> eta off korechi

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const record = await Otp.findOne({ phone });

  if (!record || record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // 🔥 check if user exists
  let user = await User.findOne({ phone });

  let isNewUser = false;

  if (!user) {
    // create user with only phone
    user = await User.create({ phone });
    isNewUser = true;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    isNewUser,
  });
};


//Complete Profile
exports.completeProfile = async (req, res) => {
  const userId = req.user.id;

  const { name, email, dob } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, dob, profileCompleted: true },
    { new: true }
  );

  res.json({ success: true, user });
};



// new





