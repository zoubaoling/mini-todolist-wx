import { showModal, showToast, getDefaultUserStats, getDefaultUserInfo, isUserLoggedIn, extractUserInfoFromStorage, formatToPercentage } from '../../utils/util'
import { getUserInfo, getTaskOverview, backupUserData, syncUserData, getBackupHistory, logout } from '../../server/index'
import { UserInfo, TaskOverview } from '../../types/index'
import { PROFILE_MENU_CONFIG } from '../../constants/index'

Page({
  data: {
    userInfo: getDefaultUserInfo() as UserInfo,
    userStats: getDefaultUserStats() as TaskOverview,
    showLoginModal: false,
    isLoggedIn: false,
    menuConfig: PROFILE_MENU_CONFIG,
  },


  async onLoad() {
    await this.initUserData()
    this.loadUserStats()
  },

  async onShow() {
    // 只在用户信息为空时才重新初始化
    if (!this.data.isLoggedIn) {
      await this.initUserData()
      this.loadUserStats()
    }
  },

  // 初始化用户数据 - 统一的用户数据获取方法
  async initUserData() {
    try {
      // 1. 先尝试从本地存储获取
      const localData = wx.getStorageSync('userInfo')
      // 处理本地存储的数据结构
      const localUserInfo = extractUserInfoFromStorage(localData)
      
      if (isUserLoggedIn(localUserInfo)) {
        // 本地有数据，直接使用
        this.setUserData(localUserInfo)
      }
      // 2. 本地无数据，从云端获取
      this.loadUserData()
    } catch (error) {
      this.setUserData(null)
    }
  },

  // 设置用户数据 - 统一的数据设置方法
  setUserData(userData: any) {
    if (isUserLoggedIn(userData)) {
      this.setData({
        userInfo: userData,
        isLoggedIn: true,
        showLoginModal: false
      })
    } else {
      this.setData({
        userInfo: getDefaultUserInfo(),
        isLoggedIn: false,
        showLoginModal: true
      })
    }
  },

  // 刷新用户数据 - 从云端获取最新数据
  async loadUserData() {
    try {
      const res = await getUserInfo({ loading: false })
      if (res.success && res.data) {
        // 保存到本地存储，保持与登录时一致的数据结构
        wx.setStorageSync('userInfo', res.data)
        wx.setStorageSync('isNewUser', false)
        this.setUserData(res.data)
      } else {
        this.setUserData(null)
      }
    } catch (error) {
    }
  },

  // 加载用户统计
  async loadUserStats() {
    try {
      const res = await getTaskOverview()
      if (res.success && res.data) {
        const statsData = res.data
        this.setData({
          userStats: {
            ...statsData,
            completionRateStr: formatToPercentage(statsData.completionRate)
          }
        })
      } else {
        // 设置默认统计数据
        this.setData({
          userStats: getDefaultUserStats()
        })
      }
    } catch (error) {
      // 设置默认统计数据
      this.setData({
        userStats: getDefaultUserStats()
      })
    }
  },

  // 跳转到统计页面
  navigateToStats() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }
    wx.switchTab({
      url: '/pages/stats/stats'
    })
  },

  // 数据备份
  async handleDataBackup() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }

    // 显示备份选项
    const action = await showModal({
      title: '数据备份',
      content: '选择备份方式：\n1. 云端备份 - 将数据保存到云端\n2. 本地下载 - 下载备份文件到本地',
      confirmText: '云端备份',
      cancelText: '本地下载'
    }) as any

    try {
      if (action.confirm) {
        // 云端备份
        await this.performCloudBackup()
      } else {
        // 本地下载
        await this.performLocalBackup()
      }
    } catch (error) {
      console.error('备份失败:', error)
      showToast({
        title: '备份失败',
        icon: 'error'
      })
    }
  },

  // 云端备份
  async performCloudBackup() {
    wx.showLoading({ title: '备份中...' })
    
    try {
      console.log('开始云端备份...')
      const res = await backupUserData()
      console.log('云端备份结果:', res)
      
      if (res.success) {
        wx.hideLoading()
        showToast({
          title: '云端备份成功',
          icon: 'success'
        })
        
        // 更新用户最后备份时间
        this.updateLastBackupTime()
      } else {
        wx.hideLoading()
        console.error('云端备份失败:', res)
        showToast({
          title: res.message || '云端备份失败',
          icon: 'error'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('云端备份异常:', error)
      showToast({
        title: '云端备份失败',
        icon: 'error'
      })
    }
  },

  // 本地备份下载
  async performLocalBackup() {
    wx.showLoading({ title: '准备备份文件...' })
    
    try {
      console.log('开始本地备份...')
      
      // 获取用户数据
      const userInfo = this.data.userInfo
      const userStats = this.data.userStats
      
      // 获取本地任务数据
      const localTasks = wx.getStorageSync('taskList') || []
      
      console.log('备份数据:', { userInfo, userStats, taskCount: localTasks.length })
      
      // 构建备份数据
      const backupData = {
        userInfo,
        userStats,
        tasks: localTasks,
        backupTime: new Date().toISOString(),
        version: '1.0',
        totalTasks: localTasks.length
      }
      
      // 生成备份文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `todo-backup-${timestamp}.json`
      
      // 将数据转换为 JSON 字符串
      const jsonData = JSON.stringify(backupData, null, 2)
      
      // 创建临时文件
      const fs = wx.getFileSystemManager()
      const tempFilePath = `${wx.env.USER_DATA_PATH}/${fileName}`
      
      console.log('写入文件:', tempFilePath)
      fs.writeFileSync(tempFilePath, jsonData, 'utf8')
      
      wx.hideLoading()
      
      // 尝试保存文件到相册
      wx.saveFileToDisk({
        filePath: tempFilePath,
        success: (res) => {
          console.log('文件保存成功:', res)
          showToast({
            title: '备份文件已保存',
            icon: 'success'
          })
        },
        fail: (error) => {
          console.error('文件保存失败:', error)
          // 如果保存到相册失败，显示提示
          showToast({
            title: '请手动保存文件',
            icon: 'none'
          })
        }
      })
      
    } catch (error) {
      wx.hideLoading()
      console.error('本地备份失败:', error)
      showToast({
        title: '本地备份失败',
        icon: 'error'
      })
    }
  },

  // 更新最后备份时间
  updateLastBackupTime() {
    const userInfo = {
      ...this.data.userInfo,
      lastBackupTime: new Date().toISOString()
    }
    this.setData({ userInfo })
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo)
  },

  // 查看备份历史
  async handleViewBackupHistory() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }

    wx.showLoading({ title: '加载中...' })

    try {
      const res = await getBackupHistory()
      
      if (res.success && res.data) {
        const { backups } = res.data
        
        if (backups.length === 0) {
          wx.hideLoading()
          showToast({
            title: '暂无备份记录',
            icon: 'none'
          })
          return
        }

        // 显示备份历史
        this.showBackupHistory(backups)
      } else {
        wx.hideLoading()
        showToast({
          title: '获取备份历史失败',
          icon: 'error'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('获取备份历史失败:', error)
      showToast({
        title: '获取备份历史失败',
        icon: 'error'
      })
    }
  },

  // 显示备份历史
  showBackupHistory(backups: any[]) {
    const historyText = backups.map((backup, index) => {
      const time = new Date(backup.backupTime).toLocaleString()
      const status = backup.status === 'success' ? '✅' : '❌'
      return `${index + 1}. ${time} ${status} (${backup.totalTasks}个任务)`
    }).join('\n')

    showModal({
      title: '备份历史记录',
      content: historyText,
      confirmText: '确定'
    })
  },

  // 数据同步
  async handleDataSync() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }

    // 显示同步选项
    const action = await showModal({
      title: '数据同步',
      content: '选择同步方式：\n1. 从云端同步 - 下载云端最新数据\n2. 上传到云端 - 上传本地数据到云端\n3. 双向同步 - 智能合并本地和云端数据',
      confirmText: '从云端同步',
      cancelText: '双向同步'
    }) as any

    try {
      if (action.confirm) {
        // 从云端同步
        await this.performCloudSync()
      } else {
        // 双向同步
        await this.performBidirectionalSync()
      }
    } catch (error) {
      console.error('同步失败:', error)
      showToast({
        title: '同步失败',
        icon: 'error'
      })
    }
  },

  // 从云端同步
  async performCloudSync() {
    wx.showLoading({ title: '同步中...' })
    
    try {
      console.log('开始云端同步...')
      const res = await syncUserData()
      console.log('云端同步结果:', res)
      
      if (res.success) {
        // 保存云端数据到本地
        const { userInfo, tasks } = res.data
        
        // 更新本地用户信息
        if (userInfo) {
          this.setData({ userInfo })
          wx.setStorageSync('userInfo', userInfo)
        }
        
        // 更新本地任务数据
        if (tasks && tasks.length > 0) {
          wx.setStorageSync('taskList', tasks)
        }
        
        wx.hideLoading()
        showToast({
          title: '云端同步成功',
          icon: 'success'
        })
        
        // 重新加载用户统计
        this.loadUserStats()
      } else {
        wx.hideLoading()
        console.error('云端同步失败:', res)
        showToast({
          title: res.message || '云端同步失败',
          icon: 'error'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('云端同步异常:', error)
      showToast({
        title: '云端同步失败',
        icon: 'error'
      })
    }
  },

  // 双向同步
  async performBidirectionalSync() {
    wx.showLoading({ title: '智能同步中...' })
    
    try {
      // 获取本地数据
      const localUserInfo = this.data.userInfo
      const localTasks = wx.getStorageSync('taskList') || []
      
      // 获取云端数据
      const cloudRes = await syncUserData()
      
      if (!cloudRes.success) {
        wx.hideLoading()
        showToast({
          title: '获取云端数据失败',
          icon: 'error'
        })
        return
      }
      
      const { userInfo: cloudUserInfo, tasks: cloudTasks } = cloudRes.data
      
      // 智能合并用户信息
      const mergedUserInfo = this.mergeUserInfo(localUserInfo, cloudUserInfo)
      
      // 智能合并任务数据
      const mergedTasks = this.mergeTasks(localTasks, cloudTasks || [])
      
      // 保存合并后的数据
      this.setData({ userInfo: mergedUserInfo })
      wx.setStorageSync('userInfo', mergedUserInfo)
      wx.setStorageSync('taskList', mergedTasks)
      
      wx.hideLoading()
      showToast({
        title: '双向同步成功',
        icon: 'success'
      })
      
      // 重新加载用户统计
      this.loadUserStats()
      
    } catch (error) {
      wx.hideLoading()
      console.error('双向同步失败:', error)
      showToast({
        title: '双向同步失败',
        icon: 'error'
      })
    }
  },

  // 合并用户信息
  mergeUserInfo(local: any, cloud: any) {
    if (!cloud) return local
    if (!local) return cloud
    
    // 优先使用最新的数据
    const localTime = new Date(local.lastSyncTime || local.createTime || 0)
    const cloudTime = new Date(cloud.lastSyncTime || cloud.createTime || 0)
    
    if (cloudTime > localTime) {
      return {
        ...local,
        ...cloud,
        lastSyncTime: new Date().toISOString()
      }
    }
    
    return {
      ...cloud,
      ...local,
      lastSyncTime: new Date().toISOString()
    }
  },

  // 合并任务数据
  mergeTasks(localTasks: any[], cloudTasks: any[]) {
    const taskMap = new Map()
    
    // 添加本地任务
    localTasks.forEach(task => {
      if (task._id) {
        taskMap.set(task._id, { ...task, source: 'local' })
      }
    })
    
    // 合并云端任务
    cloudTasks.forEach(task => {
      if (task._id) {
        const existingTask = taskMap.get(task._id)
        if (existingTask) {
          // 存在冲突，选择最新的
          const localTime = new Date(existingTask.updateTime || existingTask.createTime || 0)
          const cloudTime = new Date(task.updateTime || task.createTime || 0)
          
          if (cloudTime > localTime) {
            taskMap.set(task._id, { ...task, source: 'cloud' })
          } else {
            taskMap.set(task._id, { ...existingTask, source: 'local' })
          }
        } else {
          // 云端独有的任务
          taskMap.set(task._id, { ...task, source: 'cloud' })
        }
      }
    })
    
    return Array.from(taskMap.values()).map(task => {
      // 移除 source 字段
      const { source, ...cleanTask } = task
      return cleanTask
    })
  },

  // 提醒设置
  handleNotificationSettings() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }
    
    showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 主题设置
  handleThemeSettings() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }
    showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 隐私设置
  handlePrivacySettings() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }
    showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 使用帮助
  handleHelp() {
    showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 意见反馈
  handleFeedback() {
    showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 关于我们
  handleAbout() {
    showModal({
      title: '关于我们',
      content: '智能待办清单 v1.0\n\n一个简洁高效的任务管理小程序，帮助您更好地管理日常任务。'
    })
  },

  // 退出登录
  async handleLogout() {
    if (!this.data.isLoggedIn) {
      this.setData({ showLoginModal: true })
      return
    }

    const confirm = await showModal({
      title: '确认退出',
      confirmText: '确定',
      content: '确定要退出登录吗？退出后需要重新登录才能查看您的数据。'
    })

    if (confirm) {
      try {
        await logout()
        // 清除本地存储
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('isNewUser')
        
        this.setData({
          userInfo: getDefaultUserInfo(),
          userStats: getDefaultUserStats(),
          isLoggedIn: false,
          showLoginModal: false
        })
        showToast({
          title: '已退出登录',
          icon: 'success'
        })
        wx.redirectTo({
          url: '/pages/login/login'
        })
      } catch (error) {
        showToast({
          title: '退出登录失败',
          icon: 'error'
        })
      }
    }
  },

  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 关闭登录弹窗
  closeLoginModal() {
    this.setData({
      showLoginModal: false
    })
  }
})