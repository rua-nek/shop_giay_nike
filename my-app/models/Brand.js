// models/Brand.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    ten_thuong_hieu: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: String,
    mo_ta: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Brand", brandSchema);
