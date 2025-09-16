const { BACKUP_COLLECTION } = require('../utils/constants')

// 获取备份历史记录
const getBackupHistory = async (cloud, db, openid) => {
  try {
    // 获取用户的备份历史记录
    const { data: backups } = await db.collection(BACKUP_COLLECTION)
      .where({
        openid: openid
      })
      .orderBy('backupTime', 'desc')
      .limit(20) // 限制返回最近20条记录
      .get()

    // 格式化备份记录
    const formattedBackups = backups.map(backup => ({
      backupId: backup.backupId,
      backupTime: backup.backupTime,
      totalTasks: backup.totalTasks,
      status: backup.status,
      userInfo: backup.userInfo,
      error: backup.error
    }))

    return {
      backups: formattedBackups,
      total: backups.length
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getBackupHistory
}
