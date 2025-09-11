import { nextTick } from '../../utils/util'
Page({
  async onLogin() {
    this.showToast('登陆中...', 'loading')
    // 1. 获取用户信息授权
    const { userInfo } = await this.getUserProfile() as { userInfo: object }
    // 2. 获取微信登录凭证
    const { code: loginCode } = await this.getLoginCode() as { code: string }
    // 3. 调用云函数处理了登陆
    const loginRes = await this.callLoginCloudFunction(userInfo, loginCode)
    // 4. 处理用户数据
    this.saveUserData(loginRes.data)
    this.showToast('登陆成功', 'success')
    console.log('切换到首页')

    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  saveUserData({ userInfo, isNewUser }) {
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('isNewUser', isNewUser)
  },
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '获取用户信息',
        success: resolve,
        fail: reject
      })
    })
  },
  getLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject
      })
    })
  },
  callLoginCloudFunction (userInfo: any, loginCode: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await wx.cloud.callFunction({
          name: 'todoList_userLogin',
          data: {
            userInfo: userInfo,
            loginCode: loginCode
          }
        })
        resolve(result.result)
      } catch (error) {
        reject(error)
      }
    })
  },
  showToast(message: string, theme: string) {
    const toast = this.selectComponent('#t-toast')
    if (toast) {
      toast.show({
        message: message,
        theme: theme || 'success'
      })
    } else {
      wx.showToast({
        title: message,
        icon: theme === 'error' ? 'none' : 'success'
      })
    }
  }
})