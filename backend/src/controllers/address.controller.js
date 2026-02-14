const Address = require("../models/Address");

/**
 * ADD ADDRESS
 * POST /api/address
 */
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      addressType,
      fullName,
      phone,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !addressType ||
      !fullName ||
      !phone ||
      !house ||
      !area ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // normalize
    addressType = addressType.toUpperCase();

    // ❗ unset previous default address
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    const address = await Address.create({
      user: userId,
      addressType,
      fullName,
      phone,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      isDefault: true, // ✅ last saved becomes default
    });

    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

/**
 * GET ADDRESSES
 * GET /api/address
 */
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

/**
 * SELECT ADDRESS (for Home Page)
 * PUT /api/address/select/:id
 */
exports.selectAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    const selected = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true }
    );

    if (!selected) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      address: selected,
    });
  } catch (error) {
    console.error("SELECT ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to select address",
    });
  }
};

/**
 * UPDATE ADDRESS
 * PUT /api/address/:id
 */
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      req.body,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

/**
 * DELETE ADDRESS
 * DELETE /api/address/:id
 */
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};
