import { STATS_DIMENSION, TASK_CATEGORY } from '../../constants/index'
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
  getTaskCategoryList () {
    const list = Object.values(TASK_CATEGORY).map(({type, ...items}) => {
      return {
        ...items,
        type,
        percentage: 0.1,
        percentageText: '10%'
      }
    })
    this.setData({
      taskCategoryList: list
    })
  },
  handleClickFilter (e: any) {
    this.setData({
      filterDimension: e.currentTarget.dataset.value
    })
  }
})