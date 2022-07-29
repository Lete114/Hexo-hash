module.exports = injectHash

function injectHash(params, content, isRelative) {
  const { options, mappings } = params
  const { versionKey } = options
  for (const mapping in mappings) {
    const { hash, relative } = mappings[mapping]

    // 判断是否已经注入过hash
    const isHash = new RegExp(`(${mapping})[?${versionKey}=]`, 'g')
    if (isHash.test(content)) continue

    content = content.replace(new RegExp(`(${mapping})`, 'g'), `$1?${versionKey}=` + hash)

    if (!isRelative) continue
    for (const i of relative) {
      // 移除多余的 ../ 用作二次匹配
      const isRelative = i.replace(/\.\.\//g, '')
      // 判断是否已经注入过hash
      const isHash = new RegExp(`(${i}|${isRelative})[?${versionKey}=]`, 'g')
      // 结束指定(内层)循环
      if (isHash.test(content)) continue
      // 注入hash
      const reg = new RegExp(`(${i}|${isRelative})`, 'g')
      content = content.replace(reg, `$1?${versionKey}=` + hash)
    }
  }
  return content
}
