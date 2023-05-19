const createError = require("http-errors");
const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./src/routes/index");
const usersRouter = require("./src/routes/users");
const ArticleRouter = require("./src/routes/article");
const uploadRouter = require("./src/routes/upload");
const tagsRouter = require("./src/routes/tag");
const classifyRouter = require("./src/routes/classify");

const cors = require("cors");
// const auth = require("./src/middleware/auth");

// ​

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Accept,Content-type"
  );
  res.header("Access-Control-Allow-Credentials", true);
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method.toLowerCase() == "options")
    res.sendStatus(200); //让options尝试请求快速结束
  else next();
});
app.disable("etag");
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/article", ArticleRouter);
app.use("/upload", uploadRouter);
app.use("/tag", tagsRouter);
app.use("/classify", classifyRouter);
//404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
