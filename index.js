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
  size: 10,
  version: 'v',
  relative: false,
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
  const {
    enable,
    size,
    version,
    relative,
    injectSuffix,
    suffix,
    ignoreSuffix,
    ignoreDir
  } = hash

  // 判断当前执行的命令是否是构建命令，并且查看是否存在public_dir
  const condition = ['g', 'generate'].includes(env.cmd)
  if (!condition || !existsSync(public_dir) || !enable) return

  // 读取需要注入hash版本的文件
  const injectFiles = readAllFile(public_dir, { suffix: injectSuffix })
  // 读取生成hash版本的文件
  const files = readAllFile(public_dir, { suffix, ignoreSuffix, ignoreDir })
  // 生成关系映射对象
  const mappingObj = mapping(files, public_dir, urlFor, size, relative)
  // 注入
  injectHash(injectFiles, mappingObj, version, relative)

  const interval = prettyHrtime(process.hrtime(start))
  log.i('Successfully injected hash version in %s', cyan(interval))
})
