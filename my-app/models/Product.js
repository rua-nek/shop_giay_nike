const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  sku: { type: String, unique: true, sparse: true },
  gia: { type: Number, required: true },
  ton_kho: { type: Number, default: 0 },
  anh_bien_the: String,
});

const productSchema = new mongoose.Schema(
  {
    ten_san_pham: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    danh_muc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    thuong_hieu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    gia_goc: { type: Number, required: true },
    gia_khuyen_mai: { type: Number },
    mo_ta: { type: String, trim: true },
    anh_chinh: { type: String, required: true },
    bien_the: [variantSchema],
    trang_thai: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
