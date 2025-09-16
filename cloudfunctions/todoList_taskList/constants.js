// 数据库集合名称常量
const USERS_COLLECTION = 'todoList_users'
const TASKS_COLLECTION = 'todoList_tasks'
const BACKUP_COLLECTION = 'todoList_backups'

// 任务状态常量
const STATUS_TYPE = {
  DOING: 'DOING',
  COMPLETED: 'COMPLETED',
  TOTAL: 'TOTAL'
}

// 任务分类常量
const CATEGORY_TYPE = {
  WORK: 'WORK',
  LIFE: 'LIFE',
  LEARN: 'LEARN',
  HEALTH: 'HEALTH',
  ENTERTAINMENT: 'ENTERTAINMENT',
  SHOPPING: 'SHOPPING'
}

module.exports = {
  USERS_COLLECTION,
  TASKS_COLLECTION,
  BACKUP_COLLECTION,
  STATUS_TYPE,
  CATEGORY_TYPE
}