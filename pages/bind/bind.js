const $common = require('../../common/common.js')
const app = getApp()
Page({
  data: {
    type: 'city',
    banner: '',
    info: { inviteValue: -1 }, //获取到的信息
    useInfo: {}, //待提交的信息
    grade: ['托班', '小班', '中班', '大班', '1年级', '2年级', '3年级'], //年级，客户定死的
    gradeIndex: -1,
    city: [], //城市
    cityIndex: -1,
    STEM: [],
    STEMIndex: -1,
    STEMCache: {}, //昂立STEM中心缓存
    inviteCode: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 101, 102, 103, 104, 105], //邀请码,客户定死的
    inviteCodeIndex: -1,
    remarks: '', //备注
  },
  // inputPhone(e) { //手机号
  //   this.data.useInfo.phone = e.detail.value
  // },
  inputName(e) { //姓名
    this.data.useInfo.name = e.detail.value
  },
  // inputAge(e) { //年龄
  //   this.data.useInfo.age = +e.detail.value
  // },
  gradeChange(e) { //年级
    this.setData({ gradeIndex: +e.detail.value })
  },
  cityChange(e) { //城市
    let currentIndex = this.data.cityIndex
    let selectIndex = +e.detail.value
    this.setData({
      cityIndex: +e.detail.value,
      STEMIndex: currentIndex === selectIndex ? this.data.STEMIndex : -1
    })
    selectIndex !== -1 && this.getSTEM()
  },
  STEMChange(e) { // STEM
    this.setData({ STEMIndex: this.data.type === 'city' ? +e.detail.value : this.data.cityIndex === -1 ? -1 : +e.detail.value })
  },
  inviteCodeChange(e) { //邀请码
    this.setData({ inviteCodeIndex: +e.detail.value })
  },
  // inputAddress(e) { //地址
  //   this.data.useInfo.address = e.detail.value
  // },
  inputRenarks(e) { //备注
    this.data.remarks = e.detail.value
  },
  getCity() { //获取城市
    return $common.api.request($common.config.GetCityList)
      .then(res => {
        if (res.data.res) {
          this.setData({
            city: res.data.Data
          })
        }
      })
  },
  getSTEM(isCity) { //根据城市获取STEM中心
    if (isCity) { //type为city，由eId代替cityId
      return $common.api.request($common.config.GetStemCoreList, { id: wx.getStorageSync('eId'), Type: this.data.type })
        .then(res => {
          if (res.data.res) {
            this.setData({ STEM: res.data.Data })
          } else {
            $common.api.codeModal()
          }
        })
        .catch(() => $common.api.codeModal())
    }
    let data = this.data
    let STEMCache = data.STEMCache
    let city = data.city
    let cityIndex = data.cityIndex
    let cityId = city[cityIndex].cityId
    if (STEMCache[cityId]) { //有缓存，走缓存
      return new Promise((resolve, reject) => {
        let STEM = STEMCache[cityId]
        this.setData({ STEM })
        resolve()
      })
    } else {
      return $common.api.request($common.config.GetStemCoreList, { id: cityId, Type: this.data.type })
        .then(res => {
          if (res.data.res) {
            let STEM = res.data.Data
            this.data.STEMCache[cityId] = STEM //做缓存
            this.setData({ STEM })
          } else {
            $common.api.codeModal()
          }
        })
        .catch(() => $common.api.codeModal())
    }
  },
  getCityAndSTEM() {  //存在用户信息，获取城市信息 
    $common.api.request($common.config.GetUserInfo, { UserID: wx.getStorageSync('userId') })
      .then(res => {
        if (res.data.res) {
          let data = res.data.UserInfo
          let { sId, cityId } = data
          this.setData({
            info: {
              phone: data.UserTel,
              name: data.UserName,
              age: data.UserAge,
              address: data.UserAddress,
              gradeValue: data.Grade,
              inviteValue: +data.InvitationCode,
              remarksValue: data.Remarks
            }
          })
          this.getCity()
            .then(() => {
              let city = this.data.city
              let cityValue = ''
              for (let i = 0, len = city.length; i < len; i++) {
                if (city[i].cityId === cityId) {
                  this.setData({
                    'info.cityValue': city[i].CityName,
                    cityIndex: i
                  })
                  return this.getSTEM()
                }
              }
            })
            .then(() => {
              let STEM = this.data.STEM
              for (let i = 0, len = STEM.length; i < len; i++) {
                if (STEM[i].sId === sId) return this.setData({ 'info.STEMValue': STEM[i].CoreName })
              }
            })
        } else {
          $common.api.codeModal(res.data.errorType)
        }
      })
      .catch((res) => $common.api.codeModal())
  },
  getIsShowCode() { //获取  未注册用户  是否显示邀请码
    $common.api.request($common.config.GetIsShowCode, { qrId: wx.getStorageSync('eId') })
      .then(res => { //IsShowCode: false 该用户不必选择邀请码， 提交和回显的时候都为 -1
        if (res.data.res) this.setData({ 'info.inviteValue': res.data.IsShowCode ? 0 : -1 })
      })
    return false
  },
  getInfo() { //获取信息
    const userId = wx.getStorageSync('userId')
    this.setData({ userId })
    if (userId <= 0) { //当前用户不存在
      this.data.type !== 'city' ? this.getCity() : this.getIsShowCode() || this.getSTEM(true) //type为city，由eId代替cityId
      let phone = wx.getStorageSync('phone') || ''
      let address = app.userLocation ? app.userLocation.result.address : ''
      this.setData({
        info: {
          phone,
          address
        }
      })
      this.data.useInfo.phone = phone
      this.data.useInfo.address = address
    } else {
      this.getCityAndSTEM()
    }
  },
  getCollection() { //获取图片等信息
    $common.api.request($common.config.GetCollection, { type: 2 })
      .then((res) => res.data.res && this.setData({ banner: res.data.Data }))
  },
  submitUseInfo(e) { //提交信息
    let userInfo = e.detail.userInfo
    if (!userInfo) return
    let useInfo = this.data.useInfo
    // if (!useInfo.phone || !$common.config.phoneReg.test(useInfo.phone)) return $common.api.showModal('请填写正确的手机号码！')
    if (!useInfo.name || useInfo.name.trim().length <= 0) return $common.api.showModal('请填写姓名！')
    let self = this.data
    let { type } = this.data
    if (self.gradeIndex === -1) return $common.api.showModal('请选择年级！')
    if (self.cityIndex === -1 && type === 'user') return $common.api.showModal('请选择城市！')
    if (self.STEMIndex === -1) return $common.api.showModal('请选择STEM中心！')
    if (self.info.inviteValue !== -1 && self.inviteCodeIndex === -1) return $common.api.showModal('请选择邀请码！')
    let cityId = type === 'city' ? self.STEM[self.STEMIndex].cityId : self.city[self.cityIndex].cityId
    let sId = self.STEM[self.STEMIndex].sId
    let Invitationcode = self.info.inviteValue === -1 ? -1 : '' + self.inviteCode[self.inviteCodeIndex]
    // if (!useInfo.age || useInfo.age <= 0) return $common.api.showModal('请填写年龄！')
    // if (!useInfo.address || useInfo.address.trim().length <= 0) return $common.api.showModal('请填写地址！')
    $common.api.debounce(() => {
      useInfo.openid = wx.getStorageSync('openId')
      useInfo.headImg = userInfo.avatarUrl
      useInfo.nickname = userInfo.nickName
      useInfo.eid = +wx.getStorageSync('eId')
      useInfo.name = useInfo.name.trim()
      useInfo.grade = '' + self.grade[self.gradeIndex]
      useInfo.cityId = cityId
      useInfo.stemcoreid = sId
      useInfo.Invitationcode = Invitationcode
      useInfo.Remarks = self.remarks
      $common.api.request($common.config.PostUserData, useInfo)
        .then((res) => {
          if (res.data.res) {
            wx.setStorageSync('userId', res.data.UserID)
            wx.setStorageSync('type', 'user') //添加成功，页面数据恢复到user状态
            this.setData({
              type: 'user'
            })
            this.getInfo()
          } else {
            $common.api.showModal('提交失败！')
          }
        })
        .catch((res) => {
          $common.api.codeModal()
        })
    });
  },
  init() {
    this.getCollection()
    this.getInfo()
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
    this.setData({
      type: wx.getStorageSync('type')
    })
    this.init()
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