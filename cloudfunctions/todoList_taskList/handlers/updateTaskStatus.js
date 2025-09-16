const updateTaskStatus = async (cloud, db, params) => {
  try {
    const { id, status } = params
    const { OPENID } = cloud.getWXContext()
    if (!OPENID) {
      throw new Error('用户未登录')
    }
    if (!id) {
      throw new Error('任务ID不能为空')
    }
    if (!status) {
      throw new Error('任务状态不能为空')
    }
    const taskQeury = await db.collection('todoList_tasks').doc(id).get()
    if (!taskQeury.data) {
      throw new Error('任务不存在')
    }
    const task = taskQeury.data
    if (task.author.openid !== OPENID) {
      throw new Error('无权限更新任务状态')
    }
    const result = await db.collection('todoList_tasks').doc(id).update({
      data: {
        status,
        completedTime: status === 'COMPLETED' ? db.serverDate() : null
      }
    })
    if (result.stats.updated === 0) {
      throw new Error('更新任务状态失败')
    }
    return {
      message: '更新任务状态成功',
      _id: task._id,
      status,
      completedTime: status === 'COMPLETED' ? db.serverDate() : null
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  updateTaskStatus
}