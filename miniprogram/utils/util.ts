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