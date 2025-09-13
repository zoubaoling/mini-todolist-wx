const getTaskCategoryCompletion = async (cloud, db, { dateType = 'ALL' }) => {
  try {
    const { OPENID } = cloud.getWXContext()
    if (!OPENID) {
      throw new Error('用户未登录')
    }
  } catch (error) {
    throw new Error(`数据库操作失败 ${error.message}`)
  }
}

module.exports = {
  getTaskCategoryCompletion
}