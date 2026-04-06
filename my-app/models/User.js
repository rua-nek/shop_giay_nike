// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ho_ten: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mat_khau: {
      type: String,
      required: true,
    },
    so_dien_thoai: String,
    dia_chi: String,
    vai_tro: {
      type: String,
      enum: ["khach_hang", "admin"],
      default: "khach_hang",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
