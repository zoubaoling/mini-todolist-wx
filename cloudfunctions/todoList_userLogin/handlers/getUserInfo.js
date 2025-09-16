const { USERS_COLLECTION } = require('../utils/constants')

// 获取用户信息
const getUserInfo = async (cloud, db) => {
  try {
    const { OPENID } = cloud.getWXContext()
    
    const { data: users } = await db.collection(USERS_COLLECTION)
      .where({
        openid: OPENID
      })
      .get()

    if (users.length === 0) {
      return {
        userInfo: null,
        message: '用户不存在'
      }
    }
    return users[0]
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '获取用户信息失败',
      error: error.message
    }
  }
}

module.exports = {
  getUserInfo
}
