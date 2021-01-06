import {formatTime, makeAsyncFunc, requestSync} from '../../utils/util'

Page({
    data: {
        products: [],
        refresherStatus: false,
        type: 1,
        page: 1,
        size: 10,
        value: '',
        active: 0,
        tabs: ['每日猫车', '每日人车', '罐头', '零食', '猫窝', '猫沙'],
    },


    onLoad: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        makeAsyncFunc(async () => {
            const {type, page, size} = this.data
            const {data} = await requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`)
            this.setData({
                products: [...this.data.products, ...data],
                page: page + 1
            })
        })
    },


    onTabChange: function (e) {

    },
    onSearch: function (e) {
        console.log(e)

    },
    onChange: function (e) {
        this.setData({
            value: e.detail,
        });
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
        makeAsyncFunc(async () => {
            const {data = []} = await requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`)
            this.setData({
                products: [...this.data.products, ...data],
                page: page + 1
            })
        })


    }
})
