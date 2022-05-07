## 简介

> 如果觉得还不错，可以给个 star✨ 支持一下 😊

为页面的静态资源添加 hash 版本号，主要用途于让客户端主动获取最新资源，防止使用强制缓存的旧资源

假设你使用 http 强制缓存，当你的静态资源发生变化时，用户无法获得最新的资源，用户可以通过清理缓存来获得最新的资源，但这样会清理所有的缓存，插件会对文件内容生成一个哈希值来控制版本，当内容发生变化时，url 地址会发生变化，不用清理所有缓存，就可以获得最新的资源了

## 安装

```bash
npm install hexo-hash --save
```

## 添加配置信息

> 这些功能只有你需要自定义的时候才会用到
> 如果不写配置，则使用默认的配置(会对所有资源生成 hash)

在 hexo 的配置文件中添加配置(以下配置示例为默认配置)

```yml
# Hexo-hash
# https://github.com/Lete114/Hexo-hash
hash:
  enable: true                              # 是否启用
  size: 10                                  # 生成的hash长度，最大32
  version: v                                # 自定义版本号key，如: ?v=6faed3522c
  relative: false                           # 是否为相对路径的资源注入hash版本
  injectSuffix: ['.html', '.css', '.js']    # 指定为哪些文件注入hash版本
  suffix: []                                # 指定生成hash的文件后缀
  ignoreSuffix: ['.html']                   # 指定忽略生成hash的文件后缀
  ignoreDir: []                             # 忽略指定目录
```
