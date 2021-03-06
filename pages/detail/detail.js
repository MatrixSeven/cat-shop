// pages/detail/detail.js
import {getArgs, makeAsyncFunc, requestSyncR, requestSync, gotoEvent} from '../../utils/util'
import {reqUrls} from '../../utils/config'
import Dialog from "../../@vant/weapp/dist/dialog/dialog";


Page({

    /**
     * 页面的初始数据
     */
    detail: {},
    buyColor: '#dd514c',
    loadDown: false,
    empty: false,
    showBuy: false,
    showSub: false,
    subKey: '',
    canEdit: false,
    showGoHome: false,
    buySteps: [{
        // text: '',
        desc: '选择全部',
        inactiveIcon: 'arrow'
    }, {

        desc: '复制',
        inactiveIcon: 'arrow'
    }, {
        desc: '打开Tao宝',
        inactiveIcon: 'arrow'
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        const {id, showGoHome = false, fromType = "1", subKey = ''} = options
        const url = `${reqUrls}/shop/alliance/goodInfo/${id}`
        wx.showLoading({
            title: '加载中'
        })
        requestSync(url).then(({data}) => {
            let {couponStartTime, couponEndTime} = data
            if (couponEndTime && couponStartTime) {
                couponEndTime = couponEndTime.substr(0, 10)
                couponStartTime = couponStartTime.substr(0, 10)
            }
            this.setData({
                detail: data, id,
                loadDown: true,
                showGoHome,
                subKey,
                showSub: fromType === "3",
                couponStartTime: couponStartTime,
                couponEndTime: couponEndTime,

            })
        })

    },

    gotoHome: function () {
        const {showGoHome = false} = this.data
        if (showGoHome) {
            wx.reLaunch({url: "/pages/cat/cat"})
        } else {
            gotoEvent({
                actionType: 60,
                path: '/pages/cat/cat'
            })
        }
    },
    gotoHomeReLaunch: function () {
        wx.reLaunch({url: "/pages/cat/cat"})
    },
    gotoBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    onPullDownRefresh: function () {
        wx.showLoading({
            title: '加载中'
        })
        const {id} = this.data
        const url = `${reqUrls}/shop/alliance/goodInfo/${id}`
        requestSync(url).then(({data}) => {
            this.setData({
                detail: data, id,
                loadDown: true,

            })
        })
    },

    onSubscribe: function (e) {
        const that = this
        wx.requestSubscribeMessage({
            tmplIds: ['SWG5BqXp8MCs4gm8DDchgeltJPsWcunweR5cCOKzGXU'],
            success(res) {
                requestSync(`${reqUrls}/shop/active-subscribe`,
                    {
                        method: 'POST',
                        data: {template_id: ["SWG5BqXp8MCs4gm8DDchgeltJPsWcunweR5cCOKzGXU"]}
                    }).then(({data: {msg, pushTimes}}) => {
                    that.setData({showSub: false})
                    wx.showToast({title: "恭喜续订成功～", icon: 'none', number: 5})
                })
            },
            fail(e) {
                if (e.errMsg.contain('end')) {
                    return
                }
                that.setData({showSub: false})
                if (e.errMsg) {
                    Dialog.alert({
                        message: "订阅失败了,请到右上角小程序设置里面打开订阅通知开关,然后在来订阅哦"
                    })
                }
            }
        })
    },

    openWxQr() {

    },
    onShow() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline: function () {
        let path = `/pages/detail/detail?id=${this.data.id}&showGoHome=true`;
        const {detail: {syncMsg, mainPic}} = this.data
        return {
            title: syncMsg,
            path: path,
        };

    },
    onShareAppMessage: function (e) {
        let path = `/pages/detail/detail?id=${this.data.id}&showGoHome=true`;
        const {detail: {syncMsg, mainPic}} = this.data
        return {
            title: syncMsg,
            path: path,
            imageUrl: mainPic,
        };
    },
    buy() {
        this.setData({
            showBuy: true
        })
    },
    closeBuy() {
        this.setData({
            showBuy: false
        })

    },

    copyLing: function (e) {
        const {detail: {ling}} = this.data
        wx.setClipboardData({
            data: ling,
            success: () => {
                wx.showToast({
                    title: "恭喜,现在打开淘宝即可领取优惠券,赶紧出发吧！GO",
                    duration: 3000,
                    icon: 'none',
                });
                this.setData({
                    buyColor: '#669933',
                })
            },
            fail: (e) => {
                wx.showToast({
                    title: "复制失败了,请手动复制吧",
                    duration: 3000,
                    icon: 'none',
                });
                this.setData({
                    canEdit: true,
                })
            }
        })
    },
    gohome() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    }
})