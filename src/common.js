// var param = {
//   isCustom: 0, //"0:标准 1：自定义"
//   keepDecimalPlaces: 2, //保留小数位数
//   isDisplayThousands: 0, //"是否显示千分位 0:不显示 1：显示"
//   isDisplayPercentage: 0, // "是否显示百分位 0:不显示 1：显示"
//   suffix: "$", //后缀
//   prefix: "$", //前缀
//   format: "格式", //格式
//   barcodeEncode: "code_128", //默认
// };
const numberProcess = {
  // 保留千分位
  keepThousands(number) {
    console.log("keepThousandsnumber====", number);
    if (!number && Number(number) !== 0) return;
    number = number.toString();
    if (number.includes(".")) {
      let list = number.split(".");
      let left = Number(Number(list[0]).toFixed(2)).toLocaleString();
      let right = list[1];
      return left + "." + right;
    } else {
      number = Number(Number(number).toFixed(2)).toLocaleString();
      return number;
    }
  },
  // 保留n位小数
  keepDecimal(_m_, _n_) {
    let num = Number(_m_);
    let n = Number(_n_);
    if (!isNaN(num) && !isNaN(n)) {
      if (num !== 0) {
        const list = [...Math.floor(num * 10 ** n).toString()];
        list.splice(-n, 0, ".");
        return list.join("");
      } else {
        let str = ".";
        for (var i = 0; i < n; i++) {
          str = str.concat("0");
        }
        return str;
      }
    }
  },
  // 自定义数字类型展示
  custom1(x) {
    // 四舍五入，保留整数
    return Number(x).toFixed(0);
  },
  custom2(x) {
    // 四舍五入，保留两位小数
    return Number(x).toFixed(2);
  },
  custom3(x) {
    // 四舍五入，保留整数，并加上千分符
    let num = Number(Number(x).toFixed(0)).toLocaleString();
    return num;
  },
  custom4(x) {
    // 四舍五入，保留两位小数，并加上千分符
    let num = Number(Number(x).toFixed(2)).toLocaleString();
    return num;
  },
  custom5(x) {
    // 四舍五入，保留整数，并加上千分符,并加上 ￥
    let num = Number(Number(x).toFixed(0)).toLocaleString("zh-CN", {
      style: "currency",
      currency: "CNY",
    });
    num = num.slice(0, num.length - 3);
    console.log("处理custom5", num, typeof num);
    return num;
  },
  custom6(x) {
    // 四舍五入，保留两位小数，并加上千分符,并加上 ￥
    let num = Number(Number(x).toFixed(2)).toLocaleString("zh-CN", {
      style: "currency",
      currency: "CNY",
    });
    // num = num.slice(0,num.length-3)
    console.log("处理custom6", num, typeof num);
    return num;
  },
  custom7(x) {
    // 四舍五入，保留整数，并加上千分符,并加上 $
    let num = Number(Number(x).toFixed(0)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    num = num.slice(0, num.length - 3);
    return num;
  },
  custom8(x) {
    // 四舍五入，保留两位小数，并加上千分符,并加上 $
    let num = Number(Number(x).toFixed(2)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return num;
  },
  custom9(x) {
    return Math.trunc(x);
  },
  custom10(x) {
    return Math.trunc(x);
  },
  ceil(x) {
    // 对 x 进行上舍入。向上取整计算
    return Math.ceil(x);
  },
  floor(x) {
    // 对 x 进行下舍入。向下取整计算
    return Math.floor(x);
  },
  round(x) {
    // 四舍五入。把一个数字舍入为最接近的整数
    return Math.round(x);
  },
  trunc(x) {
    // 将数字的小数部分去掉，只保留整数部分。
    return Math.trunc(x);
  },
};
module.exports.numberProcess = numberProcess;
