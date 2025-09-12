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
  text: string,
  desc?: string,
  category: keyof typeof TaskCategory,
  isReminder: boolean,
  deadline?: string,
  date: string
  priority: keyof typeof TaskPriority
  status: keyof typeof TaskStatus,
}
export interface TaskListParams {
  userId: string,
  category?: keyof typeof TaskCategory,
  search?: string,
  pageSize?: number,
  pageNum?: number,
  sortOrder?: 'asc' | 'desc',
}
export type DateType = 'DAY' | 'WEEK' | 'MONTH' | 'ALL'
export interface TaskOverview {
  total: number,
  completed: number,
  doing: number,
  completionRate: number,
  continuousDays?: number,
}
export interface TaskCategoryCompletion {
  category: keyof typeof TaskCategory,
  completionRate: number,
  total?: number,
  completed?: number
}
export interface ApiResponse<T> {
  success: boolean,
  data?: T,
  message?: string
}