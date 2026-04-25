const { Product } = require("../models"); // tự động đăng ký các model khác

class ProductCtrl {
  // GET: Trang danh sách sản phẩm
  async index(req, res) {
    try {
      const products = await Product.find({ trang_thai: true })
        .populate("danh_muc", "ten_danh_muc slug")
        .populate("thuong_hieu", "ten_thuong_hieu slug")
        .lean();

      res.render("page/product/index", {
        title: "Sản phẩm",
        products: products,
      });
    } catch (error) {
      console.error("Error rendering product page:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // GET: Trang chi tiết sản phẩm (theo slug)
  async detail(req, res) {
    try {
      const slug = req.params.slug;
      const product = await Product.findOne({ slug: slug, trang_thai: true })
        .populate("danh_muc", "ten_danh_muc slug")
        .populate("thuong_hieu", "ten_thuong_hieu slug")
        .lean();

      if (!product) {
        return res.status(404).send("Sản phẩm không tồn tại");
      }

      // Render view chi tiết sản phẩm
      res.render("page/product/detail", {
        product: product,
        layout: false, // Bỏ nếu dùng layout chung có header/footer
        title: product.ten_san_pham,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new ProductCtrl();
