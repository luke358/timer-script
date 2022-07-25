
// 抽奖
const drawFn = async () => {
  // 查询今日是否有免费抽奖机会
  const today = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers: {
      cookie: process.env.JUEJIN_COOKIE
    },
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  if (today.err_no !== 0) return console.warn('免费抽奖失败！');
  if (today.data.free_count === 0) return console.log('今日已经免费抽奖！');

  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers: {
      cookie: process.env.JUEJIN_COOKIE
    },
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (draw.err_no !== 0) return console.warn('免费抽奖失败！');
  [3, 4].includes(draw.data.lottery_type) ? alert(`恭喜抽到：${draw.data.lottery_name}`) : console.log(`恭喜抽到：${draw.data.lottery_name}`);
};

// 签到
(async () => {
  // 查询今日是否已经签到
  const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
    headers: {
      cookie: process.env.JUEJIN_COOKIE
    },
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());
  console.log(today_status, process.env.JUEJIN_COOKIE)
  if (today_status.err_no !== 0) return console.warn('签到失败！');
  if (today_status.data) {
    console.log('今日已经签到！');
    drawFn();
    return;
  }

  // 签到
  const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers: {
      cookie: process.env.JUEJIN_COOKIE
    },
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (check_in.err_no !== 0) return console.warn('签到失败！');
  console.log(`签到成功！当前积分；${check_in.data.sum_point}`);
  drawFn();
})();