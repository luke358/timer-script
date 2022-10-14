var axios = require('axios');
const notify = require('./sendNotify')

var data = JSON.stringify({
  "lottery_history_id": "7148248120302764068"
});

var config = {
  method: 'post',
  url: 'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=2608&uuid=7069996992693732879&spider=0',
  headers: { 
    'authority': 'api.juejin.cn', 
    'accept': '*/*', 
    'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8', 
    'content-type': 'application/json', 
    'cookie': 'MONITOR_WEB_ID=8234ab06-8b91-4d07-903a-fd81b34efd1d; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227069996992693732879%2522%252C%2522user_unique_id%2522%253A%25227069996992693732879%2522%252C%2522timestamp%2522%253A1646111963051%257D; _ga=GA1.2.1616872196.1646111963; sid_guard=29e254225c2d4b118152b73a4582878a%7C1651639874%7C31536000%7CThu%2C+04-May-2023+04%3A51%3A14+GMT; uid_tt=a128ae3d6ad26568640500d776017bbd; uid_tt_ss=a128ae3d6ad26568640500d776017bbd; sid_tt=29e254225c2d4b118152b73a4582878a; sessionid=29e254225c2d4b118152b73a4582878a; sessionid_ss=29e254225c2d4b118152b73a4582878a; sid_ucp_v1=1.0.0-KDk0Yzg4ZDU0OTE5NDlkZTcwNThjY2EwZTY2ZDg4NGI3ZWI2Yzg5NGUKFwinleDw-fTjBxDCjMiTBhiwFDgCQPEHGgJsZiIgMjllMjU0MjI1YzJkNGIxMTgxNTJiNzNhNDU4Mjg3OGE; ssid_ucp_v1=1.0.0-KDk0Yzg4ZDU0OTE5NDlkZTcwNThjY2EwZTY2ZDg4NGI3ZWI2Yzg5NGUKFwinleDw-fTjBxDCjMiTBhiwFDgCQPEHGgJsZiIgMjllMjU0MjI1YzJkNGIxMTgxNTJiNzNhNDU4Mjg3OGE; _gid=GA1.2.650446564.1664155200; _tea_utm_cache_2608={%22utm_source%22:%22gold_browser_extension%22}', 
    'origin': 'https://juejin.cn', 
    'referer': 'https://juejin.cn/', 
    'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"macOS"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-site', 
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
    notify.sendNotify(`掘金沾一沾`, JSON.stringify(response.data));

})
.catch(function (error) {
  console.log(error);
});
