var express = require("express");
var router = express.Router();
const { Role } = require("../model/Role");
const { Permission } = require("../model/Permission");
const auth = require("../middleware/auth.js");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");

router.post("/", async function (req, res, next) {
  try {
    const role = await Role.find();
    console.log(role, "kfld");
    responseClient(res, 200, 3, " 查询成功", {
      role,
    });
  } catch (error) {
    console.log(error);
  }
});
//获取权限通过id
router.post("/info", async function (req, res, next) {
  const role = await Role.find({ _id: req.body._id });
  responseClient(res, 200, 3, " 数据获取成功", {
    role,
  });
});
/* 编辑权限
 */ router.post("/add", async function (req, res, next) {
  const { name, permissionNames } = req.body;
  const permissionId = await Permission.find()
    .where("name")
    .in(permissionNames.split(","));
  console.log(permissionId, "fkdfkdl");
  try {
    const isRepeat = await Role.find({ name });
    if (!isRepeat.length) {
      const role = await Role.create({
        name,
        permissionNames: permissionNames.split(","),
        permission: permissionId,
      });
      responseClient(res, 200, 3, " 添加成功", {
        role,
      });
    } else {
      const role = await Role.findByIdAndUpdate(
        { _id: isRepeat[0]._id },
        {
          name,
          permissionNames: permissionNames.split(","),
          permission: permissionId,
        }
      );
      responseClient(res, 200, 3, " 添加成功", {
        role,
      });
    }
  } catch (error) {
    responseClient(res, 200, 3, error, error);
  }
});

module.exports = router;
