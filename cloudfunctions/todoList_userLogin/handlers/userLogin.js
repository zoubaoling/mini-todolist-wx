const { USERS_COLLECTION } = require('../utils/constants')
const { createUser } = require('./createUser')

// 用户登录处理
const userLogin = async (cloud, db, data) => {
  try {
    const { userInfo, loginCode } = data
    
    if (!loginCode) {
      return {
        success: false,
        message: '缺少登陆凭证'
      }
    }

    const { OPENID, APPID } = cloud.getWXContext()
    if (!OPENID) {
      return {
        success: false,
        message: '缺少OPENID'
      }
    }
    
    const { userInfo: resUserInfo, isNewUser } = await createUser(cloud, db, { userInfo})
    return {
      userInfo: resUserInfo,
      isNewUser
    }
  } catch (error) {
    console.error('用户登录失败:', error)
    return {
      success: false,
      message: '登录失败',
      error: error.message
    }
  }
}

module.exports = {
  userLogin
}
