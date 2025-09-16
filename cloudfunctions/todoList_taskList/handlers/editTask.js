const editTask = async (cloud, db, params) => {
  try {
    const { _id, ...restParams } = params
    const { OPENID } = cloud.getWXContext()
    if (!OPENID) {
      throw new Error('用户未登录')
    }
    if (!_id) {
      throw new Error('任务ID不能为空')
    }
    const taskQuery = await db.collection('todoList_tasks').doc(_id).get()
    if (!taskQuery.data) {
      throw new Error('任务不存在')
    }
    const task = taskQuery.data
    if (task.author.openid !== OPENID) {
      throw new Error('无权限编辑任务')
    }
    const result = await db.collection('todoList_tasks').doc(_id).update({
      data: {
        ...restParams,
        updatedTime: db.serverDate()
      }
    })
    if (result.stats.updated === 0) {
      throw new Error('编辑任务失败')
    }
    return {
      message: '编辑任务成功',
      _id
    }
  } catch (error) {
    throw new Error(`数据库操作失败 ${error.message}`)
  }
}

module.exports = {
  editTask
}