const { secretOrPrivateKey } = require("../utils/utils.js");
var request = require("request");
const { User } = require("../model/User");
//小程序信息
const config = {
  appid: "wx6946435a64110647",
  secret: "72cd1ed5ffa49563d2492d8b10c5ee9c",
};

const auth = async function (req, res, next) {
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
      if (response.statusCode === 200) {
        User.findOne({
          openid: data.openid,
        }).then(function (info) {
          console.log(info, "info");
        });
      } else {
        console.info("[error]", err);

        res.json(err);
      }
    }
  );
  //   if (req.get("Authorization")) {
  //     console.log(req.get("Authorization"));
  //     let authorization = req.get("Authorization").split(" ")[1];
  //     try {
  //       jwt.verify(authorization, secretOrPrivateKey);
  //     } catch (error) {
  //       if (error.name === "TokenExpiredError") {
  //         return res.send({ status: 400, message: "登录已过期，重新登录" });
  //       }
  //       if (error.name === "JsonWebTokenError") {
  //         return res.send({ status: 401, message: "无效的token" });
  //       }
  //       //其它原因导致的错误
  //       return res.send({ status: 500, message: "未知错误" });
  //     }
  //   } else {
  //     return res.send({ status: 500, message: "token不存在" });
  //   }

  next();
};

module.exports = auth;
