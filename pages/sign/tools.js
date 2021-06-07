var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../we7/resource/js/util.js")), n = function() {
    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {}, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(t) {}, u = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : function() {}, a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "", r = arguments.length > 5 && void 0 !== arguments[5] && arguments[5], c = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : "entry/wxapp/distribute";
    "" === a && (a = "GET"), n.version = "1.0.2", t.default.request({
        showLoading: r,
        url: c,
        data: n,
        method: a,
        success: function(t) {
            var i = t.data;
            return -1 == i.status ? (o(n, e), !1) : 0 == i.status ? (wx.showModal({
                title: "提示",
                mask: !0,
                content: i.info,
                showCancel: !1
            }), !1) : void e(i);
        },
        fail: i,
        complete: u
    });
}, o = function(t, o) {
    wx.login({
        success: function(e) {
            void 0 === t && (t = {});
            var i = wx.getStorageSync("parent_id") || "";
            n({
                code: e.code,
                parent_id: i,
                contr: "noLogin",
                action: "login"
            }, function(e) {
                wx.setStorageSync("token", e.info), t.token = e.info, n(t, o, function() {}, function() {}, function() {}, "");
            });
        }
    });
};

module.exports = {
    request: n,
    post: function(t) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {}, i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : function() {}, u = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : function() {};
        arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
        return n(o, e, i, u, "POST");
    },
    upload: function(n) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function(t) {}, e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "image", i = t.default.url("entry/wxapp/distribute"), u = getCurrentPages();
        u.length && (u = u[getCurrentPages().length - 1]) && u.__route__ && (i = i + "&m=" + u.__route__.split("/")[0]), 
        wx.uploadFile({
            url: i,
            filePath: n,
            name: "file",
            header: {},
            formData: {
                contr: "noLogin",
                action: "upload",
                type: e
            },
            success: function(t) {
                console.log(t);
                var n = JSON.parse(t.data);
                o(n);
            },
            fail: function(t) {
                wx.hideLoading(), getApp().showToast("上传失败");
            }
        });
    },
    showNotice: function(t) {
        wx.showToast({
            title: t,
            mask: !0,
            image: "../../images/notice.png",
            duration: 2e3
        });
    }
};