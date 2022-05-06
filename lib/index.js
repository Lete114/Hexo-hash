const { readFileSync, writeFileSync } = require('fs')
const readAllFile = require('./readAllFile')
const hash = require('./hash')

/**
 * 生成hash对象映射
 * @param {Array} files 需要生成hash的文件路径
 * @returns {Object}
 */
function mapping(files, public_dir, urlFor) {
  const obj = {}
  for (const file of files) {
    // 去除绝对路径
    const relativePath = file.replace(public_dir, '')
    // 将系统文件路径转换为url路径
    const urlPath = urlFor(relativePath.replace(/\\/g, '/'))
    // 生成对象
    obj[urlPath] = {}
    obj[urlPath].path = file
    // 读取内容生成hash
    obj[urlPath].hash = hash(readFileSync(file))
  }
  return obj
}

/**
 * 像指定文件内符合要求的内容注入hash
 * @param {Array} files 需要注入hash的文件路径
 * @param {Object} mappingObj hash对象映射
 */
function injectHash(files, mappingObj) {
  for (const file of files) {
    // 读取文件内容
    let content = readFileSync(file).toString()
    for (const o in mappingObj) {
      const { hash } = mappingObj[o]
      // 判断是否已经注入过hash
      const isHash = new RegExp('(' + o + ')[?v=]', 'g')
      if (isHash.test(content)) continue
      // 注入hash
      const reg = new RegExp('(' + o + ')', 'g')
      content = content.replace(reg, '$1?v=' + hash)
    }
    // 写入注入hash后的内容到指定文件
    writeFileSync(file, content)
  }
}

module.exports = { hash, injectHash, mapping, readAllFile }
