
// 将数字转为大写的中文字
function to_upper(a) {
  switch (a) {
  case "0":
      return "零";
      break;
  case "1":
      return "壹";
      break;
  case "2":
      return "贰";
      break;
  case "3":
      return "叁";
      break;
  case "4":
      return "肆";
      break;
  case "5":
      return "伍";
      break;
  case "6":
      return "陆";
      break;
  case "7":
      return "柒";
      break;
  case "8":
      return "捌";
      break;
  case "9":
      return "玖";
      break;
  default:
      return ""
  }
}
function to_mon(a) {
  if (a > 10) {
      a = a - 8;
      return (to_mon(a))
  }
  switch (a) {
  case 0:
      return "分";
      break;
  case 1:
      return "角";
      break;
  case 2:
      return "元";
      break;
  case 3:
      return "拾";
      break;
  case 4:
      return "佰";
      break;
  case 5:
      return "仟";
      break;
  case 6:
      return "万";
      break;
  case 7:
      return "拾";
      break;
  case 8:
      return "佰";
      break;
  case 9:
      return "仟";
      break;
  case 10:
      return "亿";
      break
  }
}
function repace_acc(Money) {
  Money = Money.replace("零分", "");
  Money = Money.replace("零角", "零");
  var yy;
  var outmoney;
  outmoney = Money;
  yy = 0;
  while (true) {
      var lett = outmoney.length;
      outmoney = outmoney.replace("零元", "元");
      outmoney = outmoney.replace("零万", "万");
      outmoney = outmoney.replace("零亿", "亿");
      outmoney = outmoney.replace("零仟", "零");
      outmoney = outmoney.replace("零佰", "零");
      outmoney = outmoney.replace("零零", "零");
      outmoney = outmoney.replace("零拾", "零");
      outmoney = outmoney.replace("亿万", "亿零");
      outmoney = outmoney.replace("万仟", "万零");
      outmoney = outmoney.replace("仟佰", "仟零");
      yy = outmoney.length;
      if (yy == lett) {
          break
      }
  }
  yy = outmoney.length;
  if (outmoney.charAt(yy - 1) == "零") {
      outmoney = outmoney.substring(0, yy - 1)
  }
  yy = outmoney.length;
  if (outmoney.charAt(yy - 1) == "元") {
      outmoney = outmoney + "整"
  }
  return outmoney
}

export default function moneyToCapital(num) {
  var fuhao = "";
  var text = num + "";
  if (text.indexOf("-") > -1) {
      num = text.replace("-", "");
      fuhao = "负"
  }
  var money1 = new Number(num);
  var monee = Math.round(money1 * 100).toString(10);
  var leng = monee.length;
  var monval = "";
  for (let i = 0; i < leng; i++) {
      monval = monval + to_upper(monee.charAt(i)) + to_mon(leng - i - 1)
  }
  return fuhao + repace_acc(monval)
}
