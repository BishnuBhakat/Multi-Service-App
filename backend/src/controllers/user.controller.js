const User = require("../models/User");

/* ================= SEND OTP ================= */
exports.sendUpdateOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ CORRECT FIELD NAMES
    user.updateOTP = otp;
    user.updateOTPExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    console.log("========= OTP GENERATED =========");
    console.log("User:", user.phone);
    console.log("OTP:", otp);
    console.log("Expires:", user.updateOTPExpires);
    console.log("=================================");

    res.json({ success: true });

  } catch (err) {
    console.log("SEND OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
};



exports.completeProfile = async (req, res) => {
try {
  const { name, email, gender, dob } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ success:false, message:"Unauthorized" });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success:false });

  /* convert dd/mm/yyyy → Date */
  const dateObj = new Date(dob.split("/").reverse().join("-"));

  user.name = name;
  user.email = email;
  user.gender = gender;
  user.dob = dateObj;
  user.profileCompleted = true;

  await user.save();

  res.json({ success: true });

} catch (err) {
  console.log("COMPLETE PROFILE ERROR:", err);
  res.status(500).json({ success: false });
}
};


/* ================= VERIFY OTP + UPDATE PROFILE ================= */
exports.verifyUpdateOtp = async (req, res) => {
  try {
    const { otp, name, email, gender, dob } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false });

    // ❗ IMPORTANT
    if (!user.updateOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    const storedOtp = String(user.updateOTP).trim();
    const enteredOtp = String(otp).trim();

    console.log("===== VERIFY ATTEMPT =====");
    console.log("Stored OTP:", storedOtp);
    console.log("Entered OTP:", enteredOtp);
    console.log("Expire:", user.updateOTPExpires);
    console.log("Now:", new Date());
    console.log("==========================");

    /* OTP MATCH CHECK */
    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    /* EXPIRY CHECK */
    if (user.updateOTPExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    /* UPDATE PROFILE */
    user.name = name;
    user.email = email;
    user.gender = gender;
    user.dob = new Date(dob.split("/").reverse().join("-"));

    /* CLEAR OTP */
    user.updateOTP = undefined;
    user.updateOTPExpires = undefined;

    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* ================= GET CURRENT USER ================= */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.log("GET ME ERROR:", err);
    res.status(500).json({ success: false });
  }
};
