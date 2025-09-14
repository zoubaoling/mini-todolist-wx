import { TASK_CATEGORY, TASK_MAPS,  } from '../../constants/index'
import { TaskStatus, TaskPriority, TaskItem } from '../../types/index'
import { debounce, formatToPercentage, showModal } from '../../utils/util'
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
    taskList: [] as Array<TaskItem>,
    debounceSearchTask: null as any
  },
  onLoad() {
    this.setData({
      debounceSearchTask: debounce(this.handleSearchTask.bind(this), 500)
    })
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
  clearSearch() {
    this.setData({
      searchTaskValue: ''
    }, () => {
      // 清除搜索后重新获取任务列表
      this.getTaskList()
    })
  },
  // 获取概览信息
  async getOverviewData() {
    const res = await serverApi.getTaskOverview()
    console.log('getOverviewData', res)
    if (res.success && res.data) {
      const { total, completed, doing, completionRate } = res.data as any
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
    if (this.isTaskItemDisabled(e.currentTarget.dataset.status)) return
    const { id, status } = e.currentTarget.dataset
    if (status === 'COMPLETED') return
    const newStatus: keyof typeof TaskStatus = status === 'DOING' ? 'COMPLETED' : 'DOING'
    // 调用服务器API更新状态
    await serverApi.updateTaskStatus(id, newStatus)
    this.getTaskList({ category: this.data.selectedSearchTaskTab })
  },
  async getTaskList(params?: any) {
    try {
      const res = await serverApi.getTaskList(params)
      if (res.success && res.data) {
        const taskList: Array<TaskItem> = (res.data as any)?.list?.map((item: any) => {
          const isCompleted = item.status === 'COMPLETED'
          return {
            ...item,
            categoryLabel: TASK_MAPS.category[item.category as keyof typeof TASK_MAPS.category],
            priorityLabel: `${TASK_MAPS.priority[item.priority as keyof typeof TASK_MAPS.priority]}优先级`,
            priorityClass: `priority-${item.priority.toLowerCase()} ${isCompleted && 'line-through'}`,
            textClass: isCompleted && 'line-through',
            categoryClass: isCompleted && 'line-through',
            dateClass: isCompleted && 'line-through',
            itemClass: isCompleted && 'task-item-completed',
            date: TimeUtils.formatDate(item.deadline),
            // 是否过期
            isExpired: TimeUtils.isExpired(item.deadline)
          }
        }) || []
        this.setData({
          taskList
        })
      } else {
        // API 调用失败时显示空列表
        this.setData({
          taskList: []
        })
      }
    } catch (error) {
      console.error('获取任务列表失败:', error)
      // 出错时显示空列表
      this.setData({
        taskList: []
      })
    }
  },
  navigateToAddTask() {
    wx.navigateTo({
      url: '/pages/add-task/add-task'
    })
  },
  isTaskItemDisabled(status: string) {
    return status === 'COMPLETED'
  },
  navigateToTaskDetail(e: any) {
    const { id, status, isExpired } = e.currentTarget.dataset
    if (this.isTaskItemDisabled(status) || isExpired) return
    wx.navigateTo({
      url: `/pages/task-detail/task-detail?id=${id}`
    })
  }
})