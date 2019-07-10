const mapKey = require('./qqmap.js')
module.exports = {
    request(url, data, method = 'POST') { //请求数据
        return new Promise((resolve, reject) => wx.request({ url, data, method, success: resolve, fail: reject }))
    },
    getAuthorizeLocation() { //发起授权定位
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting['scope.userLocation']) { //已经授权定位
                        resolve();
                    } else {
                        wx.authorize({
                            scope: 'scope.userLocation',
                            success: resolve,
                            fail: reject
                        })
                    }
                },
                fail: reject
            })
        })
    },
    locationAndGetAddress() { //获取位置，并且解析地址
        return new Promise((resolve, reject) => wx.getLocation({ type: 'gcj02', altitudeL: 'true', success: resolve, fail: () => { } }))
            .then((res) => {
                const latitude = res.latitude,
                    longitude = res.longitude;
                return new Promise((resolve, reject) => {
                    mapKey.reverseGeocoder({
                        location: { latitude, longitude },
                        success: (res) => res.status === 0 ? resolve(res) : reject(res),
                        fail: reject
                    })
                })
            })
    },
    timerOut: null,
    debounce(callback = () => { }, timeOut = 300) { //防抖
        clearTimeout(this.timerOut)
        this.timerOut = setTimeout(callback, timeOut)
    },
    share(title = '课程预约小助手', path = '/pages/transition/transition', imageUrl = null) { //分享
        return { title, path, imageUrl }
    },
    showModal(content = '你觉得缺点什么？', showCancel = false, confirmText = '确定', title = '提示', cancelText = '取消') {
        return new Promise((resolve, reject) => wx.showModal({ title, content, showCancel, confirmText, cancelText, success: resolve, fail: reject }))
    },
    codeModal(code) { //根据状态码显示相应内容
        let text;
        switch (+code) {
            case 0:
                text = '该用户不存在！'
                break;
            case 4:
                text = '数据错误！'
                break;
            default:
                text = '网络不佳，请稍候重试！'
                break;
        }
        return this.showModal(text);
    },
    unique(arr, id) { //数组去重
        let hash = {};
        return arr.reduce(function (item, target) {
            hash[target[id]] ? '' : hash[target[id]] = true && item.push(target)
            return item
        }, [])
    },
}