import {getArgs, makeAsyncFunc, requestSyncR, requestSync} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp();
Page({
    data: {
        category: [],
        products: [],
        centerCategory: [],
        swiper: [],
        showPopupInfo: {show: false},
        type: 1,
        page: 1,
        size: 10,
        value: '',
        active: 0,
        next: true,
        Hei: '',
        showBuy: {
            show: false,
            ling: ''
        },
        buySteps: [{
            // text: '',
            desc: '选择全部',
            inactiveIcon: 'arrow'
        },
            {
                // text: '复制',
                desc: '复制',
                inactiveIcon: 'arrow'
            },
            {
                // text: '',
                desc: '打开Tao宝',
                inactiveIcon: 'arrow'
            }],
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
            const {data: {category, centerCategory, swiper}} = await requestSync(`${reqUrls}/shop/tabs`)
            const defaultType = category[0].type
            const {data} = await requestSync(`${reqUrls}/shop/goods/list/${defaultType}/${page}/${size}`)
            this.setData({
                category,
                centerCategory,
                swiper,
                type: defaultType,
                products: [...this.data.products, ...data],
                page: page + 1
            })
            this.selectComponent('#tabs').resize();
        })
    },

    onClickOtherItem: function (e) {
        const {type, args} = getArgs(e)
        const mapping = {
            //啥都不做
            0: () => {
            },
            //转跳
            10: () => {
                wx.navigateTo({
                    url: args,
                });
            },
            //webview
            20: () => {
                wx.navigateTo({
                    url: `/pages/web/web?url=${args}`,
                })
            },
            //转跳不带返回
            30: () => {

            },
            //提示
            40: () => {
                wx.showToast({title: args, icon: 'none'});
            }
        }
        mapping[type]()
    }
    ,
    onClosePopup:

        function () {
            console.log(1)
            this.setData({
                showPopupInfo: {show: false},
            })
        }

    ,
    onBuyPopup: function () {
        this.setData({
            showBuy: {show: false}
        })
    }
    ,
    onClickSwiper: function (e) {
        const {type, data} = getArgs(e)
        console.log(getArgs(e))
        /**
         * 0 webView
         * 10 mask-->{data:{title|content|img}}
         * 20 page
         */
        const event = {
            10: () => {
                this.setData({
                    showPopupInfo: {
                        show: true,
                        ...data
                    }
                })
            }
        }
        event[type]()


    }
    ,

    goBuy: function (e) {
        const {ling} = getArgs(e)
        wx.setClipboardData({
            data: ling, success: () => {
                wx.showToast({
                    title: "恭喜,现在打开淘宝即可领取优惠券,赶紧出发吧！GO",
                    duration: 3000,
                    icon: 'none',
                })
                setTimeout(() => this.setData({
                        showBuy: {
                            show: true,
                            ling: ling.substr(0, 45)
                        }
                    })
                    , 3000);
            }
        })
    }
    ,

    onTabChange: function (e) {
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        const {index, title} = e.detail
        const {size, category} = this.data
        this.loadMoreAux({
            ...this.data,
            page: 1, next: true, clear: true,
            type: category[index].type, size
        })
    }
    ,
    onSearch: function (e) {
        wx.navigateTo({
            url: '/pages/logs/logs',
        });
    }
    ,
    onChange: function (e) {
        this.setData({
            value: e.detail,
        });
    }
    ,

    onPullDownRefresh: function () {
        this.refresher();
    }
    ,
    onReachBottom: function () {
        this.loadMore();
    }
    ,


    refresher: function () {
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        const {type, size} = this.data
        const page = 1;
        makeAsyncFunc(async () => {
                const {data: product} = await requestSyncR(`${reqUrls} / shop / goods / list /${type}/${page}/${size}`)
                const {data: {category, centerCategory, swiper}} = await requestSyncR(`${reqUrls} / shop / tabs`)
                this.setData({
                    product,
                    swiper,
                    category,
                    centerCategory,
                })
            }, () => {
                wx.hideLoading();
                wx.stopPullDownRefresh();
            }
        )
    }
    ,

    loadMore: function () {
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        this.loadMoreAux(this.data)

    }
    ,
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
            let {data = []} = await requestSync(`${reqUrls} / shop / goods / list /${type}/${page}/${size}`)
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
