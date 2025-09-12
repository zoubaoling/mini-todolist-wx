import dayjs from "dayjs"
import duration from "../libs/dayjs_plugins/duration.js"
import '../libs/dayjs_plugins/locale/zh-cn.js'
// 按需导入插件
dayjs.extend(duration)
dayjs.locale('zh-cn')

const TimeUtils = {
  now() {
    return dayjs()
  },
  format(date: string | Date | number, format: string= 'YYYY-MM-DD HH:mm:ss') {
    console.log(dayjs(date).format(format))
    return dayjs(date).format(format)
  },
   // 拼接日期和时间（更安全的方式）
  combineDateTimeSafe(dateStr: string, timeStr: string) {
    // 方法2: 先解析日期，再设置时间
    const date = dayjs(dateStr)
    const [hours, minutes] = timeStr.split(':').map(Number)
    
    return date.hour(hours).minute(minutes).second(0).toISOString()
  },
  // 将ISO时间字符串转换为YYYY-MM-DD和hh:mm两个字符串
  splitDateTime(isoString: string) {
    const date = dayjs(isoString)
    return {
      date: date.format('YYYY-MM-DD'),
      time: date.format('HH:mm')
    }
  },
  // 计算倒计时
  countdown(endDate: string | Date | number) {
    const now = dayjs()
    const end = dayjs(endDate)
    const diff = end.diff(now) // 毫秒
    const d = dayjs.duration(diff)
    return {
    total: diff,
      days: d.days(),
      hours: d.hours(),
      minutes: d.minutes(),
      seconds: d.seconds()
    }
  }
}
export default TimeUtils