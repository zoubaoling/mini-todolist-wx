const dayjs = require('dayjs')

// 日期工具类
class DateUtils {
  /**
   * 获取今天的开始时间
   */
  static getTodayStart() {
    return dayjs().startOf('day').toDate()
  }

  /**
   * 获取N天前的开始时间
   */
  static getDaysAgoStart(days) {
    return dayjs().subtract(days, 'day').startOf('day').toDate()
  }

  /**
   * 获取日期字符串 (YYYY-MM-DD)
   */
  static getDateString(date) {
    return dayjs(date).format('YYYY-MM-DD')
  }

  /**
   * 计算连续完成天数
   * @param {Array} tasks - 已完成的任务列表
   * @param {number} maxDays - 最大检查天数，默认30天
   * @returns {number} 连续天数
   */
  static calculateContinuousDays(tasks, maxDays = 30) {
    if (!tasks || tasks.length === 0) {
      return 0
    }

    // 按日期分组，统计每天完成的任务数
    const dailyCompleted = {}
    tasks.forEach(task => {
      if (task.completedTime) {
        const dateKey = this.getDateString(task.completedTime)
        dailyCompleted[dateKey] = (dailyCompleted[dateKey] || 0) + 1
      }
    })

    // 获取所有有完成任务的日期，按时间倒序排列
    const completedDates = Object.keys(dailyCompleted).sort((a, b) => b.localeCompare(a))
    
    if (completedDates.length === 0) {
      return 0
    }

    // 从最近的完成日期开始往前计算连续天数
    let continuousDays = 0
    let currentDate = dayjs(completedDates[0]) // 从最近的完成日期开始
    const today = dayjs()

    // 如果最近完成日期是今天或昨天，从今天开始计算
    if (currentDate.isSame(today, 'day') || currentDate.isSame(today.subtract(1, 'day'), 'day')) {
      currentDate = today
    }

    for (let i = 0; i < maxDays; i++) {
      const dateStr = currentDate.format('YYYY-MM-DD')
      
      if (dailyCompleted[dateStr] && dailyCompleted[dateStr] > 0) {
        continuousDays++
        currentDate = currentDate.subtract(1, 'day')
      } else {
        break // 遇到没有完成任务的天数就停止
      }
    }

    return continuousDays
  }
}

module.exports = DateUtils
