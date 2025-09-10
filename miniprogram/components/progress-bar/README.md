# Progress Bar 进度条组件

## 功能特性

- ✅ 支持渐变色彩背景
- ✅ 平滑的填充动画效果
- ✅ 闪烁动画效果
- ✅ 可自定义标签和百分比显示
- ✅ 响应式布局
- ✅ 高度可重用

## 使用方法

### 1. 在页面JSON中注册组件

```json
{
  "usingComponents": {
    "progress-bar": "/components/progress-bar/progress-bar"
  }
}
```

### 2. 在WXML中使用

```xml
<progress-bar
  label="工作"
  percentage="{{80}}"
  gradient="linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
  animated="{{true}}"
/>
```

### 3. 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| label | String | '' | 进度条标签 |
| percentage | Number | 0 | 进度百分比 (0-100) |
| gradient | String | 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' | 渐变背景色 |
| animated | Boolean | false | 是否启用动画 |
| labelFontSize | String | '14px' | 标签文字大小 |
| valueFontSize | String | '14px' | 百分比文字大小 |
| labelColor | String | '#666666' | 标签文字颜色 |
| valueColor | String | '#333333' | 百分比文字颜色 |
| height | String | '8px' | 进度条高度 |
| backgroundColor | String | '#f0f0f0' | 进度条背景色 |

### 4. 组件方法

| 方法名 | 说明 |
|--------|------|
| triggerAnimation() | 触发动画 |
| resetAnimation() | 重置动画 |

## 使用示例

### 基础用法

```xml
<progress-bar
  label="学习"
  percentage="{{90}}"
  animated="{{true}}"
/>
```

### 自定义渐变

```xml
<progress-bar
  label="健康"
  percentage="{{45}}"
  gradient="linear-gradient(90deg, #ff9800 0%, #ffc107 100%)"
  animated="{{true}}"
/>
```

### 自定义样式

```xml
<progress-bar
  label="学习"
  percentage="{{90}}"
  gradient="linear-gradient(90deg, #66bb6a 0%, #4caf50 100%)"
  animated="{{true}}"
  labelFontSize="16px"
  valueFontSize="16px"
  labelColor="#333333"
  valueColor="#2196f3"
  height="12px"
  backgroundColor="#e0e0e0"
/>
```

### 大尺寸进度条

```xml
<progress-bar
  label="工作进度"
  percentage="{{75}}"
  gradient="linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
  animated="{{true}}"
  labelFontSize="18px"
  valueFontSize="18px"
  height="16px"
  backgroundColor="#f5f5f5"
/>
```

### 批量使用

```xml
<view wx:for="{{progressList}}" wx:key="id">
  <progress-bar
    label="{{item.label}}"
    percentage="{{item.percentage}}"
    gradient="{{item.gradient}}"
    animated="{{item.animated}}"
  />
</view>
```

## 动画效果

- **填充动画**: 1.2秒平滑填充到目标宽度
- **闪烁效果**: 填充完成后显示微妙的闪烁动画
- **依次出现**: 支持多个进度条依次出现的效果

## 注意事项

1. 组件会自动计算百分比文本显示
2. 渐变色彩使用CSS linear-gradient语法
3. 动画效果基于CSS transform，性能良好
4. 组件完全自包含，不依赖外部样式
