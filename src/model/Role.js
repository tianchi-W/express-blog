const mongoose = require("../db/mongodb");

const RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, require },
  permission: { type: [] },
  permissionNames: { type: [] },
});
//导出model模块
// 建立用户数据库模型
const Role = mongoose.model("Role", RoleSchema);
module.exports = { Role };
