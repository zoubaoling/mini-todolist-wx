const { USERS_COLLECTION } = require('../utils/constants')

// 更新用户信息
const updateUserInfo = async (cloud, db, data) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const { userInfo, hasCheckedIsNewUser = false } = data

    if (!userInfo) {
      return {
        success: false,
        message: '缺少用户信息'
      }
    }

    let users = []
    if (!hasCheckedIsNewUser) {
      // 先查询用户是否存在
      const userQuery = await db.collection(USERS_COLLECTION)
        .where({
          openid: OPENID
        })
        .get()
      users = userQuery.data
      
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

    // 获取更新后的用户信息
    const { data: updatedUsers } = await db.collection(USERS_COLLECTION)
      .where({
        openid: OPENID
      })
      .get()

    return {
      success: true,
      message: '用户信息更新成功',
      userInfo: updatedUsers[0]
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
