import {formatTime, requestSync, getArgs, makeAsyncFunc, requestSyncR, wxLogin, gotoEvent} from '../../../utils/util'
import {reqUrls} from '../../../utils/config'
import Dialog from '../../../@vant/weapp/dist/dialog/dialog';

Page({
    data: {
        value: '',
        subKnow: [],
        pushTimes: 0,
        showLogin: false,
        mySubscribe: [],
        subscribeRandom: [],
    },
    onLoad: function () {
        const userInfo = wx.getStorageSync("userInfo")
        requestSync(`${reqUrls}/shop/subscribe/random`).then(({data}) => {
            this.setData({
                subKnow: data.subKnow,
                pushTimes: data.pushTimes,
                subscribeRandom: data.subscribeRandom
            })
        })
        if (userInfo) {
            requestSync(`${reqUrls}/shop/subscribe`).then(({data}) => {
                this.setData({
                    mySubscribe: data.mySubscribe
                })
            })
        } else {
            this.setData({
                showLogin: true
            })
        }


    },
    loginCancel: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    getUserInfo_: function (res) {
        const {detail} = res
        const {userInfo} = detail
        const back = () => Dialog.alert({
            title: '提示',
            message: '你取消了登录,暂时无法订阅\n[如果近期你拒绝过登录,可到小程序->设置->用户信息内修改授权选项进行修改,即可成功登录]',
        }).then(() => {
            wx.navigateBack({
                delta: 1
            });
        });
        console.log(userInfo)
        //获取成功
        if (userInfo) {
            wxLogin(userInfo, {
                success: data => {
                    wx.showLoading({title: "登录中..."})
                    requestSync(`${reqUrls}/shop/subscribe`).then(({data}) => {
                        this.setData({
                            mySubscribe: data.mySubscribe
                        })
                    })
                },
                fail: e => {
                    back()
                }
            })
        } else {
            back()
        }

    },
    onSubscribe: function (e) {
        const that = this
        wx.requestSubscribeMessage({
            tmplIds: ['SWG5BqXp8MCs4gm8DDchgeltJPsWcunweR5cCOKzGXU'],
            success(res) {
                console.log(res)
                requestSync(`${reqUrls}/shop/active-subscribe`,
                    {
                        method: 'POST',
                        data: {template_id: ["SWG5BqXp8MCs4gm8DDchgeltJPsWcunweR5cCOKzGXU"]}
                    }).then(({data: {msg, pushTimes}}) => {
                    that.setData({pushTimes})
                    wx.showToast({title: msg, icon: 'none', number: 5})
                })
            },
            fail(e) {
                if (e.errMsg.contain('end')) {
                    return
                }
                console.log(e)
                if (e.errMsg) {
                    Dialog.alert({
                        message: "订阅失败了,请到右上角小程序设置里面打开订阅通知开关,然后在来订阅哦"
                    })
                }

            }

        })

    },
    onKeyChange: function (e) {
        if (e.detail && e.detail !== '') {
            this.setData({
                value: e.detail,
            });
        }
    },
    addSubKeyFomInput: function () {
        this.addSubKey(this.data.value)
    },
    addSubKeyFromRandom: function (e) {
        const {value} = getArgs(e)
        this.addSubKey(value)
    },
    addSubKey: function (value) {
        const {mySubscribe} = this.data
        if (value && value.trim() === '') {
            wx.showToast({title: '你添加的啥子哦～', icon: 'none'});
            return
        }
        if (value && value.trim().length < 1) {
            wx.showToast({title: '至少两次字哦～', icon: 'none'});
            return
        }
        if (value && value.trim().length > 5) {
            wx.showToast({title: '关键字太长了～', icon: 'none'});
            return
        }
        const newSub = mySubscribe.filter(it => it.keyWord === value)
        if (newSub.length > 0) {
            wx.showToast({title: '已经添加过了,不要重复添加哦', icon: 'none'});
            return
        }
        requestSync(`${reqUrls}/shop/subscribe`,
            {
                method: "POST", data: {
                    keyword: value,
                    templateId: "SWG5BqXp8MCs4gm8DDchgeltJPsWcunweR5cCOKzGXU",
                }
            }).then(({data: {id}}) => {
            this.setData({
                mySubscribe: [{keyId: id, keyWord: value}, ...mySubscribe],
            })
            wx.showToast({title: '添加订阅词成功,记得点击下方激活订阅', icon: 'none'});
        })
    },
    delSubKey: function (e) {
        const {keyId} = getArgs(e)
        const {mySubscribe} = this.data
        const newSub = mySubscribe.filter(it => it.keyId !== keyId)
        requestSync(`${reqUrls}/shop/subscribe`,
            {
                method: "DELETE", data: {
                    keyId: keyId,
                    templateId: "1",
                }
            }).then(_ => {
            this.setData({
                mySubscribe: newSub,
            })
        })
    },
    gotoHome: function () {
        gotoEvent({
            actionType: 60,
            path: '/pages/cat/cat'
        })
    },
    gotoBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    onShareTimeline: function () {
        let path = `/pages/subscribe/subscribe`;
        return {
            title: "订阅监控商品!豪车不错过！及时推送～",
            path: path,
        };
    },

    onShareAppMessage: function (e) {
        let path = `/pages/subscribe/subscribe`;
        return {
            title: "订阅监控商品!豪车不错过！及时推送～",
            path: path,
        };
    }
})
