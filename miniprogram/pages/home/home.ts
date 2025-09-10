import { TASK_CATEGORY, TASK_MAPS,  } from '../../constants/index'
import { TaskStatus, TaskPriority, TaskItem } from '../../types/index'
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
    this.getSearchTaskTabs()
    this.getPageData()
  },
  onShow() {
    this.getPageData()
  },
  getPageData() {
    this.getOverviewData()
    this.getTaskList()
  },
  getOverviewData() {
    this.setData({
      overviewData: [
        { label: TaskStatus.TOTAL, value: 100 },
        { label: TaskStatus.COMPLETED, value: 100 },
        { label: TaskStatus.DOING, value: 100 },
        { label: '完成率', value: '67%' }
      ]
    })
  },
  getSearchTaskTabs() {
    this.setData({
      searchTaskTabs: [
        { type: 'ALL', label: '全部' },
        ...Object.values(TASK_CATEGORY).map(({type, label}) => ({type, label}))
      ]
    })
  },
  handleSearchTabTap() {},
  handleSearchTaskConfirm () {},
  handleTaskChange(e: any) {
    console.log(e)
  },
  getTaskList() {
    type TaskDisplayItem = TaskItem & {
      [key: string]: any
    }
    const taskList: Array<TaskDisplayItem> = this.data.taskList.map((item) => {
      return {
        ...item,
        categoryLabel: TASK_MAPS.category[item.category],
        priorityLabel: `${TASK_MAPS.priority[item.priority]}优先级`,
        priorityClass: `priority-${item.priority.toLowerCase()}`
      }
    })
    console.log(taskList)
    this.setData({
      taskList
    })
  },
  handleAddTask() {
    wx.navigateTo({
      url: '/pages/add-task/add-task'
    })
  }
})