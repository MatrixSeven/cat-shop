const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const requestSync = (_url, _data, _method, _callcomplete) => {
    let pro = new Promise(function(resolve, reject) {
        wx.request({
            url: _url,
            data: _data,
            method: _method,
            success: function(res) {
                if (res.statusCode == 200) {
                    console.log(`wx.request() is success : 200 ok`);
                    resolve(res.data); //任务成功就执行resolve(),其他情况下都执行reject()
                } else {
                    console.log("wx.request() is success : 200 lost.");
                    reject(res.data);
                }
            },
            fail: function(res) {
                console.log("wx.request() is fail : " + res.errMsg);
                reject(res);
            },
            complete: function(res) {
                console.log("wx.request() is complete .");
                if (_callcomplete) { _callcomplete(res); }
            }
        })

    });
    return pro;
}

module.exports = {
    formatTime: formatTime,
    requestSync: requestSync
}