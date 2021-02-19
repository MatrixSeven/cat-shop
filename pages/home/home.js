import {formatTime, gotoEvent,requestSync, wxLogin} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp()
Page({
    data: {
        isLogin: false,
        userInfo: {}
    },

    onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                active: app.globalData.activeIdx
            })
        }
        this.onLoad()
    },
    onLoad: function () {
        const userInfo = wx.getStorageSync("userInfo")
        if (userInfo) {
            requestSync(`${reqUrls}/shop/user`, {
                loginFail: e => {
                    this.setData({isLogin: false})
                    wx.setStorageSync("userInfo", null)
                }
            }).then(e => {
                this.setData({
                    isLogin: true,
                    userInfo: userInfo,
                })
            })

        } else {
            this.setData({
                isLogin: false,
            })
        }

    },
    gotoSub:function (e) {
        gotoEvent({
            actionType:10,
            path:'/pages/subscribe/subscribe'
        })
    },
    bindGetUserInfo: function (e) {
        const userInfo = e.detail.userInfo
        if (userInfo) {
            wxLogin(userInfo, {
                success: e => {
                    console.log(e)
                    this.setData({
                        userInfo,
                        isLogin: true

                    })
                }
            })
        } else {
            //用户按了拒绝按钮
        }
    },
    loadMore: function () {
        wx.showLoading({
            mask: false,
            title: "loading"
        })
        requestSync(`${reqUrls}/wai_mai/product`).then(res => {
            console.log(res)
            this.setData({
                products: [...this.data.products, ...res.data]
            })
        })

    }
})
