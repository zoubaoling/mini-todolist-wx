// cloudfunctions/todoList_userLogin/index.js
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 动态获取当前环境ID
})

const db = cloud.database()

// 导入处理方法
const { userLogin } = require('./handlers/userLogin')
const { getUserInfo } = require('./handlers/getUserInfo')
const { updateUserInfo } = require('./handlers/updateUserInfo')
const { createUser } = require('./handlers/createUser')
const { logout } = require('./handlers/logout')
// 使用 Map 管理 action 和方法对应关系
const actionHandlers = new Map([
  ['userLogin', userLogin],
  ['getUserInfo', getUserInfo],
  ['updateUserInfo', updateUserInfo],
  ['createUser', createUser],
  ['logout', logout]
])

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { action, data } = event
    // 根据 action 获取对应的处理方法
    const handler = actionHandlers.get(action)
    if (!handler) {
      return {
        success: false,
        message: '未知的操作类型'
      }
    }

    // 执行对应的处理方法
    const result = await handler(cloud, db, data)
    return result
  } catch (error) {
    return {
      success: false,
      message: '操作失败',
      error: error.message
    }
  }
}