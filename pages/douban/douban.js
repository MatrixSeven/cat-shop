import {getArgs, makeAsyncFunc, requestSyncR, requestSync, gotoEvent} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp();
Page({
    data: {
        category: [],
        products: [],
        centerCategory: [],
        swiper: [],
        noticeMsg: [],
        showPopupInfo: {show: false},
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

    checkToken:function({adUid}){
        if(!adUid){
            return
        }
        const adId = wx.getStorageSync("adUid") || '-1'
        if(adId=='-1'){
            wx.setStorageSync('adUid',adId)
        }
    },
    onLoad: function (option) {
        checkToken(option)
        wx.showLoading({
            mask: false,
            title: "豆瓣加载ing"
        })
        makeAsyncFunc(async () => {
            const {page, size} = this.data
            const {
                data: {
                    tab, swiper = [], noticeMsg = [],centerCategory=[]
                }
            } = await requestSync( `${reqUrls}/history/kai/list/config`)
            const defaultType = tab[0].type;
            const {data} = await requestSync(`${reqUrls}/history/kai/list/${defaultType}/${page}/${size}`)
            this.setData({
                tab,
                swiper,
                category:tab,
                centerCategory,
                type:defaultType,
                noticeMsg:noticeMsg,
                type: defaultType,
                products: [...this.data.products, ...data],
                page: page + 1,
                initLoad: false
            })
            this.selectComponent('#tabs').resize();
        })
    },

    onClickOtherItem: function (e) {
        gotoEvent(getArgs(e))
    }
    ,
    onClosePopup: function () {
        this.setData({
            showPopupInfo: {show: false},
        })
    }

    ,
    onClickNotice: function () {
        gotoEvent(this.data.noticeMsg[0])
    },
    onBuyPopup: function () {
        this.setData({
            showBuy: {show: false}
        })
    }
    ,
    onClickSwiper: function (e) {
        gotoEvent(getArgs(e))
    }
    ,

    goDetail: function (e) {
       
    }
    ,

    onTabChange: function (e) {
        console.log(e)
        wx.showLoading({
            mask: false,
            title: "优惠加载中ing"
        })
        const {index, title} = e.detail
        const {size, category} = this.data
        console.log(category)
        this.loadMoreAux({
            ...this.data,
            page: 1, next: true, clear: true,
            type: category[index].type, size
        })
    }
    ,
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
                const {data} = await requestSyncR(`${reqUrls}/history/kai/list/${type}/${page}/${size}`,)
                const {data: {tab, category = [], centerCategory = [], swiper = []}} = await requestSyncR(`${reqUrls}/history/kai/list/config`)
                this.setData({
                    products:data,
                    tab,
                    category:tab,
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
            let {data = []} = await requestSync(`${reqUrls}/history/kai/list/${type}/${page}/${size}`)
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

    onShareTimeline: function () {
        const name = wx.getStorageSync("userName")
        let path = `/pages/cat/cat?from=${name}`;
        const {share: {shareTitle}} = this.data
        return {
            title: shareTitle,
            path: path,
        };
    },

    onShareAppMessage: function (e) {
        const name = wx.getStorageSync("userName")
        let path = `/pages/cat/cat?from=${name}`;
        const {share: {shareTitle}} = this.data
        return {
            title: shareTitle,
            path: path,
        };
    }
})
