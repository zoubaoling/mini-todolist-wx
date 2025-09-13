// 删除任务
const deleteTask = async (cloud, db, params) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) {
    throw new Error('用户未登录')
  }
  if (!params.id) {
    throw new Error('任务ID不能为空')
  }
  const taskQuery = await db.collection('todoList_tasks')
    .doc(params.id).get()
  if (!taskQuery.data) {
    throw new Error('任务不存在')
  }
  const task = taskQuery.data
  if (task.author.openid !== OPENID) {
    throw new Error('无权限删除任务')
  }
  const result =await db.collection('todoList_tasks').doc(params.id).remove()
  if (result.stats.removed === 0) {
    throw new Error('删除任务失败')
  }
  console.log('deleteTask', result)
  return {
    message: '删除任务成功',
    _id: task._id,
    removedCount: result.stats.removed
  }
}

module.exports = {
  deleteTask
}