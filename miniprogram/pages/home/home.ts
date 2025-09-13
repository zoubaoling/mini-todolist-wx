import { TASK_CATEGORY, TASK_MAPS,  } from '../../constants/index'
import { TaskStatus, TaskPriority, TaskItem } from '../../types/index'
import { debounce, formatToPercentage } from '../../utils/util'
import TimeUtils from '../../utils/timer'
import * as serverApi from '../../server/index'
Page({
  data: {
    taskCategory: TASK_CATEGORY,
    taskPriorityEnum: TaskPriority,
    overviewData: [] as Array<{label: string, value: number | string}>,
    searchTaskValue: '',
    searchTaskTabs: [] as Array<{type: string, label: string}>,
    selectedSearchTaskTab: 'ALL',
    taskList: []
  },
  onLoad() {
    this.debounceSearchTask = debounce(this.handleSearchTask.bind(this), 500)
    this.getSearchTaskTabs()
    this.getPageData()
  },
  onShow() {
    this.getPageData()
  },
  getPageData() {
    this.getOverviewData()
    this.getTaskList({})
  },
  refreshPageData() {
  },
  // 获取概览信息
  async getOverviewData() {
    const res = await serverApi.getTaskOverview()
    console.log('getOverviewData', res)
    if (res.success && res.data) {
      const { total, completed, doing, completionRate } = res.data
      this.setData({
        overviewData: [
          { label: TaskStatus.TOTAL, value: total },
          { label: TaskStatus.COMPLETED, value: completed },
          { label: TaskStatus.DOING, value: doing },
          { label: '完成率', value: formatToPercentage(completionRate) }
        ]
      })
    }
  },
  getSearchTaskTabs() {
    this.setData({
      searchTaskTabs: [
        { type: 'ALL', label: '全部' },
        ...Object.values(TASK_CATEGORY).map(({type, label}) => ({type, label}))
      ]
    })
  },
  handleSearchTabTap(e: any) {
    const { type } = e.currentTarget.dataset
    this.setData({
      selectedSearchTaskTab: type
    }, () => {
      this.getTaskList({ category: type })
    })
  },
  handleSearchTask () {
    this.getTaskList({ search: this.data.searchTaskValue })
  },
  // 任务状态切换
  async handleTaskStatusChange(e: any) {
    console.log(e, e.detail.value)
    const { id, status } = e.currentTarget.dataset
    if (status === 'COMPLETED') return
    const newStatus: keyof typeof TaskStatus = status === 'DOING' ? 'COMPLETED' : 'DOING'
    // 调用服务器API更新状态
    // await serverApi.updateTaskStatus(id, newStatus)
    // this.getTaskList({ status: newStatus })
  },
  async getTaskList(params?: any) {
    const res = await serverApi.getTaskList(params)
    console.log('getTaskList', res)
    if (res.success && res.data) {
      const taskList: Array<TaskItem> = res.data?.list?.map((item) => {
        return {
          ...item,
          categoryLabel: TASK_MAPS.category[item.category],
          priorityLabel: `${TASK_MAPS.priority[item.priority]}优先级`,
          priorityClass: `priority-${item.priority.toLowerCase()}`,
          date: TimeUtils.formatDate(item.deadline)
        }
      })
      this.setData({
        taskList
      })
    }
  },
  navigateToAddTask() {
    wx.navigateTo({
      url: '/pages/add-task/add-task'
    })
  },
  navigateToTaskDetail(e: any) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/task-detail/task-detail?id=${id}`
    })
  }
})