const { USERS_COLLECTION, TASKS_COLLECTION, BACKUP_COLLECTION } = require('../utils/constants')

// 备份用户数据
const backupUserData = async (cloud, db, openid) => {
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

    const backupTime = new Date()
    const backupData = {
      userInfo,
      tasks,
      backupTime,
      totalTasks: tasks.length,
      backupId: cloud.database().collection(BACKUP_COLLECTION).doc().id
    }

    // 保存备份记录到数据库
    await db.collection(BACKUP_COLLECTION).add({
      data: {
        openid: openid,
        backupId: backupData.backupId,
        backupTime: backupTime,
        totalTasks: tasks.length,
        userInfo: {
          nickname: userInfo.nickname,
          avatar: userInfo.avatar
        },
        status: 'success'
      }
    })

    // 更新用户最后备份时间
    await db.collection(USERS_COLLECTION)
      .where({
        openid: openid
      })
      .update({
        data: {
          lastBackupTime: backupTime
        }
      })

    return backupData
  } catch (error) {
    // 记录失败的备份
    try {
      await db.collection(BACKUP_COLLECTION).add({
        data: {
          openid: openid,
          backupTime: new Date(),
          status: 'failed',
          error: error.message
        }
      })
    } catch (logError) {
      console.error('记录备份失败日志出错:', logError)
    }
    
    throw error
  }
}

module.exports = {
  backupUserData
}
