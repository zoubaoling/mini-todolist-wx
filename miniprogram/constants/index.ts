import { TaskCategory, TaskPriority, TaskStatus } from '../types/index'

// 任务状态


// 任务分类标签
export const TASK_CATEGORY = {
  [TaskCategory.WORK]: {
    type: 'WORK',
    label: '工作',
    color: '#667eea',
    gradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  },
  [TaskCategory.LIFE]: {
    type: 'LIFE',
    label: '生活',
    color: '#ff6b6b',
    gradient: 'linear-gradient(90deg, #ff6b6b 0%, #ffa726 100%)'
  },
  [TaskCategory.LEARN]: {
    type: 'LEARN',
    label: '学习',
    color: '#66bb6a',
    gradient: 'linear-gradient(90deg, #66bb6a 0%, #4caf50 100%)'
  },
  [TaskCategory.HEALTH]: {
    type: 'HEALTH',
    label: '健康',
    color: '#ff9800',
    gradient: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)'
  },
  [TaskCategory.ENTERTAINMENT]: {
    type: 'ENTERTAINMENT',
    label: '娱乐',
    color: '#9c27b0',
    gradient: 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)'
  },
  [TaskCategory.SHOPPING]: {
    type: 'SHOPPING',
    label: '购物',
    color: '#e91e63',
    gradient: 'linear-gradient(90deg, #e91e63 0%, #f06292 100%)'
  }
}
// 任务优先级
export const TASK_PRIORITY = {
  [TaskPriority.HIGH]: {
    type: 'HIGH',
    label: '高',
    desc: '紧急重要',
    color: '#ff6b6b',
    backgroundColor: '#ffebee'
  },
  [TaskPriority.MEDIUM]: {
    type: 'MEDIUM',
    label: '中',
    desc: '一般重要',
    color: '#ffa726',
    backgroundColor: '#fff3e0'
  },
  [TaskPriority.LOW]: {
    type: 'LOW',
    label: '低',
    desc: '不紧急',
    color: '#66bb6a',
    backgroundColor: '#e8f5e8'
  }
}
export const TASK_MAPS = {
  priority: {
    'HIGH': TaskPriority.HIGH,
    'MEDIUM': TaskPriority.MEDIUM,
    'LOW': TaskPriority.LOW
  },
  category: {
    'WORK': TaskCategory.WORK,
    'LIFE': TaskCategory.LIFE,
    'LEARN': TaskCategory.LEARN,
    'HEALTH': TaskCategory.HEALTH,
    'ENTERTAINMENT': TaskCategory.ENTERTAINMENT,
    'SHOPPING': TaskCategory.SHOPPING
  },
  status: {
    'DOING': TaskStatus.DOING,
    'COMPLETED': TaskStatus.COMPLETED,
    'TOTAL': TaskStatus.TOTAL
  }
}
// 统计维度
export const STATS_DIMENSION = [
  {
    label: '今天',
    value: 'DAY'
  },
  {
    label: '本周',
    value: 'WEEK'
  },
  {
    label: '本月',
    value: 'MONTH'
  },
  {
    label: '全部',
    value: 'ALL'
  }
]