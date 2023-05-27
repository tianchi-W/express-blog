var express = require("express");
var router = express.Router();
const { Permission } = require("../model/Permission");
const auth = require("../middleware/auth.js");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");

router.post("/", async function (req, res, next) {
  try {
    const permission = await Permission.find();
    responseClient(res, 200, 3, " 查询成功", {
      permission,
    });
  } catch (error) {
    console.log(error);
  }
});

/* 编辑权限
 */ router.post("/add", async function (req, res, next) {
  const { type, pid, name, path, icon } = req.body;
  try {
    const isRepeat = await Permission.find({ name });
    if (isRepeat) {
      const permission = await Permission.create({
        name,
        type,
        pid,
        path,
        icon,
      });
      responseClient(res, 200, 3, " 添加成功", {
        permission,
      });
    } else {
      const permission = await Permission.findByIdAndUpdate(
        { _id: isRepeat._id },
        {
          name,
          type,
          pid,
          path,
          icon,
        }
      );
      responseClient(res, 200, 3, " 添加成功", {
        permission,
      });
    }
  } catch (error) {
    responseClient(res, 200, 3, error, error);
  }
});

// 获取pid根据type
router.get("/getpidbytype", async function (req, res, next) {
  const { type } = req.query;
  try {
    const pid = await Permission.find({ type: type ? +type : type });
    responseClient(res, 200, 3, " 查询成功", {
      pid,
    });
  } catch (error) {}
});

module.exports = router;
