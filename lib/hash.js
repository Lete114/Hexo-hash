const crypto = require('crypto')
/**
 * 生成 hash
 * @param {String | Buffer} data 生成hash的内容
 * @param {Number} size 生成hash的大小(长度)
 * @returns {String} hash
 */
module.exports = hash = (data, size = 10) => crypto.createHash('md5').update(data).digest('hex').slice(0, size)
