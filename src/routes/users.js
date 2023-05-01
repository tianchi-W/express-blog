var express = require("express");
const { User } = require("../model/User");
const bcrypt = require("bcrypt");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// 用户注册
router.post("/register", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (
    username == null ||
    username.trim() == "" ||
    password == null ||
    password.trim() == ""
  ) {
    res.send({ code: 500, message: "用户名密码不能为空" });
    return;
  }
  const isRepeat = await User.findOne({ username });

  if (isRepeat) {
    responseClient(res, 500, 3, "用户已经注册过了");
  } else {
    const user = await User.create({
      username,
      password,
    });
    user
      ? responseClient(res, 200, 3, "注册成功")
      : responseClient(res, 500, 3, "注册失败");
  }
});

// 获取用户信息
router.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  /***jwt生成token***/
  let content = { username: username }; // 要生成token的主题信息
  let token = jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 24 * 7, // 一周过期
  });
  if (
    username == null ||
    username.trim() == "" ||
    password == null ||
    password.trim() == ""
  ) {
    responseClient(res, 500, 3, "用户密码不能为空");
    return;
  }

  const user = await User.findOne({
    username,
  }).select("+password");
  if (user) {
    // @ts-ignore
    if (bcrypt.compareSync(password, user.password)) {
      res.send({
        code: 200,
        msg: "登录成功",
        token,
      });
    } else {
      responseClient(res, 500, 3, "密码错误");
    }
  } else {
    responseClient(res, 500, 3, "用户不存在");
  }
});

// 获取用户列表
router.get("/list", async (req, res, next) => {
  const user = await User.find();
  res.send({
    code: 200,
    msg: "获取成功",
    data: user,
  });
});
module.exports = router;
