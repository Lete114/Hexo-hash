const { join } = require('path')
const { existsSync, statSync, readdirSync } = require('fs')

/**
 * 读取一个目录下的所有文件
 * @param {String} dirPath 目标目录
 * @returns {Array} 读取到符合条件的所有文件
 */
module.exports = function readAllFile(dirPath) {
  if (!existsSync(dirPath)) return []

  let array = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolvePath = join(dirPath, item)

    // 读取文件信息
    const stat = statSync(resolvePath)

    // 文件 合并
    if (stat.isFile()) {
      array.push(resolvePath)
      continue
    }

    // 目录 递归
    if (stat.isDirectory()) {
      const resultArr = readAllFile(resolvePath)
      array = [...array, ...resultArr]
    }
  }
  return array
}
