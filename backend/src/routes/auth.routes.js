const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
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
 
router.get("/me", auth, (req, res) => {
  res.json({success: true, message: `Hello User ${req.user.id}, you accessed a protected route!` });
});



module.exports = router;