const host = 'usercj.1-zhao.cn'
const referer = `https://${host}`
const phoneReg = /^1[34578]\d{9}$/ // 正则手机号码
module.exports = {
    phoneReg,
    //获取openId
    GetSaveEngineerOpenId: `${referer}/CollectionAPI/GetSaveEngineerOpenId`,
    //判断是否绑定
    IsBanDing: `${referer}/CollectionAPI/IsBanDing`,
    //获取手机号码
    GetUserPhone: `${referer}/CollectionAPI/GetUserPhone`,
    //获取用户信息
    GetUserInfo: `${referer}/CollectionAPI/GetUserInfo`,
    //提交用户信息
    PostUserData: `${referer}/CollectionAPI/PostUserData`,
    //获取图片条款等信息 type 1 登录页图片 2 提交页图片 3 政策信息
    GetCollection: `${referer}/CollectionAPI/GetCollection`,
    //获取Stem中心
    GetStemCoreList: `${referer}/CollectionAPI/GetStemCoreList`,
    //获取城市
    GetCityList: `${referer}/CollectionAPI/GetCityList`,
    //获取  未注册用户  是否显示邀请码
    GetIsShowCode: `${referer}/CollectionAPI/GetIsShowCode`,
}