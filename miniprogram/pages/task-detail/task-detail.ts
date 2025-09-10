import { TaskItem } from '../../types/index'
import { TASK_MAPS} from '../../constants/index'
Page({
  data: {
    taskDetail: {
      id: 1,
      text: '完成项目报告',
      desc: '需要完成Q4季度项目总结报告，包括项目进度、成果展示、问题分析和下季度规划等内容。报告需要在下周一前提交给上级领导。',
      category: 'WORK',
      createTime: '2024-01-15 09:30',
      isReminder: true,
      priority: 'HIGH',
      status: 'DOING',
      date: '2024-01-15'
    } as TaskItem & { priorityLabel: string, categoryLabel: string, statusLabel: string, className: object }
  },
  onLoad (options: any) {
    this.initTaskDetail(options.id)
  },
  handleBack () {
    wx.navigateBack()
  },
  initTaskDetail (id: string) {
    const list = this.data.taskDetail
    const { priority, category, status, ...properties } = list
    console.log(list)
    this.setData({
      taskDetail: {
        ...properties,
        priorityLabel: `${TASK_MAPS.priority[priority]}优先级`,
        categoryLabel: `${TASK_MAPS.category[category]}`,
        statusLabel: `${TASK_MAPS.status[status]}`,
        className: {
          priority: `priority-${priority.toLowerCase()}`,
          status: `status-${status.toLowerCase()}`
        }
      }
    })
    // this.setData({})
  }
})