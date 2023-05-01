const { secretOrPrivateKey } = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const auth = async function (req, res, next) {
  if (req.get("Authorization")) {
    let authorization = req.get("Authorization").split(" ")[1];
    try {
      jwt.verify(authorization, secretOrPrivateKey);
    } catch (error) {
      console.log(error.name);
      if (error.name === "TokenExpiredError") {
        return res.send({ status: 400, message: "登录已过期，重新登录" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.send({ status: 401, message: "无效的token" });
      }
      //其它原因导致的错误
      return res.send({ status: 500, message: "未知错误" });
    }
  } else {
    return res.send({ status: 500, message: "token不存在" });
  }

  next();
};

module.exports = auth;
