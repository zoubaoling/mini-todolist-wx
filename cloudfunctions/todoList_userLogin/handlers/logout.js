const { USERS_COLLECTION } = require('../utils/constants')

// 用户登出
const logout = async (cloud, db) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const { stats } = await db.collection(USERS_COLLECTION)
      .where({
        openid: OPENID
      })
      .update({
        data: {
          isActive: false,
          lastActiveTime: db.serverDate()
        }
      })
    if (stats.updated === 0) {
      throw new Error('用户不存在')
    }
    return {
      message: '登出成功'
    }
  } catch (error) {
    console.error('用户登出失败:', error)
    throw error
  }
}

module.exports = { logout }