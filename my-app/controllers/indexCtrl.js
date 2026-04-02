class indexCtrl {
  index = (req, res) => {
    res.render("index", { title: "Express" });
  };
}

module.exports = new indexCtrl();