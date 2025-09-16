const { USERS_COLLECTION, TASKS_COLLECTION } = require('../utils/constants')

// 同步用户数据
const syncUserData = async (cloud, db, openid) => {
  try {
    
    // 获取用户信息
    const { data: users } = await db.collection(USERS_COLLECTION)
      .where({
        openid: openid
      })
      .get()

    if (users.length === 0) {
      throw new Error('用户不存在')
    }

    const userInfo = users[0]

    // 获取用户任务数据
    const { data: tasks } = await db.collection(TASKS_COLLECTION)
      .where({
        'author.openid': openid
      })
      .get()

    // 更新用户最后同步时间
    await db.collection(USERS_COLLECTION)
      .where({
        openid: openid
      })
      .update({
        data: {
          lastSyncTime: db.serverDate()
        }
      })

    const syncData = {
      userInfo,
      tasks,
      syncTime: new Date(),
      totalTasks: tasks.length
    }

    return syncData
  } catch (error) {
    throw error
  }
}

module.exports = {
  syncUserData
}
