Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "打卡",
        // normal: '/images/tabbar/position.png',
        // active: '/images/tabbar/position-green.png'
      },
      {
        pagePath: "/pages/cat/cat",
        text: "猫咪优惠",
        // normal: '/images/tabbar/idcard.png',
        // active: '/images/tabbar/idcard-green.png'
      },
      {
        pagePath: "/pages/subscribe/subscribe",
        text: "豆瓣开车",
      },
    ]
  },
  methods: {
    onChange(e) {
      this.setData({ active: e.detail });
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
