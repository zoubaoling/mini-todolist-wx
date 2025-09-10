import { STATS_DIMENSION, TASK_CATEGORY } from '../../constants/index'
import { setDataAndWait } from '../../utils/util'
Page({ 
  data: {
    taskStats: {
      total: 0,
      completed: 0,
      completionRate: '50%',
      consecutiveDays: 0
    },
    statsDimension: STATS_DIMENSION,
    filterDimension: STATS_DIMENSION[0].value,
    taskCategoryList: Object.values(TASK_CATEGORY)
  },
  onLoad () {
    this.getTaskCategoryList()
  },
  onReady () {
    // 首次渲染时触发动画
    this.triggerProgressAnimation()
  },
  getTaskCategoryList () {
    // 模拟不同分类的完成情况数据，与原型保持一致
    const mockData = {
      'WORK': { completed: 8, total: 10, percentage: 80 },
      'LIFE': { completed: 13, total: 20, percentage: 65 },
      'LEARN': { completed: 9, total: 10, percentage: 90 },
      'HEALTH': { completed: 9, total: 20, percentage: 45 },
      'ENTERTAINMENT': { completed: 6, total: 8, percentage: 75 },
      'SHOPPING': { completed: 4, total: 6, percentage: 67 }
    }
    
    const list = Object.values(TASK_CATEGORY).map(({type, ...items}) => {
      const data = mockData[type as keyof typeof mockData] || { completed: 0, total: 1, percentage: 0 }
      
      return {
        ...items,
        type,
        percentage: data.percentage,
        completed: data.completed,
        total: data.total,
        animated: false
      }
    })
    
    this.setData({
      taskCategoryList: list
    })
  },
  
  triggerProgressAnimation() {
    // 为每个进度条设置动画延迟，创造依次出现的效果
    const items = this.data.taskCategoryList
    items.forEach((_, index) => {
      setTimeout(() => {
        this.setData({
          [`taskCategoryList[${index}].animated`]: true
        })
      }, index * 200) // 每个进度条延迟200ms
    })
  },
  handleClickFilter (e: any) {
    this.setData({
      filterDimension: e.currentTarget.dataset.value
    })
    // 切换筛选维度时重新触发动画
    this.refreshProgressAnimation()
  },
  
  // 数据刷新时重新触发动画
  async refreshProgressAnimation() {
    // 1. 重置所有动画状态
    const resetList = this.data.taskCategoryList.map(item => ({
      ...item,
      animated: false
    }))
    this.setData({ taskCategoryList: resetList })
    
    // 2. 延迟重新触发动画 wx.nextTick中DOM渲染完再触发动画
    await setDataAndWait(this, { taskCategoryList: resetList })
    this.triggerProgressAnimation()
  }
})