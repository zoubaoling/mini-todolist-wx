import { TaskItem } from '../../types/index'
import { TASK_MAPS} from '../../constants/index'
import * as serverApi from '../../server/index'
import TimeUtils from '../../utils/timer'
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
      deadlineFormat: '2024-01-15 09:30',
      createTimeFormat: '2024-01-15 09:30'
    } as TaskItem & { priorityLabel: string, categoryLabel: string, statusLabel: string, className: object }
  },
  onLoad (options: any) {
    this.initTaskDetail(options.id)
  },
  handleBack () {
    wx.navigateBack()
  },
  async initTaskDetail (id: string) {
    // const res = await serverApi.getTaskDetail(id)
    // if (res.success && res.data) {
    if (true) {
      const { priority, category, status, ...properties } = this.data.taskDetail
      // const { createTime, deadline, ...properties}= res.data
      this.setData({
        taskDetail: {
          ...properties,
          priorityLabel: `${TASK_MAPS.priority[priority]}优先级`,
          categoryLabel: `${TASK_MAPS.category[category]}`,
          statusLabel: `${TASK_MAPS.status[status]}`,
          className: {
            priority: `priority-${priority.toLowerCase()}`,
            status: `status-${status.toLowerCase()}`
          },
          deadlineFormat: '2024-01-15 09:30',
          createTimeFormat: '2024-01-15 09:30'
          // deadlineFormat: TimeUtils.format(deadline, 'YYYY-MM-DD HH:mm'),
          // createTimeFormat: TimeUtils.format(createTime, 'YYYY-MM-DD HH:mm')
        }
      })
    // this.setData({}
    }
  },
  // 完成任务
  async handleCompleteTask () {
    await serverApi.updateTaskStatus(this.data.taskDetail.id, 'COMPLETED')
    wx.navigateBack()
  },
  // 编辑任务
  handleEditTask () {
    console.log('edit')
    wx.navigateTo({
      url: `/pages/add-task/add-task?id=${this.data.taskDetail.id}`
    })
  },
  // 删除任务
  async handleDeleteTask () {
    await serverApi.deleteTask(this.data.taskDetail.id)
    wx.navigateBack()
  }
})