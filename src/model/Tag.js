const mongoose = require("../db/mongodb");

const TagsSchema = new mongoose.Schema({
  //标题
  title: { type: String, unique: true },
  //简介
  introduction: { type: String },
  //封面
  type: { type: String },
  //标签id
  status: { type: String },
});
//导出model模块
// 建立用户数据库模型
const Tag = mongoose.model("Tag", TagsSchema);
module.exports = { Tag };
