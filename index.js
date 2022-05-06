/**
 * @author Lete114
 * github: https://github.com/Lete114
 * blog: https://blog.imlete.cn
 */

'use strict'

const { existsSync } = require('fs')
const { cyan } = require('picocolors')
const prettyHrtime = require('pretty-hrtime')
const { injectHash, mapping, readAllFile } = require('./lib')

// 获取完整规范化的 hexo source url 地址
const urlFor = require('hexo-util').url_for.bind(hexo)

const defualtOptions = {
  enable: true,
  injectSuffix: ['.html', '.css', '.js'],
  suffix: false,
  ignoreSuffix: false,
  ignoreDir: false
}

hexo.on('exit', function () {
  var start = process.hrtime()
  const { config, env, public_dir, log } = this
  // 合并配置
  const hash = Object.assign(defualtOptions, config.hash)
  const { enable, injectSuffix, suffix, ignoreSuffix, ignoreDir } = hash

  // 判断当前执行的命令是否是构建命令，并且查看是否存在public_dir
  const condition = ['g', 'generate'].includes(env.cmd)
  if (!condition || !existsSync(public_dir) || !enable) return

  const injectFiles = readAllFile(public_dir, { suffix: injectSuffix })
  const files = readAllFile(public_dir, { suffix, ignoreSuffix, ignoreDir })
  const mappingObj = mapping(files, public_dir, urlFor)
  injectHash(injectFiles, mappingObj)

  const interval = prettyHrtime(process.hrtime(start))
  log.i('Successfully injected hash version in %s', cyan(interval))
})
