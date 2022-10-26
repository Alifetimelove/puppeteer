let fs = require("fs");
let path = require("path");
const { v4: uuidv4 } = require("uuid");
let preUrl = "./src/svgxml/";
let moment = require("moment");
const configInfo = require("./config").configInfo;
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const qrCode = require("qrcode");
// data 是新文件的内容，字符串
// fileName是新文件的名字，字符串
let httpFun = function () {};
httpFun.prototype.replaceSvg = function (data) {
  return new Promise(function (resolve, reject) {
    var svgValue = JSON.parse(data.svgValue);
    var svgStyle = data.svgStyle;
    var i = [];
    svgValue.forEach((element) => {
      if (element.type == "barcode") {
        var canvas = createCanvas();
        JsBarcode(canvas, element.value, {
          displayValue: false,
          height: element.imageWidth,
          width: 1,
        });
        element.value = canvas.toDataURL();
        svgStyle = svgStyle.replace("${" + element.key + "}", element.value);
        i.push(element.key);
        if (i.length === svgValue.length) {
          resolve(svgStyle);
        }
      } else if (element.type == "qrcode") {
        qrCode.toDataURL(
          element.value,
          {
            type: "image/png",
            width: element.imageWidth,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
            errorCorrectionLevel: "M",
            quality: 1,
          },
          function (err, url) {
            element.value = url;
            svgStyle = svgStyle.replace(
              "${" + element.key + "}",
              element.value
            );
            i.push(element.key);
            if (i.length === svgValue.length) {
              resolve(svgStyle);
            }
          }
        );
      } else {
        svgStyle = svgStyle.replace("${" + element.key + "}", element.value);
        i.push(element.key);
        if (i.length === svgValue.length) {
          resolve(svgStyle);
        }
      }
    });
  });
};
httpFun.prototype.writeAFile = function (data, fileName) {
  let _path = preUrl + fileName;
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(preUrl), { recursive: true }, (err) => {
      if (err) {
        resolve(err);
      } else {
        fs.writeFile(_path, data, function (err) {
          if (err) {
            // 写入文件失败
            // console.log("写入文件失败:", err);
            resolve({
              code: "error",
            });
          } else {
            // 写入文件成功
            // console.log("写入文件成功");
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
httpFun.prototype.uploadImage = function (data, absolutePath, relativePath) {
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
      absolutePath +
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
              relativePath +
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
httpFun.prototype.compositePictureToSvg = function (data) {
  return new Promise(function (resolve, reject) {
    var obj = data;
    var xmlns = "http://www.w3.org/2000/svg";
    var xmlmsSvg = "http://www.w3.org/2000/svg";
    var xmlnsXlink = "http://www.w3.org/1999/xlink";
    var svgValue = `<svg width="${obj.width}" height="${obj.height}" xmlns="${xmlns}" xmlns:svg="${xmlmsSvg}" xmlns:xlink="${xmlnsXlink}">`;
    svgValue += `<g><title>Layer 1</title>`;
    obj.list.forEach((imageItem, index) => {
      var url = imageItem.url;
      var width = imageItem.width;
      var height = imageItem.height;
      var x = imageItem.x;
      var y = imageItem.y;
      var id = "svg_" + (index + 1);

      svgValue += `<image x="${x}" y="${y}" width="${width}" height="${height}" id="${id}" xlink:href="${url}"/>`;
    });
    svgValue += "</g></svg>";
    resolve(svgValue);
  });
};
module.exports.httpFun = httpFun;
