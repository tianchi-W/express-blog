const mongoose = require("../db/mongodb");

const ClassifySchema = new mongoose.Schema({
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
const Classify = mongoose.model("Classify", ClassifySchema);
module.exports = { Classify };
