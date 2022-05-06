const crypto = require('crypto')
/**
 * 生成 hash
 * @param {String | Buffer} data 生成hash的内容
 * @param {Number} size 生成hash的大小(长度)默认32
 * @returns {String} hash
 */
function hash(data, size) {
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
    throw new TypeError('Expected a Buffer or string')
  }
  size = Number.isNaN(size) ? 10 : size || 32
  return crypto.createHash('md5').update(data).digest('hex').slice(0, size)
}

module.exports = hash
