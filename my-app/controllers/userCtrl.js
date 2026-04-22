const User = require("../models/User");
const bcrypt = require("bcrypt"); // Nhớ cài đặt: npm install bcrypt

class userCtrl {
  // GET: Hiển thị form đăng nhập
  async login(req, res) {
    try {
      const registered = req.query.registered === "true";
      res.render("page/user/login", {
        layout: false, // Tắt layout main.hbs
        successMessage: registered
          ? "🎉 Đăng ký thành công! Vui lòng đăng nhập."
          : null,
      });
    } catch (error) {
      console.error("Error rendering login page:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // POST: Xử lý đăng nhập
  async loginPost(req, res) {
    try {
      const { email, mat_khau } = req.body;
      const oldData = { email };
      const errors = {};

      // Validation
      if (!email || email.trim() === "") {
        errors.email = "Vui lòng nhập email";
      }
      if (!mat_khau || mat_khau.trim() === "") {
        errors.mat_khau = "Vui lòng nhập mật khẩu";
      }

      if (Object.keys(errors).length > 0) {
        return res.render("page/user/login", {
          layout: false,
          errors,
          oldData,
        });
      }

      // Tìm user
      const user = await User.findOne({ email });
      if (!user) {
        errors.email = "Email không tồn tại";
        return res.render("page/user/login", {
          layout: false,
          errors,
          oldData,
        });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
      if (!isMatch) {
        errors.mat_khau = "Mật khẩu không chính xác";
        return res.render("page/user/login", {
          layout: false,
          errors,
          oldData,
        });
      }

      // ✅ LƯU SESSION - CHỈ LƯU NHỮNG THÔNG TIN CẦN THIẾT
      req.session.user = {
        id: user._id,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro, // "admin" hoặc "khach_hang"
      };

      // Chuyển hướng về trang chủ
      res.redirect("/");
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  // GET: Hiển thị form đăng ký
  async register(req, res) {
    try {
      res.render("page/user/register", { layout: false }); // Tắt layout
    } catch (error) {
      console.error("Error rendering register page:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  // GET: Đăng xuất
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error(err);
      res.redirect("/");
    });
  }

  // POST: Xử lý đăng ký
  async registerPost(req, res) {
    try {
      const {
        ho_ten,
        email,
        mat_khau,
        xac_nhan_mat_khau,
        so_dien_thoai,
        dia_chi,
      } = req.body;

      // 1. Khởi tạo object lưu lỗi và dữ liệu cũ
      const errors = {};
      const oldData = { ho_ten, email, so_dien_thoai, dia_chi };

      // 2. Validation
      if (!ho_ten || ho_ten.trim() === "") {
        errors.ho_ten = "Vui lòng nhập họ tên";
      }
      if (!email || email.trim() === "") {
        errors.email = "Vui lòng nhập email";
      } else {
        // Kiểm tra định dạng email đơn giản
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          errors.email = "Email không đúng định dạng";
        }
      }
      if (!mat_khau || mat_khau.length < 6) {
        errors.mat_khau = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (mat_khau !== xac_nhan_mat_khau) {
        errors.xac_nhan_mat_khau = "Mật khẩu xác nhận không khớp";
      }

      // 3. Kiểm tra email đã tồn tại trong database chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        errors.email = "Email này đã được đăng ký";
      }

      // 4. Nếu có lỗi, render lại form với thông báo
      if (Object.keys(errors).length > 0) {
        return res.render("page/user/register", {
          layout: false,
          errors,
          oldData,
          error: "Vui lòng kiểm tra lại thông tin bên dưới",
        });
      }

      // 5. Băm mật khẩu
      const hashedPassword = await bcrypt.hash(mat_khau, 10);

      // 6. Tạo user mới
      const newUser = new User({
        ho_ten: ho_ten.trim(),
        email: email.toLowerCase().trim(),
        mat_khau: hashedPassword,
        so_dien_thoai: so_dien_thoai?.trim(),
        dia_chi: dia_chi?.trim(),
        vai_tro: "khach_hang", // Mặc định là khách hàng
      });

      // 7. Lưu vào database
      await newUser.save();

      // 8. Chuyển hướng về trang đăng nhập kèm thông báo thành công
      res.redirect("/user?registered=true");
    } catch (error) {
      console.error("Error registering user:", error);
      // Render lại form với thông báo lỗi chung
      res.render("page/user/register", {
        layout: false,
        error: "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau",
        oldData: req.body,
      });
    }
  }
}

module.exports = new userCtrl();
