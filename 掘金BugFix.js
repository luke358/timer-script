const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(process.env.JUEJIN_COOKIE);

  const bugfix = juejin.bugfix();
  let pushMsg = ``
  const notCollectBugList = await bugfix.getNotCollectBugList();
  await bugfix.collectBugBatch(notCollectBugList);
  pushMsg += `收集Bug ${notCollectBugList.length} \n`
  console.log(`收集Bug ${notCollectBugList.length}`);

  const competition = await bugfix.getCompetition();
  const bugfixInfo = await bugfix.getUser(competition);
  console.log(`未消除Bug数量 ${bugfixInfo.user_own_bug}`);
  pushMsg += `未消除Bug数量 ${bugfixInfo.user_own_bug} \n`

  const res = await fetch(`https://oapi.dingtalk.com/robot/send?access_token=c9dc9910ae0a01375726e5ec54507fd9c71acf2d70a81d51bc1e1002e0715a22`, {
        method: 'POST',
        body: JSON.stringify({
            "msgtype": "text",
            "text": {"content": pushMsg}
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    console.log(res)
}

run()