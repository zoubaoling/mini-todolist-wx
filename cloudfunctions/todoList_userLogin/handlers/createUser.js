const { USERS_COLLECTION } = require('../utils/constants')
const { updateUserInfo } = require('./updateUserInfo')
const createUser = async (cloud, db, data) => {
  try {
    const { OPENID, APPID } = cloud.getWXContext()
    const { userInfo } = data
    const { data: users } = await db.collection(USERS_COLLECTION)
      .where({
        openid: OPENID
      })
      .get()
    let isNewUser = users.length === 0
    let resUser = null
    if (isNewUser) {
      const newUser = {
        id: `${USERS_COLLECTION}_${Date.now()}`,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        isActive: true,
        openid: OPENID,
        appid: APPID,
        avatarUrl: userInfo?.avatarUrl || '',
        nickName: userInfo?.nickName || '',
        lastActiveTime: db.serverDate()
      }
      const res = await db.collection(USERS_COLLECTION).add({
        data: newUser
      })
      if (res.stats.updated === 0) {
        return {
          success: false,
          message: '创建用户失败'
        }
      }
      resUser = newUser
    } else {
      await updateUserInfo(cloud, db, { userInfo, hasCheckedIsNewUser: true })  
      
      resUser = users[0]
    }
    return {
      userInfo: resUser,
      isNewUser
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    throw error
  }
}

module.exports = {
  createUser
}