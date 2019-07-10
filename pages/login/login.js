const $common = require('../../common/common.js')
const app = getApp()
Page({
  data: {
    bgImage: '',
    clause: true, //条款同意状态
  },
  getPhoneMumber(e) { //获取手机号
    if (!this.data.clause) return $common.api.showModal('请阅读并同意隐私条款!')
    if (e.detail.encryptedData) {
      $common.checkSession()
        .then(() => {
          let options = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            session_key: wx.getStorageSync('session_key'),
            New_session_key: wx.getStorageSync('New_session_key')
          }
          $common.api.request($common.config.GetUserPhone, options)
            .then((res) => {
              if (res.data.res) {
                wx.setStorageSync('phone', res.data.phoneNumber)
                wx.redirectTo({
                  url: '/pages/bind/bind'
                })
              } else {
                $common.api.showModal('获取手机号失败，请重试！')
              }
            })
            .catch((res) => {
              $common.api.codeModal()
            })
        })
    }
  },
  changeClause() { //条款change
    this.setData({
      clause: !this.data.clause
    })
  },
  toClause() { //跳转至隐私政策页面
    wx.navigateTo({
      url: '/pages/clause/clause'
    })
  },
  getCollection() { //获取图片等信息
    $common.api.request($common.config.GetCollection, { type: 1 })
      .then((res) => {
        if (res.data.res) {
          this.setData({
            bgImage: res.data.Data
          })
        }
      })
  },
  onLoad() {
    // $common.api.locationAndGetAddress()
    //   .then((res) => app.userLocation = res)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCollection()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    $common.getOpenId(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.api.share()
  }
})