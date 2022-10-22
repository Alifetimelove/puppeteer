/*
 * @Author: yuyongxing
 * @Date: 2022-01-10 11:33:26
 * @LastEditors: yuyongxing
 * @LastEditTime: 2022-01-16 18:51:21
 * @Description: 主入口文件
 */
const express = require("express");
const multer = require("multer");
const createError = require("http-errors");
const route = require("./route.js");
const app = express();
const path = require("path");
let fs = require("fs");
let util = require("util");
const configInfo = require("./config").configInfo;

//解决跨域
const cors = require("cors");
app.use(cors());

//app.use(express.static(path.join(__dirname, configInfo.filePath)));将静态资源托管，这样才能在浏览器上直接访问预览图片或则html页面

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method === "OPTIONS") res.sendStatus(200); /*让options请求快速返回*/
  else next();
});

// 中间件--json化入参
app.use(express.json());
// 初始化路由
route(app);
// 错误拦截
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  let result = {
    code: 0,
    msg: err.message,
    err: err.stack,
  };
  res.status(err.status || 500).json(result);
});

var logPath = configInfo.logPath + "upgrade.log";
var logFile = fs.createWriteStream(logPath, { flags: "a" });

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  process.stdout.write(util.format.apply(null, arguments) + "\n");
};

console.error = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  process.stderr.write(util.format.apply(null, arguments) + "\n");
};
// 启动服务监听7000端口
const server = app.listen(7000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("app start listening at http://%s:%s", host, port);
});
