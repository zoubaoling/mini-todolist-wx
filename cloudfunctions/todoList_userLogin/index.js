// cloudfunctions/userLogin/index.js
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 动态获取当前环境ID
})
const USERS_COLLECTION = 'todoList_users'
const db = cloud.database()
const getWXContext = () => {
  return cloud.getWXContext()
}
const getUserInfo = async (openid) => {
  return await db.collection(USERS_COLLECTION)
    .get()
}
const updateUserInfo = async (id, data) => {
  return await db.collection(USERS_COLLECTION)
    .doc(id)
    .update({
      data
    })
}
const createUserInfo = async ({ avatarUrl, nickName }) => {
const { OPENID, APPID } = getWXContext()
  const newUser = {
    id: `${USERS_COLLECTION}_${Date.now()}`,
    createTime: new Date(),
    updateTime: new Date(),
    isActive: true,
    openid: OPENID,
    appid: APPID,
    avatarUrl,
    nickName
  }
  const { _id } = await db.collection('todoList_users').add({
    data: newUser
  })
  return {
    _id,
    ...newUser
  }
}
exports.main = async (event, context) => {
  console.log('event:', event)
  console.log('context:', context)
  try {
    const { userInfo, loginCode } = event
    if (!loginCode) {
      return {
        success: false,
        message: '缺少登陆凭证',
      }
    }
    let isNewUser = false
    let result
    const { OPENID } = cloud.getWXContext()
    const { data: users } = await getUserInfo(OPENID)
    if (users.length) {
      // 用户已经存在，更新最后登陆时间
      updateUserInfo(users[0].id, {
        updateTime: new Date(),
      })
      result = {
        ...users[0],
        updateTime: new Date(),
        isActive: true
      }
    } else {
      // 用户不存在，需要创建用户并插入, 会返回_id
      result = await createUserInfo(userInfo)
      isNewUser = true
    }
    console.log('users:', result)
    return {
      success: true,
      data: {
        userInfo: result,
        isNewUser
      },
      message: '登录成功'
    }
  } catch (error) {
    return {
      success: false,
      message: '登录失败',
      error
    }
  }
    
}