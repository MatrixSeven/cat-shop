// pages/detail/detail.js
import {getArgs, makeAsyncFunc, requestSyncR, requestSync} from '../../utils/util'
import {reqUrls} from '../../utils/config'


Page({

    /**
     * 页面的初始数据
     */
    detail: {},
    loadDown: false,
    empty: false,
    showGoHome: false,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {id, showGoHome = false} = options
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
                couponStartTime: couponStartTime,
                couponEndTime: couponEndTime,

            })
        })

    },

    gotoHome: function () {
        wx.receiver
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
    onShow() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },

    onShareTimeline:function(){
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
    gohome() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    }
})