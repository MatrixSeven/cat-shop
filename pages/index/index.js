//index.js
//获取应用实例
const wx2 = require('../../utils/util.js')

const app = getApp()

Page({
    data: {
        active: 0,
        category: [],
        subscribe: {},
        projectList: [],
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onShow: function () {
        this.getTabBar().init();
    },

    onLoad: function () {

        this.setData({
            that: this
        })
        this.changeBar(0, this)
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    toProject: e => {
        const item = e.currentTarget.dataset.item
        console.log(item.appid)
        wx.navigateToMiniProgram({
            appId: item.appid,
            path: item.path
        })
    },

    change: function (e) {
        console.log(e)
        const {index, title} = e.detail
        this.setData({active: index})
        this.changeBar(index, this)
    },

    changeBar: (index, bind) => {
        wx.showLoading({
            title: '优惠加载中....',
            mask: true,

        })
        wx2.requestSync(`https://cat-card.52python.cn/wai_mai/index?cate_id=${index}&&channel=wx`,
            {whenComplete: () => wx.hideLoading()})
            .then(res => {
                console.log(res);
                let _category = res.category
                let _subscribe = res.subscribe
                let projects = res.projects
                let newProjects = []

                for (let item in projects) {
                    if (projects[item].path) {
                        newProjects.push(projects[item])
                    }
                }
                bind.setData({
                    projectList: newProjects,
                    subscribe: _subscribe,
                    category: _category
                })
            })
    },


    getArgs: data => data.currentTarget.dataset,

    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})