const api = require('./api.js')
const config = require('./config.js')
module.exports = {
    api,
    config,
    getOpenId(isRegister = false) { //获取openId
        if (isRegister || !wx.getStorageSync('openId')) {
            return new Promise((resolve, reject) => wx.login({ success: resolve }))
                .then((res) => new Promise((resolve, reject) => {
                    const code = res.code
                    code && api.request(config.GetSaveEngineerOpenId, { code })
                        .then((res) => {
                            if (res.data.res) {
                                let data = res.data;
                                wx.setStorageSync('openId', data.openid)
                                wx.setStorageSync('userId', data.UserID)
                                /**
                                 * 因获取手机号session_key过期问题，解决方案
                                 * 存储两个session_key后台会循环验证
                                 * session_key必须有值，New_session_key可有可无
                                 */
                                let session_key = wx.getStorageSync('session_key')
                                let New_session_key = wx.getStorageSync('New_session_key')
                                let data_session_key = data.session_key
                                wx.setStorageSync('session_key', session_key ? New_session_key === data_session_key ? session_key : New_session_key || session_key : data_session_key)
                                wx.setStorageSync('New_session_key', data_session_key)
                                resolve(res)
                            } else reject(res)
                        })
                        .catch((res) => reject(res))
                }))
        } else return new Promise((resolve, reject) => resolve())
    },
    checkSession() { //查看登录状态是否过期
        return new Promise((resolve, reject) => wx.checkSession({ success: resolve, fail: reject }))
            .then((res) => new Promise((resolve, reject) => resolve()))
            .catch((res) => this.getOpenId(true))
    },
    loading(title = '请求中...') {
        wx.showLoading({ title })
    },
    hide() {
        wx.hideLoading()
    },
}