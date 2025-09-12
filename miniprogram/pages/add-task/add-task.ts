import { TASK_PRIORITY, TASK_CATEGORY } from "../../constants/index"
import { debounce } from "../../utils/util"
import TimeUtils from "../../utils/timer"
import * as serverApi from '../../server/index'
Page({
  data: {
    priorityList: [] as Array<{type: string, desc: string, label: string, class: string}>,
    selectedTime: '',
    taskFormData: {
      text: '',
      desc: '',
      category: 'WORK',
      isReminder: false,
      // 截止日期
      // picker: mode=time时，格式为 "YYYY-MM-DD"
      deadlineDate: TimeUtils.format(new Date(), 'YYYY-MM-DD'),
      // picker: mode=time时，格式为 hh:mm
      deadlineTime: TimeUtils.format(new Date(), 'hh:mm'),
      priority: 'HIGH',
      status: 'DOING'
    }
  },
  onLoad() {
    this.debounceUpdateFormFieldData = debounce(this.updateFormFieldData.bind(this), 500)
     // 确保数据初始化
    this.initPriorityList()
    this.initCategoryList()
  },
  handleBack() {
    wx.navigateBack()
  },
  async handleSaveTask() {
    const deadline = TimeUtils.combineDateTimeSafe(this.data.taskFormData.deadlineDate, this.data.taskFormData.deadlineTime)
    await taskApi.addTask({
      ...this.data.taskFormData,
      deadline
    })
    wx.navigateBack()
  },
  updateFormFieldData (e: any) {
    const { field, type } = e.currentTarget.dataset
    this.setData({
      [`taskFormData.${field}`]: ['text', 'desc', 'isReminder'].includes(field) ? e.detail.value : type
    })
  },
  initPriorityList () {
    const list = Object.values(TASK_PRIORITY)
    .map(({type, label, desc}) => ({
      type,
      desc,
      label: `${label}优先级`,
      class: `priority-${type.toLowerCase()}`,
      selectedClass: `priority-${type.toLowerCase()}-selected`
    }))
    this.setData({
      priorityList: list
    })
  },
  initCategoryList () {
    const list = Object.values(TASK_CATEGORY)
    this.setData({
      categoryList: list
    })
  }
})