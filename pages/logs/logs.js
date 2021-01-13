import {formatTime, requestSync, requestSyncR, getArgs, makeAsyncFunc} from '../../utils/util'
import {reqUrls} from '../../utils/config'

const app = getApp();
Page({
    data: {
        searchHistory: [],
        products: [],
        page: 1,
        size: 10,
        showSearchTitle: "猜你喜欢",
        currentKeyWord: '',
        showEmpty: false,
        navHeight: ((app.menu.top - app.system.statusBarHeight) * 2 + app.menu.height + app.system.statusBarHeight + 1),
    },
    onLoad: function () {
        this.setData({
            searchHistory: wx.getStorageSync('searchHistory') || []
        })
        requestSyncR(`${reqUrls}/shop/goods/random`).then(({data}) => {
            this.setData({
                products: data,
            })
        })
    },
    gotoBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    onChange(e) {
        if (e.detail && e.detail !== '') {
            this.setData({
                currentKeyWord: e.detail,
            });
        }
    },
    clearSearchHistory: function () {
        this.setData({
            searchHistory: []
        })
        wx.setStorageSync("searchHistory", [])
    },

    tagClick: function (e) {
        const tag = getArgs(e)
        this.setData({
            currentKeyWord: tag
        })
        this.onSearch()
    },

    onSearch: function () {
        const {currentKeyWord, searchHistory, page, size, products} = this.data
        const searchHistory_ = [currentKeyWord, ...searchHistory.filter(it => it !== currentKeyWord)]
        wx.setStorageSync("searchHistory", searchHistory_)
        wx.showLoading({
            title: "搜索中ing"
        })
        requestSync(`${reqUrls}/shop/goods/search?page=${page}&size=${size}&keyword=${currentKeyWord}`).then(({data}) => {
            const showEmpty = data.length === 0
            this.setData({
                products: showEmpty ? products : data,
                showSearchTitle: "搜索结果",
                showEmpty,
                searchHistory,
            })
        })
    },
})
