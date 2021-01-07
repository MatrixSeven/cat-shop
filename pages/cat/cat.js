import {formatTime, makeAsyncFunc, requestSync} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp();
console.log(app)
Page({
    data: {
        products: [],
        type: 1,
        page: 1,
        size: 10,
        value: '',
        active: 0,
        next: true,
        tabs: [],
        navHeight: ((app.menu.top - app.system.statusBarHeight) * 2 + app.menu.height + app.system.statusBarHeight + 1),
    },


    onLoad: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        makeAsyncFunc(async () => {
            const {page, size} = this.data
            const {data: tabs} = await requestSync(`${reqUrls}/shop/tabs`)
            console.log(tabs)
            const defaultType = tabs[0].type
            const {data} = await requestSync(`${reqUrls}/shop/goods/list/${defaultType}/${page}/${size}`)
            this.setData({
                tabs: tabs,
                type: defaultType,
                products: [...this.data.products, ...data],
                page: page + 1
            })
        })
    },


    onTabChange: function (e) {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        const {index, title} = e.detail
        const {size} = this.data
        this.loadMoreAux({
            ...this.data,
            page: 1, next: true, clear: true,
            type: this.data.tabs[index].type, size
        })
    },
    onSearch: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/logs/logs',
        });
    },
    onChange: function (e) {
        this.setData({
            value: e.detail,
        });
    },

    onPullDownRefresh: function () {
        this.refresher();
    },
    onReachBottom: function () {
        this.loadMore();
    },


    refresher: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        const {type, size} = this.data
        const page = 1;
        requestSync(`${reqUrls}/shop/goods/list/${type}/${page}/${size}`, {
            whenComplete: x => {
                wx.hideLoading();
                wx.stopPullDownRefresh();
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
        this.loadMoreAux(this.data)

    },
    loadMoreAux: function (data) {
        const {type, page, size, next, clear = false} = data
        if (!next) {
            wx.showToast({
                title: "到底啦～",
                duration: 2000
            })
            return
        }

        makeAsyncFunc(async () => {
            let {data = []} = await requestSync(`${reqUrls}/shop/goods/list/${type}/${page}/${size}`)
            if (data === ({})) {
                data = []
            }
            let p = data
            if (!clear) {
                p = [...this.data.products, ...data]
            }
            this.setData({
                products: p,
                type: type,
                page: page + 1,
                next: data.length === size
            })
        })
    }
})
