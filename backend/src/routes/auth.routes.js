const router = require("express").Router();
const {
  registerSendOtp,
  registerVerifyOtp,
  loginSendOtp,
  loginVerifyOtp
} = require("../controllers/auth.controller");

// Register
router.post("/register/send-otp", registerSendOtp);
router.post("/register/verify-otp", registerVerifyOtp);

// Login
router.post("/login/send-otp", loginSendOtp);
router.post("/login/verify-otp", loginVerifyOtp);

module.exports = router;
