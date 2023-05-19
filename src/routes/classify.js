var express = require("express");
var router = express.Router();
const { Classify } = require("../model/Classify");
const { Article } = require("../model/Article");
const auth = require("../middleware/auth.js");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");
const { default: mongoose } = require("mongoose");

/* 添加. */
router.post("/", async function (req, res, next) {
  const { title, introduction, type, status } = req.body;
  try {
    const classify = await Classify.create({
      title,
      introduction,
      type,
      status,
    });

    responseClient(res, 200, 3, " 添加成功", {
      classify,
    });
  } catch (error) {
    responseClient(res, 200, 3, error.keyValue.title + " 名字重复", error);
  }
});

// get
router.get("/", async function (req, res, next) {
  const classify = await Classify.find();
  responseClient(res, 200, 3, "查询成功", {
    classify,
  });
});
router.post("/info", async function (req, res, next) {
  const classify = await Classify.find({ _id: req.body._id });
  responseClient(res, 200, 3, "查询成功", {
    classify,
  });
});

/* 更新. */
router.put("/", async function (req, res, next) {
  const { _id, title, introduction, type, status } = req.body;
  const classify = await Classify.findByIdAndUpdate(
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
    classify,
  });
});

// 删除
router.delete("/", auth, async (req, res) => {
  try {
    console.log(req.body._id, "fdk");
    const res = await Article.updateMany(
      {
        classifyid: req.body._id,
      },
      //更新为默认分类
      {
        classifyid: new mongoose.Types.ObjectId("646729ab31537aab6352b27e"),
        classifyname: "编程",
      }
    );
  } catch (error) {
    console.log(error);
  }
  const classify = await Classify.deleteOne({ _id: req.body._id });

  responseClient(res, 200, 3, " 删除成功", {
    classify,
  });
});
module.exports = router;
