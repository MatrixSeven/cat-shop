import {formatTime, requestSync, getArgs, makeAsyncFunc, requestSyncR} from '../../utils/util'
import {reqUrls} from '../../utils/config'

Page({
    data: {
        value: '',
        subKnow: [],
        mySubscribe: [{id: 1, value: "垃圾"}],
        subscribeRandom: [],
    },
    onLoad: function () {
        requestSync(`${reqUrls}/shop/subscribe/random`).then(({data}) => {
            console.log(data)
            this.setData({
                subKnow: data.subKnow,
                subscribeRandom: data.subscribeRandom
            })
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
