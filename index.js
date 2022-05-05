/**
 * @author Lete114
 * github: https://github.com/Lete114
 * blog: https://blog.imlete.cn
 */

'use strict'

const { existsSync } = require('fs')

const { injectHash, mapping, readAllFile } = require('./lib')

// 获取完整规范化的 hexo source url 地址
const urlFor = require('hexo-util').url_for.bind(hexo)

const defualtOptions = { enable: true, suffix: false, ignoreSuffix: false, ignoreDir: false }

hexo.on('exit', function () {
  const { config, env, public_dir, log } = this
  // 合并配置
  const hash = Object.assign(defualtOptions, config.hash)
  const { enable, suffix, ignoreSuffix, ignoreDir } = hash

  // 判断当前执行的命令是否是构建命令，并且查看是否存在public_dir
  const condition = ['g', 'generate'].includes(env.cmd) || !existsSync(public_dir)
  if (!enable || !condition) return

  const files = readAllFile(public_dir, { suffix, ignoreSuffix, ignoreDir })
  const mappingObj = mapping(files, public_dir, urlFor)
  injectHash(files, mappingObj)

  log.i('Successfully injected hash version')
})
