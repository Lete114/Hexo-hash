const { existsSync, readFileSync, writeFileSync } = require('fs')
const { extname, join } = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const injectHash = require('./queryString')

const DOCTYPE = '<!DOCTYPE html>'
const baseURL = 'http://127.0.0.1'

function handlerSource(params) {
  const { options, root, urlFor, sources, mappings, caches, public_dir } = params
  const { versionKey, lazy } = options
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

    let version = ''
    if (!caches[filePath]) {
      for (const key in mappings) {
        const mapping = mappings[key]
        if (mapping.path === filePath) {
          caches[filePath] = mapping.hash
        }
      }
    }
    version = caches[filePath]

    url = new URL(url, baseURL)
    url.searchParams.set(versionKey, version)
    url = url.href.replace(new RegExp('^' + baseURL), '') // baseURL
    source.setAttribute(obj[source.tagName], urlFor(url))
  }
}

function handlerInline(params, inlines) {
  const { dom } = params

  inlines = inlines.filter((inline) => inline.textContent)

  for (const inline of inlines) {
    const newTag = dom.window.document.createElement(inline.tagName)
    let content = inline.text || inline.textContent || inline.innerHTML || ''

    content = injectHash(params, content)

    Array.from(inline.attributes).forEach((attr) => newTag.setAttribute(attr.name, attr.value))
    newTag.text = content
    newTag.textContent = content
    inline.parentNode.replaceChild(newTag, inline)
  }
}

module.exports = (params) => {
  const { options, files } = params
  const { queryString } = options
  if (!options.html) return
  const htmls = files.filter((file) => extname(file) === '.html')

  const Selector = `script[src],link[href],img[${options.lazy || 'src'}]`
  for (const html of htmls) {
    const content = readFileSync(html).toString()
    const dom = new JSDOM(content, { url: baseURL })
    const sources = Array.from(dom.window.document.querySelectorAll(Selector))
    const scripts = Array.from(dom.window.document.querySelectorAll('script'))
    const styles = Array.from(dom.window.document.querySelectorAll('style'))
    params.dom = dom
    params.sources = sources
    handlerSource(params)
    queryString.html.script && handlerInline(params, scripts)
    queryString.html.style && handlerInline(params, styles)

    let outerHTML = dom.window.document.documentElement.outerHTML
    const isDoctype = new RegExp('^' + DOCTYPE).test(content)
    if (isDoctype) outerHTML = DOCTYPE + outerHTML

    writeFileSync(html, outerHTML)
  }
}
