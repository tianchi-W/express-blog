const mongoose = require("../db/mongodb");

const PermissionSchema = new mongoose.Schema({
  name: { type: String, unique: true, require },
  type: { type: String }, //一级菜单 二级菜单
  pid: { type: String }, //父级
  path: { type: String },
  icon: { type: String },
});
//导出model模块
// 建立用户数据库模型
const Permission = mongoose.model("Permission", PermissionSchema);
module.exports = { Permission };
