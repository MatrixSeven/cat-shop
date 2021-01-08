import {formatTime, makeAsyncFunc, requestSyncR, requestSync} from '../../utils/util'
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
        more: [],
        Hei: '',
        navHeight: ((app.menu.top - app.system.statusBarHeight) * 2 + app.menu.height + app.system.statusBarHeight + 1),
    },
    imgH: function (e) {
        var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
        var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
        var imgw = e.detail.width;
        var swiperH = winWid * imgh / imgw + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
        this.setData({
            Hei: swiperH　　　　　　　　//设置高度
        })
    },

    onLoad: function () {
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        makeAsyncFunc(async () => {
            const {page, size} = this.data
            const {data: {tabs, more}} = await requestSync(`${reqUrls}/shop/tabs`)
            const defaultType = tabs[0].type
            const {data} = await requestSync(`${reqUrls}/shop/goods/list/${defaultType}/${page}/${size}`)
            this.setData({
                tabs: tabs,
                more: more,
                type: defaultType,
                products: [...this.data.products, ...data],
                page: page + 1
            })
            this.selectComponent('#tabs').resize();
        })
    },


    onTabChange: function (e) {
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        const {index, title} = e.detail
        const {size, tabs} = this.data
        console.log(tabs)
        console.log(index)
        this.loadMoreAux({
            ...this.data,
            page: 1, next: true, clear: true,
            type: tabs[index].type, size
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
            mask: false,
            title: "优惠加载中ing"
        })
        const {type, size} = this.data
        const page = 1;
        makeAsyncFunc(async () => {
                const {data: product} = await requestSyncR(`${reqUrls}/shop/goods/list/${type}/${page}/${size}`)
                const {data: {tabs, more}} = await requestSyncR(`${reqUrls}/shop/tabs`)
                this.setData({
                    product: product,
                    tabs: tabs,
                    more: more,
                })
            }, () => {
                wx.hideLoading();
                wx.stopPullDownRefresh();
            }
        )
    },

    loadMore: function () {
        wx.showLoading({
            mask: false,
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
