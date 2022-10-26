const puppeteer = require("puppeteer");
let path = require("path");

const fs = require("fs");

const waitTime = (n) => new Promise((r) => setTimeout(r, n));
module.exports = async (opt, fileUrl) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--no-zygote",
        "--no-sandbox",
        "--disable-gpu",
        "--no-first-run",
        "--single-process",
        "--disable-extensions",
        "--disable-xss-auditor",
        "--disable-dev-shm-usage",
        "--disable-popup-blocking",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--enable-features=NetworkService",
      ],
      headless: true,
    });

    const page = await browser.newPage();
    const url = path.resolve(fileUrl);
    await page.goto("file:///" + url);
    await page.setViewport({
      width: opt.width,
      height: opt.height,
    });
    await waitTime(opt.waitTime || 0);
    const ele = await page.$("svg");
    const base64 = await ele.screenshot({
      fullPage: false,
      omitBackground: true,
      encoding: "base64",
    });
    await browser.close();
    return "data:image/png;base64," + base64;
  } catch (error) {
    throw error;
  }
};
