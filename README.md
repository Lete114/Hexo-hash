## 简介

> 如果觉得还不错，可以给个 star✨ 支持一下 😊

为页面的静态资源添加 hash 版本号，主要用途于让客户端主动获取最新资源，防止使用强制缓存的旧资源

假设你使用 http 强制缓存，当你的静态资源发生变化时，用户无法获得最新的资源，用户可以通过清理缓存来获得最新的资源，但这样会清理所有的缓存，插件会对文件内容生成一个哈希值来控制版本，当内容发生变化时，url 地址会发生变化，不用清理所有缓存，就可以获得最新的资源了

## 安装

```bash
npm install hexo-hash --save
```

## 添加配置信息

> 注意只对html文件进入的资源进行处理，其它文件如css文件中使用的`background: url()`引入的不做hash处理

> 这些功能只有你需要自定义的时候才会用到
> 如果不写配置，则使用默认的配置(会对所有资源生成 hash)

在 hexo 的配置文件中添加配置(以下配置示例为默认配置)

```yml
# Hexo-hash
# https://github.com/Lete114/Hexo-hash
hash:
  enable: true                              # 是否启用
  size: 10                                  # 生成的hash长度，最大32
  versionKey: v                             # 自定义版本号key，如: ?v=6faed3522c
  lazy: src                                 # 如果你的博客使用了图片来加载可以自定义源图片的img属性，如 data-src 或 lazy-src 等
  relative: false                           # 是否处理相对路径的资源(存在误注入的可能)
  html: true                                # 是否启动对 html 文件的 script | link | img 标签的引用进行 hash 注入(稳定)
  queryString:                              # 使用查询字符串的方式匹配(不稳定，存在误注入的可能)
    js: true                                # 匹配 js 文件内符合条件的内容进行 hash 注入
    css: true                               # 匹配 css 文件内符合条件的内容进行 hash 注入
    html:                          
      style: true                           # 匹配 html 文件中 style 标签中的css样式进行 hash 注入(内联)
      script: true                          # 匹配 html 文件中 script 标签中的js进行 hash 注入(内联)
```
