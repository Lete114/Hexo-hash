const { readFileSync, writeFileSync } = require('fs')
const readAllFile = require('./readAllFile')
const hash = require('./hash')

/**
 * 生成hash对象映射
 * @param {Array} files 需要生成hash的文件路径
 * @param {String} public_dir 静态文件审查的绝对路径
 * @param {Function} urlFor 规范化的 hexo source url 地址函数
 * @param {Number} size 生成hash的大小(长度)
 * @returns {Object}
 */
function mapping(files, public_dir, urlFor, size) {
  const obj = {}
  for (const file of files) {
    // 去除绝对路径
    const relativePath = file.replace(public_dir, '')
    // 将系统文件路径转换为url路径
    const urlPath = urlFor(relativePath.replace(/\\/g, '/'))
    // 生成对象
    obj[urlPath] = {}
    // 读取内容生成hash
    obj[urlPath].hash = hash(readFileSync(file), size)
    obj[urlPath].path = file
  }
  return obj
}

/**
 * 像指定文件内符合要求的内容注入hash
 * @param {Object} mappingObj hash对象映射
 * @param {String} versionKey 自定义版本key
 */
function injectHash(mappingObj, versionKey) {
  for (const key in mappingObj) {
    const { path } = mappingObj[key]
    // 读取文件内容
    let content = readFileSync(path).toString()

    // 处理html文件引入的资源
    const imgReg = /(<(a|img|link|script).*?(src|href)=['"]?([^ '"]*)['"]?).*?(?:\/?>)/gi
    content = content.replace(imgReg, ($0, $1, $2, $3, $4) => {
      // 处理/index.html
      const isIndex = $4.replace(/\/$/, '/index.html')
      const mappingResult = mappingObj[$4] || mappingObj[isIndex]
      console.log(mappingResult);
      if (mappingResult) {
        // 注入hash
        const { hash } = mappingResult
        return $0.replace($4, $4 + `?${versionKey}=` + hash)
      }else{
        return $0
      }
    })
    // 写入注入hash后的内容到指定文件
    writeFileSync(path, content)
  }
}

module.exports = { hash, injectHash, mapping, readAllFile }
