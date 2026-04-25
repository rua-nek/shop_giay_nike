const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  // Thêm sản phẩm vào giỏ hàng
  async addToCart(req, res) {
    try {
      const { slug, sku, size, quantity } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Vui lòng đăng nhập" });
      }

      // Tìm sản phẩm theo slug
      const product = await Product.findOne({ slug, trang_thai: true });
      if (!product) {
        return res.status(404).json({ error: "Sản phẩm không tồn tại" });
      }

      // Tìm biến thể theo SKU hoặc size
      const variant = product.bien_the.find(
        (v) => v.sku === sku || v.size === size,
      );
      if (!variant) {
        return res.status(400).json({ error: "Biến thể không hợp lệ" });
      }

      if (variant.ton_kho < quantity) {
        return res.status(400).json({ error: "Số lượng tồn kho không đủ" });
      }

      // Giá sử dụng giá khuyến mãi nếu có, nếu không dùng giá gốc, hoặc giá riêng của biến thể (nếu có)
      const price = product.gia_khuyen_mai || variant.gia || product.gia_goc;

      // Tìm giỏ hàng của user, nếu chưa có thì tạo mới
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      // Kiểm tra sản phẩm đã có trong giỏ chưa (theo SKU)
      const existingItemIndex = cart.items.findIndex(
        (item) => item.sku === variant.sku,
      );

      if (existingItemIndex > -1) {
        // Nếu đã có, tăng số lượng
        cart.items[existingItemIndex].so_luong += quantity;
        // Cập nhật giá mới nhất (tùy ý)
        cart.items[existingItemIndex].gia = price;
      } else {
        // Thêm mới vào giỏ
        cart.items.push({
          product: product._id,
          sku: variant.sku,
          size: variant.size,
          so_luong: quantity,
          gia: price,
          anh: variant.anh_bien_the || product.anh_chinh,
          ten_san_pham: product.ten_san_pham,
        });
      }

      await cart.save();

      // Trả về thông báo thành công (có thể redirect hoặc gửi JSON tùy ý)
      res.json({ success: true, message: "Đã thêm vào giỏ hàng", cart });
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Xem giỏ hàng (trang giỏ hàng)
  async viewCart(req, res) {
    try {
      const userId = req.session.user?.id;
      if (!userId) {
        return res.redirect("/user/login");
      }
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
        "ten_san_pham anh_chinh slug",
      );
      res.render("page/cart/index", { cart, layout: false });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }
}

module.exports = new CartController();
