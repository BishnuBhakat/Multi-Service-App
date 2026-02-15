// const router = require("express").Router();
// const auth = require("../middleware/authMiddleware");
// const {
//   registerSendOtp,
//   registerVerifyOtp,
//   loginSendOtp,
//   loginVerifyOtp
// } = require("../controllers/auth.controller");

// // // Register
// // router.post("/register/send-otp", registerSendOtp);
// // router.post("/register/verify-otp", registerVerifyOtp);

// // // Login
// // router.post("/login/send-otp", loginSendOtp);
// // router.post("/login/verify-otp", loginVerifyOtp);

// router.post("/api/auth/send-otp");
// router.post("/api/auth/verify-otp");
// router.post("/api/auth/complete-profile");

 
// router.get("/me", auth, (req, res) => {
//   res.json({success: true, message: `Hello User ${req.user.id}, you accessed a protected route!` });
// });



// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
} = require("../controllers/auth.controller");

// Send OTP (login or signup)
router.post("/send-otp", sendOtp);

// Verify OTP (login or signup)
router.post("/verify-otp", verifyOtp);


module.exports = router;


// new

