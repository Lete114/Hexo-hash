/**
 * @author Lete114
 * github: https://github.com/Lete114
 * blog: https://blog.imlete.cn
 */

'use strict'

const { existsSync } = require('fs')
const prettyHrtime = require('pretty-hrtime')
const readAllFile = require('./lib/readAllFile')
const handlerHtml = require('./lib/html')

// 获取完整规范化的 hexo source url 地址
const urlFor = require('hexo-util').url_for.bind(hexo)

const defualtOptions = {
  enable: true,
  size: 10,
  versionKey: 'v'
}

const caches = {}

hexo.on('exit', function () {
  var start = process.hrtime()
  const { config, env, public_dir, log } = this
  const { root, hash } = config
  // 合并配置
  const { enable, size, versionKey, lazy } = Object.assign(defualtOptions, hash)

  // 判断当前执行的命令是否是构建命令，并且查看是否存在public_dir
  const condition = ['g', 'generate'].includes(env.cmd)
  if (!condition || !existsSync(public_dir) || !enable) return
  // 读取生成hash版本的文件
  const files = readAllFile(public_dir)
  const params = { root, urlFor, files, caches, public_dir, versionKey, size, lazy }
  handlerHtml(params)

  const interval = prettyHrtime(process.hrtime(start))
  const cyan = '\x1b[36m' + interval + '\x1b[39m'
  log.i('Successfully injected hash version in %s', cyan)
})
