/**
 * @author Lete114
 * github: https://github.com/Lete114
 * blog: https://blog.imlete.cn
 */

'use strict'

const { existsSync } = require('fs')
const prettyHrtime = require('pretty-hrtime')
const readAllFile = require('./lib/readAllFile')
const mapping = require('./lib/mapping')
const handlerJs = require('./lib/script')
const handlerCss = require('./lib/css')
const handlerHtml = require('./lib/html')

// 获取完整规范化的 hexo source url 地址
const urlFor = require('hexo-util').url_for.bind(hexo)

const defualtOptions = {
  enable: true,
  size: 10,
  versionKey: 'v',
  lazy: 'src',
  html: true,
  queryString: {
    js: true,
    css: true,
    html: {
      style: true,
      script: true,
      inline: true // 预留
    }
  }
}

const caches = {}

hexo.on('exit', function () {
  var start = process.hrtime()
  const { config, env, public_dir, log } = this
  const { root, hash } = config
  // 合并配置
  const options = Object.assign(defualtOptions, hash)

  // 判断当前执行的命令是否是构建命令，并且查看是否存在public_dir
  const condition = ['g', 'generate'].includes(env.cmd)
  if (!condition || !existsSync(public_dir) || !options.enable) return
  // 读取生成hash版本的文件
  const files = readAllFile(public_dir)
  const mappings = mapping(files, public_dir, urlFor, options.size)
  // console.log('mappings',mappings)
  const params = { options, root, urlFor, files, mappings, caches, public_dir }
  handlerJs(params)
  handlerCss(params)
  handlerHtml(params)

  const interval = prettyHrtime(process.hrtime(start))
  const cyan = '\x1b[36m' + interval + '\x1b[39m'
  log.i('Successfully injected hash version in %s', cyan)
})
