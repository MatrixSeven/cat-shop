const n = getApp();
const wx2 = require('../../utils/util.js')
import { reqUrls } from '../../utils/config'


Page({
    data: {
        videoAd: "",
        hasVideoAd: !1,
        show_sgin: !1,
        show_pop: !1,
        feed_succ: !1,
        feed_fail: !1,
        collect_show: !1,
        setTimeself: "",
        currencyTimeself: "",
        m_height: 60,
        t_h: "00",
        t_m: "00",
        t_i: "00",
        is_request: 1,
        show_capacity: !1,
        parent_id: 0,
        goldcoin: [],
        is_rule: 1,
        showAddMeBtn: !1,
        surplus: 0,
        show_login: true,
        is_auth: false,
        show_bd: !1,
        is_video: 1,
        isChason: false,
        all_num: 200,
        rule: [
            {
                id: 19,
                content: "垃圾混垃圾人",
                position: 1,
                sort: 1,
                uniacid: 2,
                created: 1623059524
            }
        ],
        images: {
            login_image: "http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/3.png",
            resize: 'http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/resize.png',
            more: "http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/more.png",
            wave_bot: 'http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/wave-bot.png',
            home_bg_image: 'http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/3.png',
            wave_mid: 'http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/wave-mid.png',
        },
        wave_top: 'http://139.9.86.181:53505/addons/bh_rising/template/static/images/xcx/wave-top.png',
    },
    config: {
        clock_text: "点击打卡"

    },
    gotoBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    signIn: function () {
        // this.data.surplus > 0 || (e.data.is_auth ? e.data.config.profit_subscribe_id ? wx.requestSubscribeMessage({
        //     tmplIds: [e.data.config.profit_subscribe_id],
        //     success: function (t) {
        //         e.succTips();
        //     },
        //     fail: function (t) { },
        //     complete: function (t) {
        //         e.conduct();
        //     }
        // }) : e.conduct() :
        this.setData({
            show_login: false
        });
    },
    conduct: function () {
        e.data.hasVideoAd ? this.videoAdShow() : e.completed();
    },
    succTips: function () {
        docker - php - ext - enable
        var t = {
            action: "addTips",
            contr: "my",
            token: wx.getStorageSync("token")
        };
        o.default.request(t, function (t) { });
    },
    cancel_login: function () {
        e.setData({
            show_login: !1
        });
    },
    onLoad: function (t) {
        // (e = this).data.goldcoin.length = 10, t.parent_id && wx.setStorageSync("parent_id", t.parent_id), 
        // t.scene && wx.setStorageSync("parent_id", decodeURIComponent(t.scene)), e.clearTime();
    },
    swRule: function () {
        this.setData({
            gdtext: "page-home-frien"
        });
    },
    onReady: function () {
        // wx.createSelectorQuery().select("#global-nav").boundingClientRect(function (t) {
        //     e.setData({
        //         m_height: t.height
        //     }), n.globalData.nav_height = t.height;
        // }).exec();
        var a = {
            action: "home",
            contr: "index",
            token: wx.getStorageSync("token")
        };
        // o.default.request(a, function(o) {
        //     e.setData(o.info), wx.getStorageSync("showAddMeFlag" + o.info.time) || e.setData({
        //         showAddMeBtn: !0
        //     });
        //     var n = null;
        //     wx.createInterstitialAd && o.info.config.screen_ad && ((n = wx.createInterstitialAd({
        //         adUnitId: o.info.config.screen_ad
        //     })).onLoad(function() {
        //         console.log("onLoad event emit");
        //     }), n.onError(function(t) {
        //         console.log("onError event emit", t);
        //     }), n.onClose(function(t) {
        //         console.log("onClose event emit", t);
        //     }), n.show().catch(function(t) {
        //         console.error(t);
        //     }));
        //     var a = wx.getSystemInfoSync();
        //     o.info.config.video_ad && (t(a.SDKVersion, "2.6.0") && (e.data.videoAd = wx.createRewardedVideoAd({
        //         adUnitId: o.info.config.video_ad
        //     }), e.data.videoAd.onError(function(t) {
        //         console.log(t);
        //     })), e.setData({
        //         hasVideoAd: !0
        //     }));
        // }, function(t) {}, function() {}, "", !0);
    },
    completed: function () {
        if (1 == this.data.is_request) {
            this.data.is_request = 2;
            var t = {
                action: "sign",
                contr: "clock",
                token: wx.getStorageSync("token")
            };
            o.default.request(t, function (t) {
                e.data.is_request = 1, 2 == t.status ? wx.showModal({
                    title: "提示",
                    mask: !0,
                    content: t.info,
                    showCancel: !1
                }) : (e.loadClock(), e.setData(t.info), e.setData({
                    show_bd: !0,
                    bd_img: t.info.bd_img,
                    surplus: e.data.config.clock_interval
                }), e.data.surplus > 0 && (e.clearTime(), e.countdown()));
            }, function (t) {
                e.data.is_request = 1;
            }, function () {
                e.data.is_request = 1;
            }, "", !0);
        }
    },
    loadClock: function () {
        var t = {
            action: "today",
            contr: "index",
            token: wx.getStorageSync("token")
        };
        o.default.request(t, function (t) {
            e.setData(t.info);
        });
    },
    hideBd: function () {
        e.setData({
            show_bd: !1
        });
    },

    submitClick: function () {
        wx.showToast({
            title: "操作成功",
            icon: "none",
            duration: 2e3
        });
        var t = this;
        t.setData({
            yf_submit: 0
        }), setTimeout(function () {
            t.setData({
                yf_submit: 1
            });
        }, 2e3);
    },

    onClickAddToMinProgramCloseBtn: function () {
        wx.setStorageSync("showAddMeFlag" + this.data.time, !0), this.setData({
            showAddMeBtn: !1
        });
    },
    countdown: function () {
        var t = e.data.surplus;
        console.log(t), e.data.surplus--;
        var o = Math.floor(t / 60 / 60 % 24), n = Math.floor(t / 60 % 60), a = Math.floor(t % 60);
        if (e.data.surplus < 0) e.clearTime(); else {
            o < 10 && (o = "0" + o), n < 10 && (n = "0" + n), a < 10 && (a = "0" + a);
            e.data.setTimeself = setTimeout(function () {
                e.setData({
                    surplus: e.data.surplus
                });
                var t = {
                    surplus: e.data.surplus,
                    time: Date.parse(new Date())
                };
                wx.setStorageSync("surplus", t), e.countdown();
            }, 1e3);
        }
    },
    hideSgin: function () {
        e.setData({
            show_sgin: !1
        });
    },
    videoAdShow: function (t) {
        this.data.videoAd && 1 == e.data.is_video && (e.data.is_video = 2, this.data.videoAd.show().catch(function () {
            e.data.videoAd.load().then(function () {
                return e.data.videoAd.show();
            }).catch(function (t) {
                e.data.is_video = 1, wx.showToast({
                    icon: "none",
                    title: "激励视频加载失败~"
                }), console.log("激励视频 广告显示失败");
            });
        }), e.data.videoAd.offError(function (t) {
            e.data.is_video = 1, console.log(t);
        }), e.data.videoAd.onClose(function (t) {
            e.data.is_video = 1, e.data.videoAd.offClose(), (t && t.isEnded || void 0 === t) && e.completed();
        }));
    },
    onShow: function () {

        // if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        //     this.getTabBar().setData({
        //         active: app.globalData.activeIdx
        //     })
        // }
        // this.getTabBar().init();
        // this.onLoad()

        var t = wx.getStorageSync("surplus");
        if (console.log(t), t) {
            var o = Date.parse(new Date());
            if (o - parseInt(t.time) < 1e3 * parseInt(t.surplus)) {
                var n = (1e3 * parseInt(t.surplus) - (o - parseInt(t.time))) / 1e3;
                e.setData({
                    surplus: n
                }), e.clearTime(), e.countdown();
            }
        }

        // e.loadClock();
    },
    gotoRank: function () {
        // wx.navigateTo({
        //     url: "/bh_rising/pages/rank/rank"
        // });
    },
    onHide: function () { },
    onUnload: function () {
        this.clearTime();
    },
    onPullDownRefresh: function () { },
    onReachBottom: function () { },
    onShareAppMessage: function () {
        return {
            title: this.data.share.text,
            imageUrl: this.data.share.images,
            // path: "bh_rising/pages/index/index?parent_id=" + this.data.share.member_id
        };
    },
    clearTime: function () {
        clearTimeout(e.data.setTimeself);
    },
    getUserInfo: function (t) {
        if ("getUserInfo:ok" == t.detail.errMsg) {
            var n = {
                action: "login",
                contr: "my",
                token: wx.getStorageSync("token"),
                encryptedData: t.detail.encryptedData,
                iv: t.detail.iv
            };
            o.default.request(n, function (t) {
                e.setData({
                    is_auth: !0
                });
            });
        } else { console.log("用户拒绝了") };
    },
    closecapacity: function () {
        e.setData({
            show_capacity: !1
        });
    }
});