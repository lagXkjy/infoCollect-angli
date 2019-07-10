//app.js
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(() => {
      updateManager.applyUpdate(); //强制版本更新
    })
  },
  userLocation: null, //暂存获取到的地址
})