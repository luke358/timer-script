const JUEJIN_COOKIE = "xxxxx your cookie";
const data_time = new Date().toLocaleDateString()

function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}

const api = {
  fetch: function ({ path, method, data }) {
    const res = HTTP.fetch(`https://api.juejin.cn/growth_api/v1${path}`, {
      headers: {
        cookie: JUEJIN_COOKIE
      },
      method: method,
      body: JSON.stringify(data),
      credentials: "include"
    }).json();
    if (res.err_no) {
      throw new Error(res.err_msg);
    }
    return res.data;

  },
  get: function (path) {
    return this.fetch({ path, method: "GET" });
  },
  post: function (path, data) {
    return this.fetch({ path, method: "POST", data });
  },
  getLotteryConfig: function () {
    return this.get("/lottery_config/get");
  },
  getCurrentPoint: function () {
    return this.get("/get_cur_point");
  },
  drawLottery: function () {
    return this.post("/lottery/draw");
  },
  checkIn: function () {
    return this.post("/check_in");
  },
  getLotteriesLuckyUsers: function () {
    return this.post("/lottery_history/global_big", {
      page_no: 1,
      page_size: 5
    });
  },
  dipLucky: function (lottery_history_id) {
    return this.post("/lottery_lucky/dip_lucky", {
      lottery_history_id
    });
  },
  getMyLucky: function () {
    return this.post("/lottery_lucky/my_lucky");
  }
};

const state = {
  simulateSpeed: 100, // ms/进行一次抽奖
  sumPoint: 0,
  pointCost: 0,
  supplyPoint: 0,
  freeCount: 0,
  luckyValue: 0,
  lottery: [],
  counter: 0,
  prize: {}
};

let pushMsg = ''
try {
  const checkInResult = api.checkIn();
  console.log(checkInResult);
  const incrPoint = checkInResult.incr_point;
  console.log(`签到成功 +${incrPoint} 矿石`);
  pushMsg += `签到成功 +${incrPoint} 矿石 \n`

  const sumPoint = checkInResult.sum_point;
  state.sumPoint = sumPoint;
} catch (e) {
  pushMsg += `今日已签到 \n`;
  console.log(e.message);

  const sumPoint = api.getCurrentPoint();

  state.sumPoint = sumPoint;
}

try {
  const luckyusersResult = api.getLotteriesLuckyUsers();
  if (luckyusersResult.count > 0) {
    const no1LuckyUser = luckyusersResult.lotteries[0];
    const dipLuckyResult = api.dipLucky(no1LuckyUser.history_id);
    if (dipLuckyResult.has_dip) {
      pushMsg += `今天你已经沾过喜气，明天再来吧!\n`

      console.log(`今天你已经沾过喜气，明天再来吧!`);
    } else {
      pushMsg += `沾喜气 +${dipLuckyResult.dip_value} 幸运值 \n`
      console.log(`沾喜气 +${dipLuckyResult.dip_value} 幸运值`);
    }
  }
} catch { }
pushMsg += '===============================\n'
pushMsg += `当前余额：${state.sumPoint} 矿石\n`
pushMsg += '===============================\n'

console.log(`当前余额：${state.sumPoint} 矿石`);

const luckyResult = api.getMyLucky();
state.luckyValue = luckyResult.total_value;
pushMsg += '===============================\n'
pushMsg += `当前幸运值：${state.luckyValue}/6000 \n`
console.log(`当前幸运值：${state.luckyValue}/6000`);
pushMsg += '===============================\n'

const lotteryConfig = api.getLotteryConfig();

state.lottery = lotteryConfig.lottery;
state.pointCost = lotteryConfig.point_cost;
state.freeCount = lotteryConfig.free_count;
state.sumPoint += state.freeCount * state.pointCost;
console.log(`免费抽奖次数: ${state.freeCount}`);
pushMsg += `免费抽奖次数: ${state.freeCount} \n`

console.log(`准备免费抽奖！`);

console.info("奖品实况");

const getSupplyPoint = draw => {
  const maybe = [
    ["lottery_id", "6981716980386496552"],
    ["lottery_name", "随机矿石"],
    ["lottery_type", 1]
  ];
  if (maybe.findIndex(([prop, value]) => draw[prop] === value) !== -1) {
    const supplyPoint = Number.parseInt(draw.lottery_name);
    if (!isNaN(supplyPoint)) {
      return supplyPoint;
    }
  }
  return 0;
};

const lottery = () => {
  const result = api.drawLottery();
  state.sumPoint -= state.pointCost;
  state.sumPoint += getSupplyPoint(result);
  state.luckyValue += result.draw_lucky_value;
  state.counter++;
  state.prize[result.lottery_name] = (state.prize[result.lottery_name] || 0) + 1;
  console.log(`[第${state.counter}抽]：${result.lottery_name}`);
};

while (state.freeCount > 0) {
  lottery();
  state.freeCount--;
  sleep(state.simulateSpeed)
}

console.info("奖品实况");
pushMsg += `弹药不足，当前余额：${state.sumPoint} 矿石 \n`
pushMsg += `养精蓄锐来日再战！ \n`

console.log(`弹药不足，当前余额：${state.sumPoint} 矿石`);
console.log(`养精蓄锐来日再战！`);

const recordInfo = [];
pushMsg += `=====[战绩详情]===== \n`

recordInfo.push("=====[战绩详情]=====");
if (state.counter > 0) {
  const prizeList = [];
  for (const key in state.prize) {
    prizeList.push(`${key}: ${state.prize[key]}`);
  }
  recordInfo.push(...prizeList);

  pushMsg += `("-------------------"); \n`
  recordInfo.push("-------------------");
  recordInfo.push(`共计: ${state.counter}`);
  pushMsg += `共计: ${state.counter} \n`

} else {
  recordInfo.push("暂无奖品");
  pushMsg += `暂无奖品 \n`
}
pushMsg += `+++++++++++++++++++ \n`
recordInfo.push("+++++++++++++++++++");
pushMsg += `幸运值: ${state.luckyValue}/6000 \n`
recordInfo.push(`幸运值: ${state.luckyValue}/6000`);
recordInfo.push("===================");
console.log(recordInfo.join("\n"));

// 配置发送邮箱
let mailer = SMTP.login({
  host: "smtp.xxx.com", // 邮箱 的SMTP服务器的域名
  port: 465,
  username: "xxxx@xx.com", // 邮箱地址
  password: "xxxx", // 邮箱的SMTP密码，非密码
  secure: true
});
mailer.send({
  from: "掘金签到<xxx@xx.com>", // 发件人
  to: "xxx@xx.com", // 收件人
  subject: "掘金签到通知-" + data_time, // 主题
  text: pushMsg, // 文本
})