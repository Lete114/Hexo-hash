## 简介

> 如果觉得还不错，可以给个 star✨ 支持一下 😊

页面的静态资源添加 hash 版本号

假如你使用 HTTP 缓存(7 天)来缓存你的静态资源，例如`css`、`js`、`png`等等

这时你给你的 css 修改了样式，并重新部署到了服务器上，而由于使用了 HTTP 缓存的缘故，客户端不能不能及时使用到最新的 css 样式，只能等到 7 天后(可手动清理缓存)缓存过期才能请求最新的 css 样式

问：有没有办法可以让资源发生变化后，主动获取最新的资源呢？
答：本仓库就是为了实现该功能所编写的

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
  ignoreSuffix: []                          # 指定忽略生成hash的文件
  ignoreDir: []                             # 忽略指定目录内的文件
```