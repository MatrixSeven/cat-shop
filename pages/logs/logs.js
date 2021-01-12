import {formatTime, requestSync, requestSyncR, getArgs, makeAsyncFunc} from '../../utils/util'
import {reqUrls} from '../../utils/config'

Page({
    data: {
        searchHistory: [],
        page: 1,
        size: 10,
        currentKeyWord: '',
    },
    onLoad: function () {
        this.setData({
            searchHistory: wx.getStorageSync('searchHistory') || []
        })
        requestSyncR(`${reqUrls}/shop/goods/random`).then(ret => {
            this.setData({
                products: ret.data
            })
        })
    },

    onChange(e) {
        console.log(e)
        this.setData({
            currentKeyWord: e.detail,
        });
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
        const {currentKeyWord, searchHistory, page, size} = this.data
        const searchHistory_ = [currentKeyWord, ...searchHistory.filter(it => it !== currentKeyWord)]
        wx.setStorageSync("searchHistory", searchHistory_)
        wx.showLoading({
            title: "搜索中ing"
        })
        requestSync(`${reqUrls}/shop/goods/search?page=${page}&size=${size}&keyword=${currentKeyWord}`).then(ret => {
            this.setData({
                products: ret.data,
                searchHistory: searchHistory_
            })
        })
    }
})
