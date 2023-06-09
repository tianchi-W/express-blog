var express = require("express");
const { Article } = require("../model/Article");
const { User } = require("../model/User");
const { Tag } = require("../model/Tag");
const { Classify } = require("../model/Classify");
const { deleteNull } = require("../utils/handleObj.js");
const auth = require("../middleware/auth.js");
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");
const { default: mongoose } = require("mongoose");
var router = express.Router();

// 获取文章列表
router.get("/", async (req, res, next) => {
  const { title, sortByDate, skip, limit } = req.query;
  const pageSize = 5;
  const currentPage = 0;

  const article = await Article.find(
    deleteNull({
      title: req.query?.title,
      classifyid: req.query.classifyid,
    })
  )
    .sort({ date: sortByDate == "td" ? -1 : 1 })
    .skip(skip ? skip : 0)
    .limit(limit ? limit : pageSize);
  const total = await Article.find(
    deleteNull({ title: req.query?.title, classifyid: req.query.classifyid })
  ).count();
  // responseClient(res, 200, 3, "查询成功", {
  //   total,
  //   article,
  //   limit: pageSize,
  //   current: +skip / limit + 1,
  // });

  res.send({
    code: 200,
    // @ts-ignore
    data: { total, article, limit: pageSize, current: +skip / limit + 1 },
  });
});
//通过id查询

router.post("/info", auth, async (req, res, next) => {
  const article = await Article.find({ _id: req.body._id });
  res.send({
    code: 200,
    data: article,
  });
});

function handleTag(params) {
  return params.map((item) => {
    return item.title;
  });
}
// 添加文章
router.post("/", auth, async (req, res, next) => {
  try {
    const userId = await User.findOne(
      { username: req.decoded.username },
      { new: true }
    );
    const tag = await Tag.find()
      .where("title")
      .in(req.body.tagtitle.split(","));
    const classify = await Classify.find({ title: req.body.classifyname })
      .where("title")
      .in(req.body.classifyname);
    const article = await Article.create({
      title: req.body.title,
      introduction: req.body.introduction,
      body: req.body.body,
      content: req.body.content,
      tags: tag,
      pic: req.body.pic,
      classifyid: new mongoose.Types.ObjectId(classify[0]._id),
      classifyname: classify[0].title,
      tagtitle: handleTag(tag),
      date: req.body.date,
      click: req.body.click,
      comment: req.body.comment,
      author: req.decoded.username,
    });
    await User.updateOne(
      {
        _id: userId._id,
      },
      {
        $push: {
          article_ids: article._id,
        },
      }
    );
    responseClient(res, 200, 3, "添加成功", {
      article,
    });
  } catch (error) {}
});
// 更新资源
router.put("/", auth, async (req, res) => {
  try {
    const {
      _id,
      title,
      introduction,
      body,
      content,
      classifyname,
      data,
      pic,
      click,
      tagtitle,
      comment,
    } = req.body;
    const tag = await Tag.find().where("title").in(tagtitle.split(","));
    const classify = await Classify.find({ title: classifyname });
    console.log(classify, classifyname, "classify");
    const article = await Article.findByIdAndUpdate(
      {
        _id,
      },
      {
        title,
        introduction,
        body,
        content,
        tags: tag,
        tagtitle: handleTag(tag),
        data,
        pic,
        classifyid: new mongoose.Types.ObjectId(classify[0]._id),
        classifyname: classify[0].title,
        click,
        comment,
      },
      { new: true }
    );
    res.send({
      code: 200,
      data: article,
    });
  } catch (error) {
    console.log(error);
  }
});
// 文章删除
router.delete("/", auth, async (req, res) => {
  const article = await Article.deleteOne({ _id: req.body._id });
  res.send({
    code: 200,
    data: article,
  });
});
module.exports = router;
