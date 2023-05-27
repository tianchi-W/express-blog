var express = require("express");
const { User } = require("../model/User");
const bcrypt = require("bcryptjs");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");
const svgCaptcha = require("svg-captcha");
var request = require("request");
const auth = require("../middleware/auth.js");

//小程序信息
const config = {
  appid: "wx6946435a64110647",
  secret: "72cd1ed5ffa49563d2492d8b10c5ee9c",
};

router.get("/wxlogin", function (req, res, next) {
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
              User.findByIdAndUpdate(
                { _id: info._id },
                { session_key: data.session_key }
              ).then((r) => {
                /***jwt生成token***/
                let content = { _id: r?._id }; // 要生成token的主题信息
                let token = jwt.sign(content, secretOrPrivateKey, {
                  expiresIn: 7 * 24 * 60 * 60, // 一周过期
                });

                responseClient(res, 200, 3, "登录成功", {
                  _id: r?._id,
                  token,
                });
              });
            } else {
              const user = User.create({
                openid: data.openid,
                isWx: true,
                session_key: data.session_key,
              }).then((r) => {
                /***jwt生成token***/
                let content = { _id: r?._id }; // 要生成token的主题信息
                let token = jwt.sign(content, secretOrPrivateKey, {
                  expiresIn: 7 * 24 * 60 * 60, // 一周过期
                });

                responseClient(res, 200, 3, "登录成功", {
                  _id: r?._id,
                  token,
                });
              });
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
// 用户普通信息修改

router.put("/", auth, async (req, res) => {
  const { _id, username, updateTime, isWx, avatar, age, sex } = req.body;
  //   console.log(req);

  try {
    const user = await User.findByIdAndUpdate(
      {
        _id,
      },
      {
        username,
        updateTime,
        isWx,
        avatar,
        age,
        sex,
      },
      { new: true }
    );
    responseClient(res, 200, 3, "更新成功", {
      username: user?.username,
      avatar: user?.avatar,
      age: user?.age,
    });
  } catch (error) {
    responseClient(res, error.code, 3, error.codeName, {
      keyValue: `${error.keyValue.username}已经存在了`,
    });
    console.log(error.code, "code");
  }
});
/* GET users listing. */
router.get("/", auth, async function (req, res, next) {
  console.log(req.query, "req");
  const user = await User.find({ _id: req.query._id });
  console.log(user, "user");
  responseClient(res, 200, 3, "", user);
});
router.get("/list", auth, async function (req, res, next) {
  console.log(req.query, "req");
  const user = await User.find();
  console.log(user, "user");
  responseClient(res, 200, 3, "", user);
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
  try {
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
  } catch (error) {
    console.log(error, "error");
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
      responseClient(res, 200, 3, "登录成功", { token, username, user });
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
