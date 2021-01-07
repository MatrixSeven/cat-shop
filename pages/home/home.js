import {formatTime, requestSync} from '../../utils/util'
import {reqUrls} from '../../utils/config'

Page({
    data: {
        isLogin: false,
        userInfo: {}
    },
    onLoad: function () {
        const userInfo = wx.getStorageSync("userInfo")
        if (userInfo) {
            this.setData({
                isLogin: true,
                userInfo: userInfo,
            })
        } else {
            this.setData({
                isLogin: false,
            })
        }

    },
    bindGetUserInfo: function (e) {
        /**
         avatarUrl:""
         city: ""
         country: ""
         gender: 0
         language: "zh_CN"
         nickName: "Accelerator、"
         province: ""
         */
        console.log(e.detail.userInfo)
        const userInfo = e.detail.userInfo
        if (userInfo) {
            wx.setStorageSync("userInfo", userInfo)
            this.setData({
                userInfo: userInfo,
                isLogin: true,
            })
        } else {
            //用户按了拒绝按钮
        }
    },
    loadMore: function () {
        wx.showLoading({
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
