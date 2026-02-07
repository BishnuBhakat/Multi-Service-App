const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

router.get("/me", auth, (req, res) => {
  res.json({
    success: true,
    message: "JWT is valid",
    userId: req.user.id,
  });
});

module.exports = router;