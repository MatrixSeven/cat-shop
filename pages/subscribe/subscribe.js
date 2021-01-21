import {formatTime, requestSync, getArgs, makeAsyncFunc, requestSyncR} from '../../utils/util'
import {reqUrls} from '../../utils/config'
import Dialog from '../../@vant/weapp/dist/dialog/dialog';

Page({
    data: {
        value: '',
        subKnow: [],
        showLogin: false,
        mySubscribe: [{id: 1, value: "垃圾"}],
        subscribeRandom: [],
    },
    onLoad: function () {
        const userInfo = wx.getStorageSync("userInfo")
        requestSync(`${reqUrls}/shop/subscribe/random`).then(({data}) => {
            console.log(data)
            this.setData({
                subKnow: data.subKnow,
                subscribeRandom: data.subscribeRandom
            })
        })
        if (userInfo) {
            console.log(userInfo)
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
            wx.login({
                fail: msg => {
                    back()
                },
                success: ({code, errMsg}) => {
                    wx.showLoading({title: "登录中..."})
                    requestSync(`${reqUrls}/shop/user/login`,
                        {
                            method: 'POST', data: {userInfo, code}
                        })
                        .then(({data}) => {
                            wx.setStorageSync("userInfo", userInfo)
                        })
                }
            })
        } else {
            back()
        }

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
        }
        if (value && value.trim().length < 1) {
            wx.showToast({title: '至少两次字哦～', icon: 'none'});
        }
        const newSub = mySubscribe.filter(it => it.value === value)
        if (newSub.length > 0) {
            wx.showToast({title: '已经添加过了,不要重复添加哦', icon: 'none'});
            return
        }
        requestSync(`${reqUrls}/shop/subscribe?keyword=${value}`, {method: "POST"}).then(({data}) => {
            this.setData({
                mySubscribe: [{id: data, value: value}, ...mySubscribe],
            })
            wx.showToast({title: '添加订阅词成功,记得点击下方激活订阅', icon: 'none'});
        })
    },
    delSubKey: function (e) {
        const {id} = getArgs(e)
        const {mySubscribe} = this.data
        const newSub = mySubscribe.filter(it => it.id !== id)
        this.setData({
            mySubscribe: newSub,
        })

    },
    gotoHome: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    gotoBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
})
