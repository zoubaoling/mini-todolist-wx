const { TASKS_COLLECTION } = require('../constants')

// 处理任务列表数据
const getTaskList = async (cloud, db, params) => {
  const { category, search, pageSize = 10, pageNum = 1, sortOrder = 'desc' } = params
  const { OPENID } = cloud.getWXContext()
  let query = db.collection(TASKS_COLLECTION).where({
    'author.openid': OPENID
  })
  // 根据category过滤
  if (category && category !== 'ALL') {
    query = query.where({
      category
    })
  }
  // 根据search过滤
  if (search) {
    query = query.where({
      text: db.RegExp({ //支持模糊搜索
        // text: search, // 必须完全匹配
        regexp: search, // 搜索关键字， 相当于正则表达式 /search/i
        options: 'i' // 忽略大小写
      })
    })
  }
  // 根据sortOrder排序
  if (sortOrder) {
    // asc 升序， desc 降序
    query = query.orderBy('updatedTime', sortOrder)
  }
  /**
   * 分页：
   * 1. skip()跳过指定数量的记录 - (pageNum-1)*pageSize 跳过pageNum-1页，每页pageSize条记录
   * 2. limit()限制返回的记录数量 - pageSize 每页pageSize条记录
   */
  query = query.skip((pageNum - 1) * pageSize).limit(pageSize)
  // 执行查询
  const taskList = await query.get()
  return {
    list: taskList.data
  }
}

module.exports = {
  getTaskList
}