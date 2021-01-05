import {formatTime, requestSync} from '../../utils/util'

Page({
    data: {
        products: [],
        refresherStatus: false,
        type: 1,
        page: 1,
        size: 10,
    },
    onLoad: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        const {type, page, size} = this.data
        requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`).then(ret => {
            this.setData({
                products: [...this.data.products, ...ret.data],
                page: page + 1
            })
        })
    },
    refresher: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        this.setData({
            refresherStatus: true
        })
        const {type, size} = this.data
        const page = 1;
        requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`, {
            whenComplete: x => {
                wx.hideLoading();
                this.setData({
                    refresherStatus: false
                })
            }
        }).then(ret => {
            this.setData({
                products: ret.data,
                page: page + 1,

            })
        })
    },
    loadMore: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        const {type, page, size} = this.data
        requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`).then(ret => {
            this.setData({
                products: [...this.data.products, ...ret.data],
                page: page + 1
            })
        })


    }
})
