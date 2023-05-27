// 引入mongodb
const mongoose = require("../db/mongodb");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
// 建立用户表
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
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
  },
  isWx: {
    type: Boolean,
    default: false,
  },
  session_key: {
    type: String,
  },
  avatar: {
    type: String,
    default: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    default: "64719553d70880df069970c2",
  },
  sex: {
    type: String,
    default: "0",
  },
  age: {
    type: String,
    default: "",
  },
  article_ids: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: "Article",
      },
    ],
    default: [],
  },
  roleid: { type: String },
  rolename: { type: String },
});

// 建立用户数据库模型
const User = mongoose.model("User", UserSchema);
module.exports = { User };
