const bcrypt = require("bcrypt");
module.exports = {
  secretOrPrivateKey: "This is perfect projects.", // 这是加密的key（密钥） 根据个人自定义
  // 响应客户端
  responseClient(
    res,
    httpCode = 500,
    code = 3,
    message = "服务端异常",
    data = {}
  ) {
    let responseData = {};
    responseData.code = code;
    responseData.message = message;
    responseData.data = data;
    // res.status(httpCode).json(responseData);
    res.send({
      code: httpCode,
      message: message,
      data: data,
    });
  },
  // 时间 格式化成 2018-12-12 12:12:00
  timestampToTime(timestamp) {
    const date = new Date(timestamp);
    const Y = date.getFullYear() + "-";
    const M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    const D =
      date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
    const h =
      date.getHours() < 10
        ? "0" + date.getHours() + ":"
        : date.getHours() + ":";
    const m =
      date.getMinutes() < 10
        ? "0" + date.getMinutes() + ":"
        : date.getMinutes() + ":";
    const s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  },
};
