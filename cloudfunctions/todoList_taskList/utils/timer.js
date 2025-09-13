const dayjs = require('dayjs')

module.exports = {
  formatDate(date) {
    return dayjs(date).format('YYYY-MM-DD')
  },
  toISOString(date) {
    return dayjs(date).toISOString()
  },
  toDate(date) {
    return dayjs(date).toDate()
  },
  getDateRange(dateType) {
    const now = dayjs(new Date());
    // db.command.gte() 等比较的是Date对象，比如db.serveDate()返回的是Date对象
    switch (dateType) {
      case 'DAY':
        return [now.startOf('day').toDate(), now.endOf('day').toDate()]
      case 'WEEK':
        return [now.startOf('week').toDate(), now.endOf('week').toDate()]
      case 'MONTH':
        return [now.startOf('month').toDate(), now.endOf('month').toDate()]
      default:
        return [null, null]
    }
  }
}