/**
 * @author Lete114
 * github: https://github.com/Lete114/hexo-hash
 * blog: https://blog.imlete.cn
 */

const cacheHash = require('cache-hash')
const { existsSync } = require('fs')

hexo.on('exit', function () {
  const { config, env, public_dir } = this
  const { hash } = config

  const options = Object.assign({ target: public_dir, output: public_dir }, hash)

  if (['g', 'generate'].includes(env.cmd) && existsSync(public_dir) && options.enable) {
    delete options.enable
    cacheHash(options)
  }
})
