let message = ''
let xmlyhd = ''
let cookiesArr = [
  'cookie 1',
  'cookie 2'
  /* .... 多个cookie */
]
const data_time = new Date().toLocaleDateString()

const api = {
  fetch: function ({ path, options }) {
    const res = HTTP.fetch(path, options).json();
    return res;

  },
  // get: function (path) {
  //   return this.fetch({ path, method: "GET" });
  // },
  post: function (path, options) {
    return this.fetch({ path, options: { ...options, method: "POST" } });
  },
  checkIn: function () {
    return this.post('http://hybrid.ximalaya.com/web-activity/signIn/actionWithRecords?aid=8', {
      headers: {
        "Cookie": `${xmlyhd}`,
        "Host": "hybrid.ximalaya.com",
      },
      method: "POST",
      body: 'aid=8',
      credentials: "include"
    })
  },
};

console.log(`\n\n开始【喜马拉雅${data_time}】`)

kzjb()


// 配置发送邮箱
let mailer = SMTP.login({
  host: "smtp.xx.com", // 邮箱 的SMTP服务器的域名
  port: 465,
  username: "xxx@xx.com", // 邮箱地址
  password: "xxxxx", // 邮箱的SMTP密码，非密码
  secure: true
});
mailer.send({
  from: "喜马拉雅签到<xxx@xx.com>", // 发件人
  to: "xxx@xx.com", // 收件人
  subject: "喜马拉雅签到通知-" + data_time, // 主题
  text: message, // 文本
})

function kzjb() {
  for (let i = 0; i < cookiesArr.length; i++) {
    xmlyhd = cookiesArr[i]
    qd()
    message += '\n'
  }
}

//签到
function qd() {
  const data = api.checkIn()

  if (data.data.status == 0) {
    console.log('\n【喜马拉雅F.M用户】: ' + data.context.currentUser.nickname)
    console.log('\n【签到成功】: ' + data.data.msg)
    console.log('\n【获得积分】: ' + data.data.desc)
    message += '\n【喜马拉雅F.M用户】: ' + data.context.currentUser.nickname
    message += '\n【签到成功】: ' + data.data.msg
    message += '\n【获得积分】: ' + data.data.desc
  } else {
    console.log('\n【喜马拉雅F.M 用户】: ' + data.context.currentUser.nickname)
    console.log('\n【您今天已经签到了】: ' + data.data.msg)
    message += '\n【喜马拉雅F.M用户】: ' + data.context.currentUser.nickname
    message += '\n【您今天已经签到了】: ' + data.data.msg
  }
}

