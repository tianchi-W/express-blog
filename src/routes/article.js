var express = require("express");
const { Article } = require("../model/article");
const { deleteNull } = require("../utils/handleObj.js");
const auth = require("../middleware/auth.js");
var router = express.Router();

// 获取文章列表
router.get("/", async (req, res, next) => {
  const article = await Article.find(deleteNull({ title: req.query?.title }));
  res.send({
    code: 200,
    data: article,
  });
});
//通过id查询
router.post("/info", async (req, res, next) => {
  const article = await Article.find({ _id: req.body._id });
  res.send({
    code: 200,
    data: article,
  });
});

// 添加文章
router.post("/", async (req, res, next) => {
  const article = await Article.create({
    title: req.body.title,
    introduction: req.body.introduction,
    body: req.body.body,
    content: req.body.content,
    tags: req.body.tags,
    tagid: req.body.tagid,
    date: req.body.date,
    click: req.body.click,
    comment: req.body.comment,
    author: req.body.author,
  });
  res.send(article);
});
// 更新资源
router.put("/", async (req, res) => {
  const {
    _id,
    title,
    introduction,
    body,
    content,
    tags,
    tagid,
    data,
    click,
    comment,
    author,
  } = req.body;
  //   console.log(req);
  const article = await Article.findByIdAndUpdate(
    {
      _id,
    },
    {
      title,
      introduction,
      body,
      content,
      tags,
      tagid,
      data,
      click,
      comment,
      author,
    }
  );
  res.send({
    code: 200,
    data: article,
  });
});
// 文章删除
router.delete("/", async (req, res) => {
  const article = await Article.deleteOne({ _id: req.body._id });
  res.send({
    status: 200,
    data: article,
  });
});
module.exports = router;
