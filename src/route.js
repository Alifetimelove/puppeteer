const getImg = require("./puppeteer.js");
// const getImg = require("./puppeteerByPool");
const httpFun = require("./httpFun").httpFun;
const configInfo = require("./config").configInfo;
module.exports = (app) => {
  app.post("/api/getShareImg", (req, res) => {
    new httpFun()
      .replaceSvg(req.body)
      .then((result) => {
        new httpFun()
          .writeAFile(result, "ShareImg.xml")
          .then((result) => {
            getImg(req.body, "./src/svgxml/ShareImg.xml")
              .then((file) => {
                let param = {
                  svg: file,
                  storeId: req.body.storeId,
                  merchantId: req.body.merchantId,
                };
                new httpFun()
                  .uploadImage(
                    param,
                    configInfo.absolutePath,
                    configInfo.relativePath
                  )
                  .then((resultOne) => {
                    res.json({
                      code: 1,
                      data: resultOne.url,
                      msg: "",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      code: 0,
                      data: null,
                      msg: "图片生成失败",
                      err: String(err),
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  code: 0,
                  data: null,
                  msg: "图片生成失败",
                  err: String(err),
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              code: 0,
              data: null,
              msg: "图片生成失败",
              err: String(err),
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          code: 0,
          data: null,
          msg: "图片生成失败",
          err: String(err),
        });
      });
  });
  app.post("/api/compositePictureToSvg", (req, res) => {
    new httpFun()
      .compositePictureToSvg(req.body)
      .then((result) => {
        new httpFun()
          .writeAFile(result, "compositePicture.xml")
          .then((writeAFileResult) => {
            getImg(req.body, "./src/svgxml/compositePicture.xml")
              .then((file) => {
                let param = {
                  svg: file,
                  storeId: req.body.storeId,
                  merchantId: req.body.merchantId,
                };
                new httpFun()
                  .uploadImage(
                    param,
                    configInfo.compositePictureToSvgAbsolutePath,
                    configInfo.compositePictureToSvgRelativePath
                  )
                  .then((resultOne) => {
                    res.json({
                      code: 1,
                      data: resultOne.url,
                      msg: "",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json({
                      code: 0,
                      data: null,
                      msg: "图片生成失败",
                      err: String(err),
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  code: 0,
                  data: null,
                  msg: "图片生成失败",
                  err: String(err),
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              code: 0,
              data: null,
              msg: "图片生成失败",
              err: String(err),
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          code: 0,
          data: null,
          msg: "图片生成失败",
          err: String(err),
        });
      });
  });
};
