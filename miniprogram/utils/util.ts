import { ApiResponse } from "../types"

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
export const nextTick = () => {
  return new Promise((resolve) => {
    wx.nextTick(resolve)
  })
}
export const setDataAndWait = (page: any, data: any): Promise<void> => {
  return new Promise((resolve) => {
    page.setData(data, () => {
      wx.nextTick(resolve)
    })
  })
}
export const getAccountInfo = () => {
  return wx.getAccountInfoSync()
}
// 小数转百分比
export const formatToPercentage = (num: number) => {
  return `${(num * 100).toFixed(2)}%`
}
// API调用包装器，统一处理错误
export const apiWrapper = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string = '接口调用失败'
): Promise<ApiResponse<T>> => {
  try {
    const data = await apiCall()
    return {
      success: true,
      data
    }
  } catch (error) {
    wx.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 2000
    })
    return {
      success: false,
      message: error instanceof Error ? error.message : errorMessage
    }
  }
}
// 防抖
export const debounce = (fun: Function, delay: number) => {
  let timeoutId: any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fun(...args)
    }, delay)
  }
}
// 节流 定时器 + 时间戳
export const throttle = (fun: Function, delay: number) => {
  let lastTime = 0
  let timeoutId: any
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fun(...args)
      lastTime = now
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fun(...args)
      }, delay)
    }
  }
}