// const app = getApp()
Component({
    data: {
        active: 0,
        list: [

            {
                pagePath: "/pages/cat/cat",
                text: "每日猫车",
                normal: '/images/tabbar/cat.png',
                active: '/images/tabbar/cat_green.png'
            },
            {
                pagePath: "/pages/index/index",
                text: "商城",
                normal: '/images/tabbar/shop.png',
                active: '/images/tabbar/shop_green.png'
            },
            {
                pagePath: "/pages/subscribe/subscribe",
                text: "猫咪百科",
                normal: '/images/tabbar/baike.png',
                active: '/images/tabbar/baike_green.png'
            },
            {
                pagePath: "/pages/home/home",
                text: "我的",
                normal: '/images/tabbar/home.png',
                active: '/images/tabbar/home_green.png'
            },
        ]
    },
    methods: {
        onChange(e) {
            getApp().globalData.activeIdx = e.detail

            if (this.data.active === e.detail) {
                return false;
            }
            this.setData({active: e.detail})
            wx.switchTab({
                url: this.data.list[e.detail].pagePath
            });

        },
        init() {
            const page = getCurrentPages().pop();
            this.setData({
                active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
            });
        }
    }
})
