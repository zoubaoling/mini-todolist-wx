const { getDateRange } = require('../utils/timer')
// 处理任务总览数据-总任务数、已完成数、完成率、连续天数
const getTaskOverview = async (cloud, db, { dateType = 'ALL' }) => {
  const _ = db.command
  console.log('getTaskOverview')
  const { OPENID } = cloud.getWXContext()
  const query = db.collection('todoList_tasks').where({
    'author.openid': OPENID
  })
  const [startDate, endDate] = getDateRange(dateType)
  let baseCondition = { 'author.openid': OPENID }
  // _.lte 小于  _.gte 大于等于
  // 按照完成时间-实际完成的任务
  if (startDate && endDate) {
    baseCondition.completedTime = _.gte(startDate).and(_.lt(endDate))
  }
  // 1.获取检索时间内已完成的任务数
  const completedTasksResult = await query.where({
    ...baseCondition,
    status: 'COMPLETED'
  }).get()
  const completedTasks = completedTasksResult.data

  // 2. 获取检索时间内进行中的任务数
  const doingTasksResult = await query.where({
    ...baseCondition,
    status: 'DOING'
  }).get()
  const doingTasks = doingTasksResult.data

  // 3. 获取检索时间内总任务数-按照截止时间，代表计划要完成的任务
  const allTasksResult = await query.where({
    'author.openid': OPENID,
    ...(startDate && endDate
      ? { deadline: _.gte(startDate).and(_.lt(endDate)) }
      : {})
  }).get()
  const allTasks = allTasksResult.data

  console.log('startDate', startDate, endDate)


  return {
    total: allTasks.length,
    completed: completedTasks.length,
    doing: doingTasks.length,
    completionRate: completedTasks.length / allTasks.length,
    continuousDays: 0
  }
}

module.exports = {
  getTaskOverview
}