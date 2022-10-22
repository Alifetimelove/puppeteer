const getImg = require("./puppeteer.js");
// const getImg = require("./puppeteerByPool");
const httpFun = require("./httpFun").httpFun;
module.exports = (app) => {
  app.post("/api/getShareImg", (req, res) => {
    new httpFun()
      .writeAFile(req.body.svgStyle, "svg.xml")
      .then((result) => {
        console.log(result);
        getImg(req.body)
          .then((file) => {
            let param = {
              svg: file,
              storeId: req.body.storeId,
              merchantId: req.body.merchantId,
            };
            new httpFun()
              .uploadImage(param, req, res)
              .then((resultOne) => {
                console.log(resultOne);
                res.json({
                  code: 1,
                  data: resultOne.url,
                  msg: "",
                });
              })
              .catch((err) => {
                console.log(err);
              });
            // res.json({
            //     code: 1,
            //     data: file,
            //     msg: ""
            // })
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
      .catch((err) => {});
  });
};
