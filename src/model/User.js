// 引入mongodb
const mongoose = require("../db/mongodb");
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
// 建立用户表
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val, salt);
    },
    select: false,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
  openid: {
    type: String,
    unique: true,
  },
  isWx: {
    type: Boolean,
    default: false,
  },
  session_key: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
    default: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
  },
  sex: {
    type: String,
    default: "0",
  },
  age: {
    type: String,
    default: "",
  },
});

// 建立用户数据库模型
const User = mongoose.model("User", UserSchema);
module.exports = { User };
