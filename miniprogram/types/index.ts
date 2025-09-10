export enum TaskStatus {
  DOING = '进行中',
  COMPLETED = '已完成',
  TOTAL = '总任务'
}

export enum TaskCategory {
  WORK = '工作',
  LIFE = '生活',
  LEARN = '学习',
  HEALTH = '健康',
  ENTERTAINMENT = '娱乐',
  SHOPPING = '购物'
}
export enum TaskPriority {
  HIGH = '高',
  MEDIUM = '中',
  LOW = '低'
}
export interface TaskItem {
  id: number,
  text: string
  category: keyof typeof TaskCategory
  date: string
  priority: keyof typeof TaskPriority
  status: keyof typeof TaskStatus,
}