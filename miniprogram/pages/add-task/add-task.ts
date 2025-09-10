import { TASK_PRIORITY, TASK_CATEGORY } from "../../constants/index"
Page({
  data: {
    priorityList: [] as Array<{type: string, desc: string, label: string, class: string}>,
    selectedCategory: '',
    selectedDate: '',
    selectedTime: '',
    isReminderEnabled: false
  },
  onLoad() {
    this.initPriorityList()
    this.initCategoryList()
  },
  handleBack() {
    wx.navigateBack()
  },
  handleSaveTask() {
    console.log('save task')
  },
  onDateChange(e: any) {
    this.setData({
      selectedDate: e.detail.value
    })
  },
  onTimeChange(e: any) {
    this.setData({
      selectedTime: e.detail.value
    })
  },
  onReminderToggle(e: any) {
    this.setData({
      isReminderEnabled: e.detail.value
    })
  },
  initPriorityList () {
    const list = Object.values(TASK_PRIORITY)
    .map(({type, label, desc}) => ({type, desc, label: `${label}优先级`, class: `priority-${type.toLowerCase()}`}))
    this.setData({
      priorityList: list
    })
  },
  initCategoryList () {
    const list = Object.values(TASK_CATEGORY)
    this.setData({
      categoryList: list,
      selectedCategory: list.length ? list[0].type : ''
    })
  }
})