const mongoose = require("../db/mongodb");

const ArticleSchema = new mongoose.Schema({
  //标题
  title: { type: String },
  //简介
  introduction: { type: String },
  //封面
  cover: { type: String },
  //内容(markdown)
  body: { type: String },
  //html
  content: { type: String },
  //所含标签的对象集合
  tags: { type: Array },
  //标签的title
  tagtitle: { type: Array },
  //更新日期
  date: { type: String },
  pic: {
    type: String,
    default: "http://rudxzhmj6.bkt.clouddn.com/1684570899517.png",
  },
  //点击量
  click: { type: Number },
  //评论数量
  comment: { type: String },
  classifyid: { type: mongoose.SchemaTypes.ObjectId, ref: "Classify" },
  classifyname: { type: String },
  //作者
  // author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  username: { type: String },
  author: { type: String },
});
//导出model模块
// 建立用户数据库模型
const Article = mongoose.model("Article", ArticleSchema);
module.exports = { Article };
