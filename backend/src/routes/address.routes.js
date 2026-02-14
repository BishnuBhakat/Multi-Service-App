const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");

// Add new address
router.post("/", authMiddleware, addAddress);

// Get all addresses of logged-in user
router.get("/", authMiddleware, getAddresses);

// Update address
router.put("/:id", authMiddleware, updateAddress);

// Delete address
router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;
