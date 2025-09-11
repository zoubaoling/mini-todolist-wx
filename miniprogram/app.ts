// app.ts
import { cloudConfig } from './utils/config'
App({
  globalData: {},
  onLaunch() {
    this.initCloud()
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  initCloud() {
    wx.cloud.init({
      env: cloudConfig.envId,
      traceUser: true
    })
  }
})