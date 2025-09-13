const { getTaskOverview } = require('./handlers/getTaskOverview')
const { createTask } = require('./handlers/createTask')
const { getTaskList } = require('./handlers/getTaskList')
const { deleteTask } = require('./handlers/deleteTask')
const { getTaskDetail } = require('./handlers/getTaskDetail')
const { updateTaskStatus } = require('./handlers/updateTaskStatus')
const { editTask } = require('./handlers/editTask')
const { getTaskCategoryCompletion } = require('./handlers/getTaskCategoryCompletion')
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

const TaskActionMap = {
  'overview': getTaskOverview,
  'add': createTask,
  'list': getTaskList,
  'delete': deleteTask,
  'detail': getTaskDetail,
  'updateStatus': updateTaskStatus,
  'edit': editTask,
  'getTaskCategoryCompletion': getTaskCategoryCompletion
}

exports.main = async (event, context) => {
  try {
    console.log('event:', event)
    const { action, data } = event
    const handler = TaskActionMap[action]
    if (!handler) {
      return {
        success: false,
        message: `Action ${action} not found`
      }
    }
    const result = await handler(cloud, db, data)
    console.log('result:', result)
    return result
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}