var express = require("express");
const { User } = require("../model/User");
var router = express.Router();

/* GET users listing. */
router.get("/api", function (req, res, next) {
  res.send("respond with a resource");
});

// 用户注册
router.post("/register", async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  res.send(user);
});

// 获取用户信息
router.get("/info/:username", async (req, res, next) => {
  console.log(req.params);
  const user = await User.findOne({
    username: req.params.username,
  });
  res.send({
    code: 200,
    data: user,
  });
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
