Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    subTitle: {
      type: String,
      value: ''
    },
    isShowBackButton: {
      type: Boolean,
      value: false
    },
    barType: {
      type: String,
      value: 'page' // page: 首页导航栏 back: 返回上一页
    },
    isShowRightButton: {
      type: Boolean,
      value: false
    }
  },
  data: {
    height: '250rpx',
    leftIconPath: '/assets/images/back.png',
  },
  observers: {
    'barType': function (barType) {
      this.updateComputedProperties(barType)
    }
  },
  lifetimes: {
    attached () {
      this.updateComputedProperties(this.data.barType)
    },
  },
  methods: {
    updateComputedProperties (barType: string): void {
      let computedData: Record<string, any> = {}
      switch (barType) {
        case 'page':
          computedData = {
            ...computedData,
            height: '250rpx',
          }
          break
        case 'back':
          computedData = {
            ...computedData,
            height: '140rpx'
          }
          break
      }
      this.setData(computedData)
    },
    onLeftButtonTap () {
      this.triggerEvent('left-button-tap')
    },
    onRightButtonTap () {
      this.triggerEvent('right-button-tap')
    }
  }
})