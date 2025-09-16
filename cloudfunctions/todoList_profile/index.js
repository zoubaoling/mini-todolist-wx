// cloudfunctions/todoList_profile/index.js
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 动态获取当前环境ID
})

const db = cloud.database()

// 导入处理方法
const { backupUserData } = require('./handlers/backupUserData')
const { syncUserData } = require('./handlers/syncUserData')
const { getBackupHistory } = require('./handlers/getBackupHistory')

// 使用 Map 管理 action 和方法对应关系
const actionHandlers = new Map([
  ['backupUserData', backupUserData],
  ['syncUserData', syncUserData],
  ['getBackupHistory', getBackupHistory],
])

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('云函数调用开始:', { event, context })
    
    const { action, data } = event

    // 获取微信上下文
    const { OPENID } = cloud.getWXContext()
    console.log('获取到的OPENID:', OPENID)

    if (!OPENID) {
      console.log('用户未登录')
      return {
        success: false,
        message: '用户未登录'
      }
    }

    // 根据 action 获取对应的处理方法
    const handler = actionHandlers.get(action)
    if (!handler) {
      console.log('未知的操作类型:', action)
      return {
        success: false,
        message: '未知的操作类型'
      }
    }

    console.log('开始执行处理器:', action)

    // 执行对应的处理方法
    let result
    if (action === 'updateUserInfo') {
      result = await handler(cloud, db, OPENID, data)
    } else {
      result = await handler(cloud, db, OPENID)
    }

    console.log('处理器执行成功:', action, result)

    return {
      success: true,
      data: result,
      message: '操作成功'
    }
  } catch (error) {
    console.error('云函数执行失败:', error)
    console.error('错误堆栈:', error.stack)
    return {
      success: false,
      message: '操作失败',
      error: error.message
    }
  }
}