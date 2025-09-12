import { TASK_CATEGORY, TASK_MAPS,  } from '../../constants/index'
import { TaskStatus, TaskPriority, TaskItem } from '../../types/index'
import { debounce } from '../../utils/util'
import * as serverApi from '../../server/index'
Page({
  data: {
    taskCategory: TASK_CATEGORY,
    taskPriorityEnum: TaskPriority,
    overviewData: [] as Array<{label: string, value: number | string}>,
    searchTaskValue: '',
    searchTaskTabs: [] as Array<{type: string, label: string}>,
    searchTaskTab: 'ALL',
    taskList: [
      { id: 1, text: '完成项目报告', category: 'WORK', date: '2025-01-01', priority: 'HIGH', status: 'DOING' },
      { id: 2, text: '购买生活用品', category: 'LIFE', date: '2025-01-02', priority: 'MEDIUM', status: 'COMPLETED' },
      { id: 3, text: '阅读技术文档', category: 'LEARN', date: '2025-01-03', priority: 'LOW', status: 'DOING' },
      { id: 4, text: '阅读技术文档2', category: 'HEALTH', date: '2025-01-03', priority: 'LOW', status: 'COMPLETED' },
    ] as Array<TaskItem>
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
    // const res = await serverApi.getTaskOverview()
    // if (res.success && res.data) {
    if (true) {
      // const { total, completed, doing, continuousDays } = res.data
      this.setData({
        overviewData: [
          { label: TaskStatus.TOTAL, value: 100 },
          { label: TaskStatus.COMPLETED, value: 100 },
          { label: TaskStatus.DOING, value: 100 },
          { label: '完成率', value: '67%' }
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
    this.getTaskList({ category: type })
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
  async getTaskList(params?: any) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // const res = await serverApi.getTaskList(params)
    // if (true && res.success && res.data) {
    if (true) {
      // const { taskList } = res.data
      const taskList: Array<TaskItem> = this.data.taskList.map((item) => {
        return {
          ...item,
          categoryLabel: TASK_MAPS.category[item.category],
          priorityLabel: `${TASK_MAPS.priority[item.priority]}优先级`,
          priorityClass: `priority-${item.priority.toLowerCase()}`
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