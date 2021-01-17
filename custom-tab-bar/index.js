Component({
    data: {
        selected: 0,
        list: [
            {
                pagePath: "/pages/index/index",
                text: "外卖优惠",
                // normal: '/images/tabbar/position.png',
                // active: '/images/tabbar/position-green.png'
            },
            {
                pagePath: "/pages/cat/cat",
                text: "每日猫车",
                // normal: '/images/tabbar/idcard.png',
                // active: '/images/tabbar/idcard-green.png'
            },
            // {
            //     pagePath: "/pages/subscribe/subscribe",
            //     text: "猫咪百科",
            // },
            {
                pagePath: "/pages/home/home",
                text: "我的",
            },
        ]
    },
    methods: {
        onChange(e) {
            this.setData({active: e.detail});
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
