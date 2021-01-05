import {formatTime, requestSync} from '../../utils/util'

Page({
    data: {
        value: ""
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return formatTime(new Date(log))
            })
        })
    },
    loadMore: function () {

    }
})
