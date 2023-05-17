// 引入 mongoose
const mongoose = require("mongoose");
const consola = require("consola");

// 连接数据库，自动新建 ExpressApi 库
mongoose.connect(
  "mongodb://mongo:F0bfJhFG8lSvlK0iloWX@containers-us-west-48.railway.app:6610",
  {
    //   useNewUrlParser: true, // 避免“不建议使用当前URL字符串解析器”
    //   useCreateIndex: true, // 解决MongoDB弃用警告
    //   useUnifiedTopology: true, // 解决连接报错问题
    //   useFindAndModify: false,
  }
);
// 连接错误
mongoose.connection.on("error", (error) => {
  consola.warn("数据库连接失败!", error);
});

// 连接成功
mongoose.connection.once("open", () => {
  consola.ready("数据库连接成功!");
});

module.exports = mongoose;
