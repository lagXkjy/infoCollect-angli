const $common = require('../../common/common.js')
const wxParse = require('../../libs/wxParse/wxParse.js')
Page({
  data: {},
  getCollection() { //获取条款
    $common.api.request($common.config.GetCollection, { type: 3 })
      .then((res) => {
        if (res.data.res) {
          let html = res.data.Data
          setTimeout(() => {
            wxParse.wxParse('article', 'html', html, this, 5)
          }, 300)
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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