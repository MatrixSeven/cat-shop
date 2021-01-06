import {formatTime, makeAsyncFunc, requestSync} from '../../utils/util'

Page({
    data: {
        products: [],
        refresherStatus: false,
        type: 1,
        page: 1,
        size: 10,
        value: '',
        active: 0,
        next: true,
        tabs: [
            {name: '每日猫车', type: 1},
            {name: '每日人车', type: 2},
            {name: '罐头', type: 3},
            {name: '零食', type: 4},
            {name: '猫窝', type: 5},
        ],
    },


    onLoad: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        makeAsyncFunc(async () => {
            const {type, page, size} = this.data
            const {data} = await requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`)
            this.setData({
                products: [...this.data.products, ...data],
                page: page + 1
            })
        })
    },


    onTabChange: function (e) {
        const {index, title} = e.detail
        this.setData({
            active: index,
            product: [],
            page:1,
            next:true,
            clear: true,
            type: this.data.tabs[index].type
        })
        const {size,clear=false} = this.data
        this.loadMoreAux({...this.data,
            clear:true,page:1,next:true,
            type:this.data.tabs[index].type,size})
    },
    onSearch: function (e) {
        console.log(e)

    },
    onChange: function (e) {
        this.setData({
            value: e.detail,
        });
    },
    refresher: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        this.setData({
            refresherStatus: true
        })
        const {type, size} = this.data
        const page = 1;
        requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`, {
            whenComplete: x => {
                wx.hideLoading();
                this.setData({
                    refresherStatus: false
                })
            }
        }).then(ret => {
            this.setData({
                products: ret.data,
                page: page + 1,

            })
        })
    },
    loadMore: function () {
        wx.showLoading({
            title: "优惠加载中ing"
        })
        this.loadMoreAux(this.data)

    },
    loadMoreAux: function (data) {
        const {type, page, size, next,clear=false} = data
        if (!next) {
            wx.showToast({
                title: "到底啦～",
                duration: 2000
            })
            return
        }

        makeAsyncFunc(async () => {
            let {data = []} = await requestSync(`https://cat-card.52python.cn/shop/goods/list/${type}/${page}/${size}`)
            if (data === ({})) {
                data = []
            }
            let p = data
            if (!clear) {
                p = [...this.data.products, ...data]
            }
            this.setData({
                products: p,
                clear: false,
                page: page + 1,
                next: data.length === size
            })
        })
    }
})
