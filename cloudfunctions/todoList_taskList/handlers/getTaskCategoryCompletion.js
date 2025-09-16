const { CATEGORY_TYPE, STATUS_TYPE } = require('../constants.js')
const { getDateRange } = require('../utils/timer.js')
const getTaskCategoryCompletion = async (cloud, db, { dateType = 'ALL' }) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const _ = db.command
    if (!OPENID) {
      throw new Error('用户未登录')
    }
    const [ startDate, endDate ] = getDateRange(dateType)
    // 统计时间内几乎要完成的任务情况
    const plannedTaskRes = await db.collection('todoList_tasks').where({
      'author.openid': OPENID,
      ...((startDate && endDate) ? { deadline: _.gte(startDate).and(_.lt(endDate)) } : {}),
    }).get()
    if (plannedTaskRes.errCode) {
      throw new Error(`数据库操作失败 ${plannedTaskRes.errMsg}`)
    }
    const plannedTaskList = plannedTaskRes.data
    const plannedTaskStats = plannedTaskList.reduce((pre, cur) => {
      if(!pre[cur.category]) {
        pre[cur.category] = {
          total: 0,
          completed: 0,
          completionRate: 0
        }
      }
      pre[cur.category].total += 1
      if (cur.status === STATUS_TYPE.COMPLETED) {
        pre[cur.category].completed += 1
      }
      return pre
    }, {})
    // 计算完成率
    const allCategories = Object.values(CATEGORY_TYPE)
    const categoryCompletionList = allCategories.map(category => {
      const { total, completed } = plannedTaskStats[category] || { total: 0, completed: 0 }
      return {
        category,
        total,
        completed,
        completionRate: total > 0 ?
          Math.round((completed / total) * 100) / 100 : 0
      }
    })

    console.log('completedTaskList', plannedTaskStats, categoryCompletionList)
    return categoryCompletionList
  } catch (error) {
    throw new Error(`数据库操作失败 ${error.message}`)
  }
}

module.exports = {
  getTaskCategoryCompletion
}