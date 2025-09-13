import { STATS_DIMENSION, TASK_CATEGORY } from '../../constants/index'
import { setDataAndWait, formatToPercentage } from '../../utils/util'
import * as serverApi from '../../server/index'
Page({ 
  data: {
    taskStats: {
      total: 0,
      completed: 0,
      completionRate: 0.5,
      continuousDays: 0
    },
    statsDimension: STATS_DIMENSION,
    filterDimension: STATS_DIMENSION[0].value,
    taskCategoryList: Object.values(TASK_CATEGORY)
  },
  onLoad () {
    this.getStatsData()
  },
  onReady () {
    // 首次渲染时触发动画
    this.triggerProgressAnimation()
  },
  onShow () {
    this.getStatsData()
  },
  getStatsData () {
    this.getTaskOverview()
    this.getTaskCategoryList()
  },
  handleClickFilter (e: any) {
    this.setData({
      filterDimension: e.currentTarget.dataset.value
    }, () => {
      this.getStatsData()
    })
  },
  async getTaskOverview () {
    const res = await serverApi.getTaskOverview(this.data.filterDimension)
    if (res.success && res.data) {
      const { completionRate, ...properties } = res.data
      this.setData({
        taskStats: {
          ...properties,
          completionRate: formatToPercentage(completionRate)
        }
      })
    }

  },
  async getTaskCategoryList () {
    // 模拟不同分类的完成情况数据，与原型保持一致
    const res = await serverApi.getTaskCategoryCompletion(this.data.filterDimension)
    console.log('getTaskCategoryList', res)
    // if (res.success && res.data) {
    if (true) {
      const mockData2 = [
        { category: 'WORK', completionRate: 0.8 },
        { category: 'LIFE', completionRate: 0.65 },
        { category: 'LEARN', completionRate: 0.9 },
        { category: 'HEALTH', completionRate: 0.45 },
        { category: 'ENTERTAINMENT', completionRate: 0.75 },
        { category: 'SHOPPING', completionRate: 0.67 }
      ]
      const list = Object.values(TASK_CATEGORY).map(({type, ...items}) => {
        const data = mockData2.find(item => item.category === type)
        return {
          ...items,
          type,
          percentage: (data.completionRate * 100).toFixed(2),
          // 重置动画状态
          animated: false
        }
      })
      
      this.setData({
        taskCategoryList: list
      })
       // 2. 延迟重新触发动画 wx.nextTick中DOM渲染完再触发动画
      await setDataAndWait(this, { taskCategoryList: list })
      this.triggerProgressAnimation()
    }
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
  }
})