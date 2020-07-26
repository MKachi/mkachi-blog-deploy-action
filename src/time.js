Date.prototype.format = function (format) {
  let tokens = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let token in tokens) {
    if (new RegExp(`(${token})`).test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (tokens[token]) : (('00' + tokens[token]).substr(('' + tokens[token]).length)))
    }
  }
  return format
}

module.exports = (format = 'yyyy-MM-dd hh:mm:ss', timezone = 9) => {
  const offset = new Date().getTimezoneOffset()
  const nowDate = new Date().getTime()
  const result = new Date(nowDate + (offset * 60 * 1000) + (timezone * 3600 * 1000)).format(format)
  return result
}
