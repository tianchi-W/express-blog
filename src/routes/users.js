var express = require("express");
const { User } = require("../model/User");
const bcrypt = require("bcrypt");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");
const svgCaptcha = require("svg-captcha");
var request = require("request");

//小程序信息
const config = {
  appid: "wx6946435a64110647",
  secret: "72cd1ed5ffa49563d2492d8b10c5ee9c",
};
//生成token
function createToken() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const length = chars.length;

  let str = "";

  for (let i = 0; i < length; i++) {
    str += chars.substr(Math.round(Math.random() * length), 1);
  }

  return str;
}
router.get("/wxlogin", function (req, res, next) {
  // var nickname = req.query.nickName;

  // var head_img = req.query.head_img;

  // var code = req.query.code;

  // var param = {};

  // param.nickname = nickname;

  // param.head_img = head_img;

  // param.code = code;

  // param.creatAt = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(req.query);
  request.get(
    {
      url: "https://api.weixin.qq.com/sns/jscode2session",

      json: true,

      qs: {
        grant_type: "authorization_code",

        appid: config.appid,

        secret: config.secret,

        js_code: req.query.code,
      },
    },
    function (err, response, data) {
      console.log(data, "data");
      if (response.statusCode === 200) {
        if (data.openid) {
          User.findOne({
            openid: data.openid,
          }).then(function (info) {
            if (info) {
              console.log(info);
              console.info("用户已经存在");
              User.findByIdAndUpdate(
                { _id: info._id },
                { session_key: data.session_key }
              ).then((r) => {
                /***jwt生成token***/
                let content = { _id: r?._id }; // 要生成token的主题信息
                let token = jwt.sign(content, secretOrPrivateKey, {
                  expiresIn: 60, // 一周过期
                });

                responseClient(res, 200, 3, "登录成功", { _id: r?._id, token });
              });
              // console.info(info.token);

              // return res.send(token);
            } else {
              const user = User.create({
                openid: data.openid,
                isWx: true,
                session_key: data.session_key,
              }).then((r) => {
                console.log(r);
                responseClient(res, 200, 3, "第一次登录成功", { _id: r._id });
              });
              // var user = new User({
              //   openid: data.openid,

              //   nickName: param.nickname,

              //   avatarUrl: param.head_img,

              //   creatAt: param.creatAt,

              //   token: createToken(),
              // });
            }
          });
        }
      } else {
        console.info("[error]", err);

        res.json(err);
      }
    }
  );
});

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
//
// 登录
router.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);
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
      // res.send({
      //   code: 200,
      //   msg: "登录成功",
      //   token,
      // });
      responseClient(res, 200, 3, "登录成功", { token, username });
    } else {
      responseClient(res, 300, 3, "密码错误");
    }
  } else {
    responseClient(res, 500, 3, "用户不存在");
  }
});

// 验证码验证
router.get("/getInfo", async (req, res, next) => {
  // 下面这行代码是随机生成验证码图片和文本并返回给客户端
  const img = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: "0o1i", // 验证码字符中排除 0o1i
    color: true, // 验证码是否有彩色
    noise: 1, //干扰线
    background: "#666", // 背景颜色
    height: 40,
    inverse: false,
    fontSize: 40,
  });
  res.send(img);
});
module.exports = router;
