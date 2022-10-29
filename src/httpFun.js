let fs = require("fs");
let path = require("path");
const { v4: uuidv4 } = require("uuid");
let preUrl = "./src/svgxml/";
let moment = require("moment");
const configInfo = require("./config").configInfo;
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const qrCode = require("qrcode");
let numberProcess = require("./common").numberProcess;
let httpFun = function () {};
httpFun.prototype.replaceSvg = function (data) {
  return new Promise(function (resolve, reject) {
    var svgValue = data.svgValue;
    var svgStyle = data.svgStyle;
    var i = [];
    if (svgValue.length > 0) {
      svgValue.forEach((element) => {
        if (element.type == "barcode") {
          if (element.value) {
            var canvas = createCanvas();
            var codeFormat = element.barcodeEncode
              ? element.barcodeEncode
              : "CODE128";
            JsBarcode(canvas, element.value, {
              format: codeFormat,
              displayValue: false,
              height: element.imageWidth,
              width: 1,
            });
            element.value = canvas.toDataURL();
            svgStyle = svgStyle.replace(
              "${" + element.key + "}",
              element.value
            );
            i.push(element.key);
            if (i.length === svgValue.length) {
              resolve(svgStyle);
            }
          } else {
            svgStyle = svgStyle.replace("${" + element.key + "}", "");
            i.push(element.key);
            if (i.length === svgValue.length) {
              resolve(svgStyle);
            }
          }
        } else if (element.type == "qrcode") {
          if (element.value) {
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
            svgStyle = svgStyle.replace("${" + element.key + "}", "");
            i.push(element.key);
            if (i.length === svgValue.length) {
              resolve(svgStyle);
            }
          }
        } else if (element.type == "number") {
          try {
            // 自定义
            if (!element.isCustom) {
              // 保留小数位额
              if (element.keepDecimalPlaces) {
                element.value = numberProcess.keepDecimal(
                  element.value,
                  element.keepDecimalPlaces
                );
              }
              //显示千分位
              if (element.isDisplayThousands) {
                element.value = numberProcess.keepThousands(element.value);
              }
              //显示白分位
              if (element.isDisplayPercentage) {
                element.value = numberProcess.keepDecimal(element.value, 2);
              }
              //前缀
              if (element.suffix) {
                element.value = element.suffix + element.value;
              }
              //前缀
              if (element.prefix) {
                element.value = element.value + element.prefix;
              }
            } else {
              console.log(2);
              switch (element.format) {
                case "0":
                  element.value = numberProcess.custom1(element.value);
                  break;
                case "0.00":
                  element.value = numberProcess.custom2(element.value);
                  break;
                case "#,##0":
                  element.value = numberProcess.custom3(element.value);
                  break;
                case "#,##0.00":
                  element.value = numberProcess.custom4(element.value);
                  break;
                case "¥#,##0;¥-#,##0":
                  element.value = numberProcess.custom5(element.value);
                  break;
                case "¥#,##0.00;¥-#,##0.00":
                  element.value = numberProcess.custom6(element.value);
                  break;
                case "$#,##0_);($#,##0)":
                  element.value = numberProcess.custom7(element.value);
                  break;
                case "$#,##0.00_);($#,##0.00)":
                  element.value = numberProcess.custom8(element.value);
                  break;
                default:
                  break;
              }
            }
          } catch (error) {
            console.log(error);
          }
          svgStyle = svgStyle.replace("${" + element.key + "}", element.value);
          i.push(element.key);
          if (i.length === svgValue.length) {
            resolve(svgStyle);
          }
          console.log(element.value);
        } else {
          svgStyle = svgStyle.replace("${" + element.key + "}", element.value);
          i.push(element.key);
          if (i.length === svgValue.length) {
            resolve(svgStyle);
          }
        }
      });
    } else {
      resolve(svgStyle);
    }
  });
};
httpFun.prototype.writeAFile = function (data, fileName) {
  data = data.replace(
    new RegExp("/Market/static/template_v2_js/images/qrcodeimg.png", "g"),
    "./../img/qrcodeimg.png"
  );
  data = data.replace(
    new RegExp("/Market/static/template_v2_js/images/barcodeimg.png", "g"),
    "./../img/barcodeimg.png"
  );
  data = data.replace(
    new RegExp("/Market/static/template_v2_js/images/blozi.jpg", "g"),
    "./../img/blozi.jpg"
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
            // console.log("写入文件失败:", err);
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
