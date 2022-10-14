var axios = require('axios');
var qs = require('qs');

let token = process.env.SQB_TOKEN
let accessToken = process.env.SQB_ACCESS_TOKEN
let count = 5
async function getToken() {

    return new Promise((res) => {
        var config = {
            method: 'get',
            url: 'http://127.0.0.1:5600/open/auth/token?client_id=d2Y1_isTXeMY&client_secret=vXtCNUY2VcvARpg0M--zH-iA',
            headers: {}
        };

        axios(config)
            .then(function (response) {
                res(response.data.data.token)
                // console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}
async function getEvn(searchValue = 'SQB_TOKEN') {
    const qlToken = await getToken()
    // console.log(qlToken, 'tttt')
    return new Promise(res => {
        var config = {
            method: 'get',
            url: 'http://127.0.0.1:5600/open/envs?searchValue=' + searchValue,
            headers: {
                'Authorization': `Bearer ${qlToken}`,
                'Content-Type': 'application/json'
            }
        };
        axios(config)
            .then(function (response) {
                // console.log(response.data)
                res(response.data.data[0])
            })
            .catch(function (error) {
                // console.log('enenennenenenene error')

                console.log(error);
            });
    })
}

async function putEvn(newVal, evnName) {
    const evnVal = await getEvn(evnName)
    const qlToken = await getToken()

    // var data = `{"name":${evnVal.name},"value":"${newVal}","remarks":${evnVal.remarks},"id":${evnVal.id}}`;
    var data = { "name": evnVal.name, "value": newVal, "remarks": evnVal.remarks, "id": evnVal.id }

    var config = {
        method: 'put',
        url: 'http://127.0.0.1:5600/open/envs',
        headers: {
            'Authorization': 'Bearer ' + qlToken,
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function hasLiked(id) {
    const { data } = await fetch('https://boss-circle.shouqianba.com/api/v1/feed/feedsDetail?id=' + id,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'access_token': accessToken,
            },
            method: 'GET'
        }).then(res => res.json())
    return data.liked
}
// 文章点赞
async function likeFeeds(feedId) {
    // const liked = await hasLiked(feedId)
    // if (liked) {
    //     console.log('当前文章已点赞！！！')
    //     return
    // }
    console.log('开始点赞...')
    const { code } = await fetch('https://boss-circle.shouqianba.com/api/v1/feed/likeFeeds', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'access_token': accessToken,
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'POST',
        body: JSON.stringify({ "id": feedId })
    }).then((res) => res.json());
    if (code === 200) {
        console.log('点赞成功')
        return true
    } else {
        console.log('点赞失败')
        return false
    }
}

// 获取推荐文章
async function recommendedFeeds() {
    return new Promise((res, rej) => {
        var data = qs.stringify({
            'merchant_user_id': '8f8eb910-ca30-4e5d-b298-1f76c426c4d4',
            'account_id': 'c5d0c46f-c353-4273-83da-bb0767ff406e',
            'role': 'super_admin',
            'device_model': '1',
            'operator_id': '8f8eb910-ca30-4e5d-b298-1f76c426c4d4',
            'os_type': '0',
            'merchant_id': 'ddfb02b9-4c28-4e1d-90a2-b8c286650f88',
            'client_version': '6.0.3',
            'uc_user_id': 'c5d0c46f-c353-4273-83da-bb0767ff406e',
            'deviceId': '5aecacac-425a-346b-b30d-b407ef485d77',
            'token': token,
            'agreement_version': '3'
        });
        var config = {
            method: 'post',
            // url: 'https://mapi.shouqianba.com/v4/boss-circle/feed/latestFeeds?size=30&accessToken=' + accessToken,
            url: 'https://mapi.shouqianba.com/v4/boss-circle/feed/recommendedFeeds?size=30&accessToken=' + accessToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': '474',
                'Host': 'mapi.shouqianba.com'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                res(response.data)
                // console.log(response.data.data.length);
            })
            .catch(function (error) {
                rej(error)
                // console.log(error);
            });
    })
}

async function latestFeeds() {
    return new Promise((res, rej) => {
        var data = qs.stringify({
            'merchant_user_id': '8f8eb910-ca30-4e5d-b298-1f76c426c4d4',
            'account_id': 'c5d0c46f-c353-4273-83da-bb0767ff406e',
            'role': 'super_admin',
            'device_model': '1',
            'operator_id': '8f8eb910-ca30-4e5d-b298-1f76c426c4d4',
            'os_type': '0',
            'merchant_id': 'ddfb02b9-4c28-4e1d-90a2-b8c286650f88',
            'client_version': '6.0.3',
            'uc_user_id': 'c5d0c46f-c353-4273-83da-bb0767ff406e',
            'deviceId': '5aecacac-425a-346b-b30d-b407ef485d77',
            'token': token,
            'agreement_version': '3'
        });
        var config = {
            method: 'post',
            url: 'https://mapi.shouqianba.com/v4/boss-circle/feed/latestFeeds?size=30&accessToken=' + accessToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': '474',
                'Host': 'mapi.shouqianba.com'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                res(response.data)
                // console.log(response.data.data.length);
            })
            .catch(function (error) {
                rej(error)
                // console.log(error);
            });
    })
}

async function releaseComment(feedId, con) {
    return new Promise((res) => {
        var data = `{"id":${feedId},"content":"${con}"}`;

        var config = {
            method: 'post',
            url: 'https://boss-circle.shouqianba.com/api/v1/comment/releaseComment',
            headers: {
                'Authorization': 'Bearer 1dbe6d99-b004-4eb7-9665-b3af7b62fbe6',
                'access_token': '1dbe6d99-b004-4eb7-9665-b3af7b62fbe6',
                'Content-Type': 'application/json;charset=UTF-8',
                'Cookie': 'acw_tc=76b20ff316643537160304918e05d014b51e3e9fcff2ee111b49ccd50dfe9b'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                res(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    })

}

async function getCommentCopy(feedId) {
    return new Promise((res) => {
        var data = `{"feedId":${feedId},"page":1,"size":"20","hotComment":false}`;

        var config = {
            method: 'post',
            url: 'https://boss-circle.shouqianba.com/api/v1/wxcomment/getFeedCommentPage',
            headers: {
                'Host': 'boss-circle.shouqianba.com',
                'Authorization': `Bearer ${accessToken}`,
                'access_token': accessToken,
                'Content-Type': 'application/json;charset=UTF-8',
                'Cookie': 'acw_tc=2f624a4c16643509968745467e1273b5f0d7f36a2c4b32b5f7c75901cc1301'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                res(response.data)
            })
            .catch(function (error) {
                console.log(error, 'tttt');
            });
    })

}

async function login() {
    return new Promise(res => {
        var data = '{\n    "ip": "127.0.0.1",\n    "password": "MD5(xxxxxx)",\n    "uc_device": {\n        "device_brand": "GOD",\n        "device_fingerprint": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",\n        "device_model": "NOBLE GOD",\n        "device_name": "NOBLE GOD",\n        "device_type": 1,\n        "platform": "收钱吧APP"\n    },\n    "username": "xxxxxx"\n}';

        var config = {
            method: 'post',
            url: 'https://mapi.shouqianba.com/v5/appUser/login?device_model=1&client_version=6.0.3&deviceId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&os_type=0',
            headers: {
                'appId': 'shouqianbaApp',
                'Shouqianba-Client': 'shouqianba-app-native',
                'Content-Type': 'application/json; charset=UTF-8',
                'Host': 'mapi.shouqianba.com',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'User-Agent': 'okhttp/3.12.2'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                res(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}

// 获取 accessToken, 需要 token
async function getAccessToken() {
    const { data } = await fetch('https://boss-circle.shouqianba.com/api/v1/user/login',
        {
            method: 'POST',
            body: JSON.stringify({ 'token': token }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
    // console.log(data.accessToken)
    return data.accessToken
}

async function refresh() {
    count -= 1
    const { data } = await login()
    token = data.mchUserTokenInfo.token
    accessToken = await getAccessToken()
    // 刷新环境变量
    await putEvn(token, 'SQB_TOKEN')
    await putEvn(accessToken, 'SQB_ACCESS_TOKEN')
    await fetch(`https://oapi.dingtalk.com/robot/send?access_token=c9dc9910ae0a01375726e5ec54507fd9c71acf2d70a81d51bc1e1002e0715a22`, {
        method: 'POST',
        body: JSON.stringify({
            "msgtype": "text",
            "text": { "content": `更新TOKEN：${token}; \n 更新ACCESS_TOKEN：${accessToken}` }
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (count > 0)
        run()
    else {
        fetch(`https://oapi.dingtalk.com/robot/send?access_token=c9dc9910ae0a01375726e5ec54507fd9c71acf2d70a81d51bc1e1002e0715a22`, {
            method: 'POST',
            body: JSON.stringify({
                "msgtype": "text",
                "text": { "content": `多次运行失败，请前往网站查看` }
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}
async function run() {
    let pushMsg = ``
    // 获取列表
    const latestFeedsData = await latestFeeds(token, accessToken)
    const recommendedFeedsData = await recommendedFeeds(token, accessToken)
    console.log(latestFeedsData)
    if (latestFeedsData.code !== '10000') {
        refresh()
        return
        // getAccessToken("OTllZjNmNWYtYTg4My00ZmZjLTk2YzEtMDg5MDNlYTg0MTg2OjE2NjQ5NDI2ODA3NTQ6NjA0ODAwMDAw.RGDutLcnMk")
    }


    for (let feed of latestFeedsData.data) {
        if (feed.liked) {
            pushMsg += `${feed.feedId} 已经赞过 \n`
            continue;
        }
        const res = await likeFeeds(feed.feedId)
        if (res) pushMsg += `${feed.feedId} 点赞成功 \n`
    }
    // 推荐列表评论加点赞
    for (let feed of recommendedFeedsData.data) {
        if (!feed.liked) {
            const res = await likeFeeds(feed.feedId)
            if (res) pushMsg += `${feed.feedId} 点赞成功 \n`
        } else {
            pushMsg += `${feed.feedId} 已经赞过 \n`
        }

        const commentList = await getCommentCopy(feed.feedId)
        const commentItem = commentList.data.records[Math.floor(commentList.data.records.length / 2)]

        if (commentItem && commentItem.content && commentItem.content.length <= 30) {
            const resCom = await releaseComment(feed.feedId, commentItem.content)
            // console.log(`${feed.feedId}评论内容：${commentItem.content}`)
            pushMsg += `${feed.feedId}评论内容：${commentItem.content} \n`
            // console.log(resCom)
        }
    }

    const res = await fetch(`https://oapi.dingtalk.com/robot/send?access_token=c9dc9910ae0a01375726e5ec54507fd9c71acf2d70a81d51bc1e1002e0715a22`, {
        method: 'POST',
        body: JSON.stringify({
            "msgtype": "text",
            "text": { "content": pushMsg }
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    console.log(pushMsg)

}

run()
// putEvn('yyyyyyyy')
// refresh()
// getAccessToken("OTllZjNmNWYtYTg4My00ZmZjLTk2YzEtMDg5MDNlYTg0MTg2OjE2NjQ5NDI2ODA3NTQ6NjA0ODAwMDAw.RGDutLcnMk")
// likeFeeds()
//getAccessToken('OTllZjNmNWYtYTg4My00ZmZjLTk2YzEtMDg5MDNlYTg0MTg2OjE2NjQ5NDI2ODA3NTQ6NjA0ODAwMDAw.RGDutLcnMk')
// latestFeeds("OTllZjNmNWYtYTg4My00ZmZjLTk2YzEtMDg5MDNlYTg0MTg2OjE2NjQ5NDI2ODA3NTQ6NjA0ODAwMDAw.RGDutLcnMk", "a404d4b1-35db-4d22-b3e1-5043abace5c0")