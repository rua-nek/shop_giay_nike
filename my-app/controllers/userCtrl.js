class userCtrl {
  async login(req, res) {
    try {
      res.render("page/user/login", { title: "Đăng nhập" });
    } catch (error) {
      console.error("Error rendering login page:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new userCtrl();
