var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { engine } = require("express-handlebars");
var mongoose = require("mongoose");
var session = require("express-session"); // Thêm session

var app = express();

// ===== KẾT NỐI MONGODB =====
mongoose
  .connect("mongodb://localhost:27017/mydatabase", {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== CẤU HÌNH VIEW ENGINE =====
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

// ===== MIDDLEWARE CƠ BẢN =====
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ===== SESSION MIDDLEWARE =====
app.use(
  session({
    secret: "mot-chuoi-bi-mat-cua-ban", // Nên đưa vào biến môi trường .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 ngày
  }),
);

// ===== MIDDLEWARE GÁN USER CHO TẤT CẢ VIEWS =====
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ===== ROUTES =====
var mainRouter = require("./routes/main");
app.use("/", mainRouter);

// ===== CATCH 404 AND FORWARD TO ERROR HANDLER =====
app.use(function (req, res, next) {
  next(createError(404));
});

// ===== ERROR HANDLER =====
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
