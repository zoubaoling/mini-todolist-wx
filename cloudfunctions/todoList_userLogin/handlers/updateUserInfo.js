const { USERS_COLLECTION } = require('../utils/constants')

// 更新用户信息
const updateUserInfo = async (cloud, db, data) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const { userInfo, hasCheckedIsNewUser = false } = data

    if (!hasCheckedIsNewUser) {
      if (!userInfo) {
        return {
          success: false,
          message: '缺少用户信息'
        }
      }
      // 先查询用户是否存在
      const { data: users } = await db.collection(USERS_COLLECTION)
        .where({
          openid: OPENID
        })
        .get()
      if (users.length === 0) {
        return {
          success: false,
          message: '用户不存在'
        }
      }
    }

    // 更新用户信息
    const result = await db.collection(USERS_COLLECTION)
      .doc(users[0]._id)
      .update({
        data: {
          ...userInfo,
          updateTime: db.serverDate(),
          lastActiveTime: db.serverDate()
        }
      })

    if (result.stats.updated === 0) {
      return {
        success: false,
        message: '更新失败'
      }
    }

    return {
      success: true,
      message: '用户信息更新成功'
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      success: false,
      message: '更新用户信息失败',
      error: error.message
    }
  }
}

module.exports = {
  updateUserInfo
}
