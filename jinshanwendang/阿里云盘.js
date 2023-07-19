var myDate = new Date();
var data_time = myDate.toLocaleDateString()

function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}
var value= ""
for (let ii = 2; ii <= 20; ii++){
  // A1: token
  // 填写你的 cookie: 
  // A2: cookie 1
  // A3: cookie 2
  // A4: ... 可无限填写用户
  dyg = "A"+ii

  var refresh_token = Application.Range(dyg).Text
  if(refresh_token != ""){
    // 发起网络请求-获取token
    let data = HTTP.post("https://auth.aliyundrive.com/v2/account/token",
          JSON.stringify({
          "grant_type": "refresh_token",
          "refresh_token":refresh_token
          })
    )
    data = data.json()
    var access_token = data['access_token']
    var phone = data["user_name"]

    if  (access_token == undefined){
      var value ="单元格【"+dyg+"】内的token值错误，程序执行失败，请重新复制正确的token值"+"\n"
    }else{
      try{
        var access_token2 = 'Bearer '+access_token
        // 签到
        let data2 = HTTP.post("https://member.aliyundrive.com/v1/activity/sign_in_list",
              JSON.stringify({"_rx-s": "mobile"}),
              {headers:{"Authorization":access_token2}}
        )
        data2=data2.json()
        var signin_count = data2['result']['signInCount']
        var value =value+ "账号："+data["user_name"]+"-签到成功, 本月累计签到"+ signin_count+"天"+"\n"

      }catch{
        var value ="单元格【"+dyg+"】内的token签到失败"+"\n"
        return
      }
      sleep(1000)

      var sflq = Application.Range("B"+ii).Text
      if (sflq == "是"){
        try{
          // 领取奖励
          let data3 = HTTP.post(
            "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile",
            JSON.stringify({"signInDay": signin_count}),
            {headers:{"Authorization":access_token2}}
          )
          data3=data3.json()
          var value = value +"本次签到获得"+data3["result"]["name"] +","+data3["result"]["description"]+"\n"
        }catch{
              var value = value+ "账号："+data["user_name"]+"-领取奖励失败"+"\n"
        }
      }else{
        value = value +"奖励待领取"+"\n"
      }
    }
  }
}

// 填写文档的 E1: 是， E2: your email
var sftz = Application.Range("E"+1).Text
if (sftz=="是"){
  var jsyx = Application.Range("E"+2).Text

    // 配置发送邮箱
  let mailer = SMTP.login({
      host: "smtp.xx.com", // 邮箱 的SMTP服务器的域名
      port: 465,
      username: "xxx@xx.com", // 邮箱地址
      password: "xxxx", // 邮箱的SMTP密码，非密码
      secure: true
});
  mailer.send({
          from: "阿里云盘签到<xxx@xx.com>", // 发件人
          to: jsyx, // 收件人
          subject: "阿里云盘签到通知-"+data_time, // 主题
          text: value, // 文本
      })
}else{
  console.log(value)
}