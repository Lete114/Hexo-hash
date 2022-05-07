const { readFileSync, writeFileSync } = require('fs')
const readAllFile = require('./readAllFile')
const hash = require('./hash')

/**
 * 生成hash对象映射
 * @param {Array} files 需要生成hash的文件路径
 * @param {String} public_dir 静态文件审查的绝对路径
 * @param {Function} urlFor 规范化的 hexo source url 地址函数
 * @param {Number} size 生成hash的大小(长度)默认32
 * @param {Array} relative 是否对相对路径的资源注入hash版本
 * @returns {Object}
 */
function mapping(files, public_dir, urlFor, size, relative) {
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
    obj[urlPath].relative = []
    obj[urlPath].path = file

    // 是否对相对路径的资源注入hash版本
    if (!relative) continue

    // 生成相对路径映射
    const uSplit = urlPath.split('/')
    // 移除第一个空字符串，以及文件昵称
    const relativePathDirArr = uSplit.slice(1, uSplit.length - 1)
    relativePathDirArr.reduce((previous, current) => {
      previous = previous.replace(/^\/?/, '')
      // 将路径文件夹替换为..
      const res = previous.replace(current, '..')
      obj[urlPath].relative.push(res)
      return res
    }, urlPath)

    /*
    举例生成相对路径过程

    urlPath:                  /third-party/fontawesome-free/webfonts/fa-v4compatibility.woff2
    uSplit:                   [ '', 'third-party', 'fontawesome-free', 'webfonts', 'fa-v4compatibility.woff2' ]
    relativePathDirArr:       [ 'third-party', 'fontawesome-free', 'webfonts' ]
    previous:                 third-party/fontawesome-free/webfonts/fa-v4compatibility.woff2
    res[0]:                   /../fontawesome-free/webfonts/fa-v4compatibility.woff2
    res[1]:                   /../../webfonts/fa-v4compatibility.woff2
    res[2]:                   /../../../fa-v4compatibility.woff2

    最后生成的相对路径映射结果
    obj[urlPath].relative:    [
                                '../fontawesome-free/webfonts/fa-v4compatibility.woff2',
                                '../../webfonts/fa-v4compatibility.woff2',
                                '../../../fa-v4compatibility.woff2'
                              ]
    */
  }
  return obj
}

/**
 * 像指定文件内符合要求的内容注入hash
 * @param {Array} files 需要注入hash的文件路径
 * @param {Object} mappingObj hash对象映射
 * @param {String} version 自定义版本key
 * @param {Array} relativePath 相对路径映射
 */
function injectHash(files, mappingObj, version, relativePath) {
  for (const file of files) {
    // 读取文件内容
    let content = readFileSync(file).toString()
    for (const key in mappingObj) {
      const { hash, relative } = mappingObj[key]

      // 处理/index.html
      const isIndex = key.replace(/\/index\.html/,'/')

      // 判断是否已经注入过hash
      const isHash = new RegExp(`(${key}|${isIndex}?)[?${version}=]`, 'g')
      if (isHash.test(content)) continue
      // 注入hash
      const reg = new RegExp(`(${key}|${isIndex}?)`, 'g')
      content = content.replace(reg, `$1?${version}=` + hash)

      // 是否对相对路径的资源注入hash版本
      if (relativePath) {
        relativeFor: for (const i of relative) {
          // 移除多余的 ../ 用作二次匹配
          const isRelative = i.replace(/\.\.\//g, '')
          // 判断是否已经注入过hash
          const isHash = new RegExp(`(${i}|${isRelative})[?${version}=]`, 'g')
          // 结束指定(内层)循环
          if (isHash.test(content)) continue relativeFor
          // 注入hash
          const reg = new RegExp(`(${i}|${isRelative})`, 'g')
          content = content.replace(reg, `$1?${version}=` + hash)
        }
      }
    }
    // 写入注入hash后的内容到指定文件
    writeFileSync(file, content)
  }
}

module.exports = { hash, injectHash, mapping, readAllFile }
