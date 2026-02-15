// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   name: String,
//   email: String,
//   dob: Date,
//   gender: {
//   type: String,
//   enum: ["Male", "Female"],
//   },
//   profileCompleted: { type: Boolean, default: false },


//   updateData: {
//   name: String,
//   email: String,
//   gender: String,
//   dob: String
// },
// updateOTP: String,
// updateOTPExpires: Date,

// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },

  name: { type: String, default: "" },
  email: { type: String, default: "" },

  dob: { type: Date },

  gender: {
    type: String,
    enum: ["Male", "Female"],
    default: null
  },

  profileCompleted: {
    type: Boolean,
    default: false
  },

  /* OTP for profile update */
  updateOTP: String,
  updateOTPExpires: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
