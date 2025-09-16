const TimeUtils = require('../utils/timer')
const { TASKS_COLLECTION } = require('../constants')

const createTask = async (cloud, db, params) => {
  try {
    const { OPENID } = cloud.getWXContext()
    const task = await db.collection(TASKS_COLLECTION)
      .add({
        data: {
          ...params,
          author: {
            openid: OPENID
          },
          createdTime: db.serverDate(), // 存储Date对象，后续方便对比
          updatedTime: db.serverDate(),
          completedTime: null,
          deadline: params.deadline ? TimeUtils.toDate(params.deadline) : null,
        }
      })
    if (task.errCode) {
      throw new Error(`数据库操作失败 ${task.errMsg}`)
    }
    return {
      _id: task._id
    }
  } catch (error) {
    throw new Error(`数据库操作失败 ${error.message}`)
  }
}

module.exports = {
  createTask
}