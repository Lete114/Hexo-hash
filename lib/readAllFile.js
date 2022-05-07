const { join, extname } = require('path')
const { existsSync, statSync, readdirSync } = require('fs')

/**
 * 读取一个目录下的所有文件
 * @param {String} dirPath 目标目录
 * @param {Object} options 选项:
 * suffix[]: 指定读取的文件后缀，如: [".js","html",".css"]
 * ignoreSuffix[]: 忽略指定文件后缀
 * ignoreDir[]: 忽略指定目录
 * @returns {Array} 读取到符合条件的所有文件
 */
module.exports = function readAllFile(dirPath, options = {}) {
  if (!existsSync(dirPath)) return []
  const defualtOptions = {
    suffix: false,
    ignoreSuffix: false,
    ignoreDir: false
  }
  options = Object.assign(defualtOptions, options)

  let array = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolvePath = join(dirPath, item)

    // 忽略文件|目录
    const isIgnoreDir = options.ignoreDir && options.ignoreDir.includes(item)
    if (isIgnoreDir) continue

    // 忽略指定文件后缀
    const isIgnoreSuffix = options.ignoreSuffix && options.ignoreSuffix.includes(extname(item))
    if (isIgnoreSuffix) continue

    // 读取文件信息
    const stat = statSync(resolvePath)

    // 文件 合并
    if (stat.isFile()) {
      // 读取指定文件后缀名
      if (options.suffix) {
        const isSuffix = options.suffix.includes(extname(item))
        if (isSuffix) array.push(resolvePath)
      } else {
        array.push(resolvePath)
      }
      continue
    }

    // 目录 递归
    if (stat.isDirectory()) {
      const resultArr = readAllFile(resolvePath, options)
      array = [...array, ...resultArr]
    }
  }
  return array
}
