const multer = require("multer"); // npm install multer 文件上传中间件
var express = require("express");
var router = express.Router();
const { secretOrPrivateKey, responseClient } = require("../utils/utils.js");
// 七牛云模块
const qiniu = require("qiniu");
const fs = require("fs");
let accessKey = "ecXE9hmH2Vv4_N7VRvxgGJcWnC2WclRXH6ONuTAy"; //可在个人中心查看
let secretKey = "iNGPBso7BqSx6AQ10d3oMCd1zurtXVyOPeQd84lQ"; //可在个人中心查看
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let options = {
  scope: "wei-s3", //空间的名字
};
let putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);
let config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_cn_east_2; //华东区
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;
const baseUrl = "http://rudxzhmj6.bkt.clouddn.com/"; //七牛云空间访问的域名
//七牛云 - 对象存储 - 图片上传
// 上传图片
console.log("fdkl");
router.post(
  "/qiniu_upload",
  multer({ dest: "./public/img/" }).array("file", 1),
  function (req, res, next) {
    console.log(req.files, "files");
    let files = req.files;
    let file = files[0];
    let name = Date.now().toString();
    let suffix = ".png";
    let path = "./public/img/" + name + suffix;
    fs.renameSync("./public/img/" + file.filename, path);
    let localFile = path;
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    let key = name + suffix;
    // 文件上传
    formUploader.putFile(
      uploadToken,
      key,
      localFile,
      putExtra,
      function (respErr, respBody, respInfo) {
        console.log(respInfo, respBody, "resp");
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          console.log(333);
          responseClient(res, 200, 3, "上传成功", {
            url: baseUrl + respBody.key,
          });
        } else {
          console.log(respInfo, "k");
          res.json({
            status: "-1",
            result: {},
            msg: "上传失败",
          });
          responseClient(res, -1, 3, "上传失败");
        }
        fs.unlinkSync(path);
      }
    );
  }
);
module.exports = router;
