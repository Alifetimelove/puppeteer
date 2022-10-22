let fs = require("fs");
let path = require("path");
const { v4: uuidv4 } = require("uuid");
let preUrl = "./src/svgxml/";
const { json } = require("express");
let moment = require("moment");
const http = require("http");
const os = require("os");
const configInfo = require("./config").configInfo;
// data 是新文件的内容，字符串
// fileName是新文件的名字，字符串
let httpFun = function () {};
httpFun.prototype.writeAFile = function (data, fileName) {
  data = data.replace(
    "/Market/static/template_v2_js/images/qrcodeimg.png",
    "./../img/qrcodeimg.png"
  );
  data = data.replace(
    "/Market/static/template_v2_js/images/barcodeimg.png",
    "./../img/barcodeimg.png"
  );
  let _path = preUrl + fileName;
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(preUrl), { recursive: true }, (err) => {
      if (err) {
        resolve(err);
      } else {
        fs.writeFile(_path, data, function (err) {
          if (err) {
            // 写入文件失败
            console.log("写入文件失败:", err);
            resolve({
              code: "error",
            });
          } else {
            // 写入文件成功
            console.log("写入文件成功");
            err = {
              code: "success",
            };
            resolve(err);
          }
        });
      }
    });
  });
};
httpFun.prototype.uploadImage = function (data, req, res) {
  return new Promise(function (resolve, reject) {
    const svg = data.svg;
    function decodeBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error("Invalid input string");
      }

      response.type = matches[1];
      response.data = new Buffer.from(matches[2], "base64");

      return response;
    }
    var imageBuffer = decodeBase64Image(svg);
    var current_time = moment(Date.now()).format("YYYY-MM-DD");
    var uuid = uuidv4();
    var filePath =
      configInfo.absolutePath +
      data.merchantId +
      "/" +
      data.storeId +
      "/" +
      current_time +
      "/";
    var _path = filePath + uuid + ".png";
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) {
        resolve(err);
      } else {
        fs.writeFile(_path, imageBuffer.data, function (err) {
          if (err) {
            // 写入文件失败
            console.log("写入文件失败:", err);
          } else {
            var newPath =
              configInfo.relativePath +
              data.merchantId +
              "/" +
              data.storeId +
              "/" +
              current_time +
              "/" +
              uuid +
              ".png";
            resolve({
              url: newPath,
            });
          }
        });
      }
    });
  });
};
module.exports.httpFun = httpFun;
