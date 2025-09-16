const getTaskDetail = async (cloud, db, params) => {
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
    throw new Error('无权限查看任务')
  }
  return task
}

module.exports = {
  getTaskDetail
}