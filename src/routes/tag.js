var express = require("express");
var router = express.Router();
const { Tag } = require("../model/Tag");
const auth = require("../middleware/auth.js");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");

/* 添加. */
router.post("/", async function (req, res, next) {
  const { title, introduction, type, status } = req.body;
  try {
    const tag = await Tag.create({
      title,
      introduction,
      type,
      status,
    });

    responseClient(res, 200, 3, " 添加成功", {
      tag,
    });
  } catch (error) {
    responseClient(res, 200, 3, error.keyValue.title + " 名字重复", error);
  }
});

// get
router.get("/", async function (req, res, next) {
  const tag = await Tag.find();
  responseClient(res, 200, 3, "查询成功", {
    tag,
  });
});
router.post("/info", async function (req, res, next) {
  const tag = await Tag.find({ _id: req.body._id });
  responseClient(res, 200, 3, "查询成功", {
    tag,
  });
});

/* 更新. */
router.put("/", async function (req, res, next) {
  const { _id, title, introduction, type, status } = req.body;
  const tag = await Tag.findByIdAndUpdate(
    {
      _id,
    },
    {
      title,
      introduction,
      type,
      status,
    },
    { new: true }
  );
  responseClient(res, 200, 3, " 更新成功", {
    tag,
  });
});

// 删除
router.delete("/", auth, async (req, res) => {
  const tag = await Tag.deleteOne({ _id: req.body._id });
  responseClient(res, 200, 3, " 更新成功", {
    tag,
  });
});
module.exports = router;
