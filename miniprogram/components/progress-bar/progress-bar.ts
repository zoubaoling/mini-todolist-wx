Component({
  properties: {
    label: {
      type: String,
      value: ''
    },
    percentage: {
      type: Number,
      value: 0
    },
    gradient: {
      type: String,
      value: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
    },
    animated: {
      type: Boolean,
      value: false
    },
    // 文字大小配置
    labelFontSize: {
      type: String,
      value: '@font-sm'
    },
    valueFontSize: {
      type: String,
      value: '@font-sm'
    },
    // 文字颜色配置
    labelColor: {
      type: String,
      value: '#666666'
    },
    valueColor: {
      type: String,
      value: '#333333'
    },
    // 进度条高度配置
    height: {
      type: String,
      value: '18rpx'
    },
    // 进度条背景色配置
    backgroundColor: {
      type: String,
      value: '#f0f0f0'
    }
  },
  
  data: {
    percentageText: ''
  },
  
  observers: {
    'percentage': function(newVal) {
      this.setData({
        percentageText: `${newVal}%`
      })
    }
  },
  
  methods: {
    // 触发动画
    triggerAnimation() {
      this.setData({
        animated: true
      })
    },
    
    // 重置动画
    resetAnimation() {
      this.setData({
        animated: false
      })
    }
  }
})
