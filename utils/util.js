import Dialog from '../@vant/weapp/dist/dialog/dialog';
import {reqUrls} from "./config";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const requestSync = (url, {data = {}, method = "GET",loginFail=gotoLogin, whenComplete = x => wx.hideLoading()} = {}) => {
    return new Promise(function (resolve, reject) {
        const {token = "no-login"} = wx.getStorageSync("userInfo") || {}
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {channel: "weapp", token},
            success: function (res) {
                const {code = -1, msg = '操作失败'} = res.data
                // if (res.statusCode === 200) {
                if (code === 200) {
                    console.log(`wx.request() is success : 200 ok`);
                    console.log(res);
                    resolve(res.data); //任务成功就执行resolve(),其他情况下都执行reject()
                } else {
                    console.log("wx.request() is success : 200 lost.");
                    if (code === 7777) {
                        loginFail()
                    }
                    setTimeout(() => wx.showToast({title: msg, icon: 'none'}), 5);
                }
            },
            fail: function (res) {
                console.log("wx.request() is fail : " + res.errMsg);
                wx.showToast({title: "操作失败,请稍后在试一试", icon: 'none'});
                reject(res);
            },
            complete: function (res) {
                console.log("wx.request() is complete .");
                if (whenComplete) {
                    whenComplete(res);
                }
            }
        })

    });
}
const requestSyncR = (url, {
    data = {}, method = "GET", whenComplete = x => {
    }
} = {}) => {
    return requestSync(url, {
        data, method, whenComplete
    })
}

const makeAsyncFunc = function (fn, complete = () => {
}) {
    try {
        return fn().then(r => r);

    } catch (e) {
        console.log(e)
    } finally {
        complete()
    }
}

const getArgs = data => data.currentTarget.dataset.item

const gotoEvent = (args) => {
    const {actionType, path, appId, h5Router, forwardUrl, noticeMsg} = args
    const event = {
        //啥都不干
        0: () => {

        },
        //转跳Page
        10: () => {
            wx.navigateTo({
                url: path,
            });
        },
        //转跳webview
        20: () => {
            wx.navigateTo({
                url: `/pages/web/web?url=${forwardUrl}`,
            })
        },
        //转跳Page不带返回
        30: () => {
            wx.redirectTo({
                url: path,
            })
        },
        //提示
        40: () => {
            wx.showToast({title: noticeMsg, icon: 'none'});
        },
        //打开其他小程序
        50: () => {
            //打开其他小程序
            wx.navigateToMiniProgram({
                appId: appId,
                path: path
            });
        },
        60:()=>{
            wx.switchTab({
                url: path,
            });
        }
    }
    event[actionType]()

}
const gotoLogin = () => {
    Dialog.confirm({
        title: '登陆失效了',
        message: '登陆失效了,赶紧登陆吧',
        showCancelButton: false,
    })
        .then(() => {
            wx.setStorageSync("userInfo", null)
            wx.switchTab({url: '/pages/home/home'})
        })
        .catch(() => {
            // on cancel
        });
}
const wxLogin = (userInfo,{success, fail} = {
    success: e => {
    },
    fail: e => {
    }
}) => {
    wx.login({
        fail: msg => {
            fail(msg)
        },
        success: ({code, errMsg}) => {
            wx.showLoading({title: "登录中..."})
            requestSync(`${reqUrls}/shop/user/login`,
                {
                    method: 'POST', data: {userInfo, code}
                })
                .then(({data}) => {
                    wx.setStorageSync("userInfo", data)
                    success(data)
                })
        }
    })
}

module.exports = {
    formatTime: formatTime,
    requestSync: requestSync,
    requestSyncR: requestSyncR,
    makeAsyncFunc: makeAsyncFunc,
    getArgs: getArgs,
    wxLogin: wxLogin,
    gotoEvent: gotoEvent,
}