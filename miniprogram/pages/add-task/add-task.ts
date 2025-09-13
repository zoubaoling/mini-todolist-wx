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
    },
    isEdit: false,
    editTaskId: ''
  },
  onLoad(options: any) {
    this.setData({
      isEdit: !!options.id,
      editTaskId: options.id
    })
    this.debounceUpdateFormFieldData = debounce(this.updateFormFieldData.bind(this), 500)
     // 确保数据初始化
    this.initPriorityList()
    this.initCategoryList()
    this.initTaskDetail()
  },
  handleBack() {
    wx.navigateBack()
  },
  async handleSaveTask() {
    const { deadlineTime, deadlineDate, ...restFormData } = this.data.taskFormData
    const deadline = TimeUtils.combineDateTimeSafe(deadlineDate, deadlineTime)
    const saveFunc = this.data.isEdit ? serverApi.editTask : serverApi.addTask
    await saveFunc({
      ...restFormData,
      deadline
    })
    // todo
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
    if (this.data.isEdit) {
      wx.switchTab({
        url: '/pages/home/home'
      })
    } else {
      wx.navigateBack()
    }
  },
  updateFormFieldData (e: any) {
    const { field, type } = e.currentTarget.dataset
    this.setData({
      [`taskFormData.${field}`]: ['text', 'desc', 'isReminder'].includes(field) ? e.detail.value : type
    }, () => {
      console.log('updateFormFieldData', this.data.taskFormData)
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
  },
  async initTaskDetail () {
    if (this.data.isEdit) {
      const res = await serverApi.getTaskDetail(this.data.editTaskId)
      if (res.success && res.data) {
        const { deadline, ...properties } = res.data
        this.setData({
          taskFormData: {
            ...properties,
            deadlineDate: TimeUtils.format(deadline, 'YYYY-MM-DD'),
            deadlineTime: TimeUtils.format(deadline, 'hh:mm')
          }
        })
      }
    }
  }
})