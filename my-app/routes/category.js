var express = require("express");
var router = express.Router();
const Category = require("../models/Category");

// POST: thêm danh mục
router.post("/add", async (req, res) => {
  try {
    const { ten_danh_muc, slug, mo_ta } = req.body;

    const newCategory = await Category.create({
      ten_danh_muc,
      slug,
      mo_ta,
    });

    res.json({
      message: "Thêm thành công",
      data: newCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
