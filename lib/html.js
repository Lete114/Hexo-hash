const { existsSync, readFileSync, statSync, writeFileSync } = require('fs')
const { extname, join } = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const hash = require('./hash')

const DOCTYPE = '<!DOCTYPE html>'
const baseURL = 'http://127.0.0.1'

function handlerIndexHtml(filePath) {
  try {
    const stat = statSync(filePath)
    if (stat.isFile()) return filePath
    const indexHtmlPath = join(filePath, 'index.html')
    if (statSync(indexHtmlPath).isFile()) return indexHtmlPath
    return 'continue'
  } catch (error) {
    return 'continue'
  }
}

function handlerSource(params) {
  const { root, urlFor, sources, caches, public_dir, versionKey, size, lazy } = params
  const obj = { IMG: 'src', LINK: 'href', SCRIPT: 'src' }
  if (lazy) obj.IMG = lazy
  for (const source of sources) {
    let url = source.getAttribute(obj[source.tagName]) || ''
    url = url.replace(root, '')
    if (!existsSync(join(public_dir, url))) continue

    const relativeurl = url.replace(new RegExp('^' + baseURL), '') // baseURL
    const relativePath = relativeurl
      .replace(/#.*$/, '') // 去除锚点
      .replace(/\?.*$/, '') // 去除参数

    let filePath = join(public_dir, relativePath)

    const indexHtml = handlerIndexHtml(filePath)
    if (indexHtml === 'continue') continue
    filePath = indexHtml

    let version = ''
    if (!caches[filePath]) {
      const ctx = readFileSync(filePath, { encoding: 'utf-8' })
      caches[filePath] = hash(ctx, size)
    }
    version = caches[filePath]

    url = new URL(url, baseURL)
    url.searchParams.set(versionKey, version)
    url = url.href.replace(new RegExp('^' + baseURL), '') // baseURL
    source.setAttribute(obj[source.tagName], urlFor(url))
  }
}

module.exports = (params) => {
  const htmls = params.files.filter((file) => extname(file) === '.html')

  const Selector = `script[src],link[href],img[${params.lazy || 'src'}]`
  for (const html of htmls) {
    const content = readFileSync(html, { encoding: 'utf-8' })
    const dom = new JSDOM(content, { url: baseURL })
    const sources = Array.from(dom.window.document.querySelectorAll(Selector))
    params.sources = sources
    handlerSource(params)

    let outerHTML = dom.window.document.documentElement.outerHTML
    const isDoctype = new RegExp('^' + DOCTYPE).test(content)
    if (isDoctype) outerHTML = DOCTYPE + outerHTML

    writeFileSync(html, outerHTML)
  }
}
