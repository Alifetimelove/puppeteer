 配置文件:config.js
 将压缩包文件解压到服务器目录下;
 执行 npm init 下载依赖数包;
 下载 pm2 管理运维服务 npm install -g pm2;
 执行 pm2 start 'npm start' 启动服务并且后台运行
 查看日志指令 pm2 log
 查看进程状态 pm2 list
 重启服务 pm2 restart npm –start

疑难问题解决详见：https://blog.csdn.net/qq_37363320/article/details/111408592
