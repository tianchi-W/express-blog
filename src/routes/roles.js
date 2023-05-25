var express = require("express");
var router = express.Router();
const { Role } = require("../model/Role");
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

/* 编辑权限
 */ router.post("/add", async function (req, res, next) {
  const { name, permissionNames } = req.body;
  try {
    const isRepeat = await Role.find({ name });
    if (isRepeat) {
      const role = await Role.create({
        name,
        permissionNames,
      });
      responseClient(res, 200, 3, " 添加成功", {
        role,
      });
    } else {
      const role = await Role.findByIdAndUpdate(
        { _id: isRepeat._id },
        {
          name,
          permissionNames,
        }
      );
      responseClient(res, 200, 3, " 添加成功", {
        role,
      });
    }
  } catch (error) {
    responseClient(res, 200, 3, error.keyValue.title, error);
  }
});

module.exports = router;
