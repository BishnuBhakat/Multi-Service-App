// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   sendUpdateOtp,
//   verifyUpdateOtp,
//   getMe,
//   completeProfile
// } = require("../controllers/user.controller");

// /* ================= USER PROFILE ================= */

// // get logged in user
// router.get("/me", authMiddleware, getMe);
// // => {
// //   res.json({
// //     success: true,
// //     message: "JWT is valid",
// //     userId: req.user.id
// //   });
// // });

// /* ================= PROFILE UPDATE FLOW ================= */

// // Step 1 → send otp
// router.post("/send-update-otp", authMiddleware, sendUpdateOtp);

// router.post("/complete-profile", completeProfile);

// // Step 2 → verify otp + update profile
// router.post("/verify-update-otp", authMiddleware, verifyUpdateOtp);

// module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  sendUpdateOtp,
  verifyUpdateOtp,
  getMe,
  completeProfile
} = require("../controllers/user.controller");

// get profile
router.get("/me", authMiddleware, getMe);

// send otp for edit profile
router.post("/send-update-otp", authMiddleware, sendUpdateOtp);

// complete profile (NEW USER)
router.post("/complete-profile", authMiddleware, completeProfile);

// verify otp + update profile
router.post("/verify-update-otp", authMiddleware, verifyUpdateOtp);

module.exports = router;
