import { TASK_MAPS} from '../../constants/index'
import * as serverApi from '../../server/index'
import TimeUtils from '../../utils/timer'
import { showModal } from '../../utils/util'
Page({
  data: {
    taskDetail: {}
  },
  onLoad (options: any) {
    this.initTaskDetail(options.id)
  },
  handleBack () {
    wx.navigateBack()
  },
  async initTaskDetail (id: string) {
    const res = await serverApi.getTaskDetail(id)
    console.log('getTaskDetail', res)
    if (res.success && res.data) {
      const { createTime, deadline, priority, category, status, ...properties }= res.data
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
          deadlineFormat: TimeUtils.format(deadline, 'YYYY-MM-DD HH:mm'),
          createTimeFormat: TimeUtils.format(createTime, 'YYYY-MM-DD HH:mm')
        }
      })
    // this.setData({}
    }
  },
  // 完成任务
  async handleCompleteTask () {
    await serverApi.updateTaskStatus(this.data.taskDetail._id, 'COMPLETED')
    wx.navigateBack()
  },
  // 编辑任务
  handleEditTask () {
    console.log('edit')
    wx.navigateTo({
      url: `/pages/add-task/add-task?id=${this.data.taskDetail._id}`
    })
  },
  // 删除任务
  async handleDeleteTask () {
    const confirm = await showModal()
    if (confirm) {
      await serverApi.deleteTask(this.data.taskDetail._id)
      // todo 删除确认弹框
      wx.showToast({  
        title: '删除任务成功',
        icon: 'success'
      })
      wx.navigateBack()
    }
  }
})