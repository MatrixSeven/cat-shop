import {getArgs, makeAsyncFunc, requestSyncR, requestSync, gotoEvent} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp();
Page({
    data: {
        category: [],
        products: [],
        centerCategory: [],
        type: 1,
        page: 1,
        size: 10,
        value: '',
        active: 0,
        next: true,
        initLoad: true,
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
            const {data: {category, centerCategory}} = await requestSync(`${reqUrls}/shop/xr/index`)
            const defaultType = category[0].type
            const {data} = await requestSync(`${reqUrls}/shop/goods/list/${defaultType}/${page}/${size}`)
            this.setData({
                category,
                centerCategory,
                type: defaultType,
                products: [...this.data.products, ...data],
                page: page + 1,
                initLoad: false
            })
            this.selectComponent('#tabs').resize();
        })
    }
    ,
    onClosePopup: function () {
        this.setData({
            showPopupInfo: {show: false},
        })
    }

    ,
    onClickNotice: function (e) {
        gotoEvent(getArgs(e))
    },

    goBuy: function (e) {
        const {
            ling, syncId, ev = true, channel = "-1", searchId,
            goodsId, jdPath, jdAppId
        } = getArgs(e)
        if (!ev) {
            wx.showToast({title: '功能开发中,暂时无法使用', 'icon': "none"})
            return
        }
        if (channel === 'pdd_get') {
            makeAsyncFunc(async () => {
                const {data: {we_app_info: {app_id, page_path}}} = await requestSync(`${reqUrls}/shop/pdd/gen`,
                    {
                        data: {
                            search_id: searchId,
                            goods_id_list: goodsId
                        }
                    })
                gotoEvent({
                    actionType: 50,
                    appId: app_id,
                    path: page_path

                })
            })
        } else if (channel === 'jd') {
            gotoEvent({
                actionType: 50,
                appId: jdAppId,
                path: jdPath
            })
        } else {
            wx.navigateTo({
                url: `/pages/detail/detail?id=${syncId}`,
            })
        }

    }
    ,

    onTabChange: function (e) {
        // title index name
        const args=e.detail
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        const {index} = args
        console.log(index)
        const {size, category} = this.data
        this.loadMoreAux({
            ...this.data,
            page: 1, next: true, clear: true,
            type: category[index].type, size
        })
    }
    ,
    onClickOtherItem: function (args) {
        const e=getArgs(args)
        this.setData({
            active : e.actionType - 1
        })
        this.onTabChange({detail:{index:e.actionType - 1}});
    },

    onSearch: function (e) {
        wx.navigateTo({
            url: '/pages/search/search',
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
                const {data: products} = await requestSyncR(`${reqUrls}/shop/goods/list/${type}/${page}/${size}`)
                const {data: {category, centerCategory}} = await  requestSync(`${reqUrls}/shop/xr/index`)
                this.setData({
                    products,
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
                next: data.length >= size
            })
        })
    },
    onShow: function () {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                active: app.globalData.activeIdx
            })

        }
    },

    onShareAppMessage: function (e) {
        const name = wx.getStorageSync("userName")
        let path = `/pages/cat/cat?from=${name}`;
        return {
            title: "哇~今日发车,偶u的猫咪物",
            path: path,
            // imageUrl: mainPic,
        };
    }
})
