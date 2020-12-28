import {formatTime, requestSync} from '../../utils/util'

Page({
    data: {
        products: [
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
            {imageURL: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1511962197,3377453560&fm=11&gp=0.jpg'},
        ]
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return formatTime(new Date(log))
            })
        })
    },
    loadMore: function () {
        wx.showLoading({
            title: "loading"
        })
        requestSync('https://cat-card.52python.cn/wai_mai/product', {}, 'GET', () => wx.hideLoading())
            .then(res => {
                console.log(res)
                this.setData({
                    products: [...this.data.products, ...res.data]
                })
            })

    }
})
