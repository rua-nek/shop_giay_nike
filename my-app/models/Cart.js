const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sku: String, // SKU của biến thể
  size: String, // Size đã chọn
  so_luong: {
    type: Number,
    required: true,
    min: 1,
  },
  gia: {
    type: Number,
    required: true, // Giá tại thời điểm thêm vào (có thể là giá khuyến mãi hoặc giá biến thể)
  },
  anh: String, // Ảnh biến thể (nếu có) hoặc ảnh chính
  ten_san_pham: String, // Lưu thêm tên sản phẩm để tiện hiển thị
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Mỗi user chỉ có 1 giỏ hàng
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
