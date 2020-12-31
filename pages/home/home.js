import {formatTime, requestSync} from '../../utils/util'

Page({
    data: {
        isLogin: false
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return formatTime(new Date(log))
            })
        })
    },
    loadMore: function () {
        wx.showLoading({
            title: "loading"
        })
        requestSync('https://cat-card.52python.cn/wai_mai/product', {}, 'GET', () => wx.hideLoading())
            .then(res => {
                console.log(res)
                this.setData({
                    products: [...this.data.products, ...res.data]
                })
            })

    }
})
