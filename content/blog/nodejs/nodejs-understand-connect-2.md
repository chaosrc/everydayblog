---
title: Node.js Web 之深入了解 Connect 中间件（二）
date: 2019-07-10
---



## Node.js Web 之深入了解 Connect 中间件（二）



上一篇中介绍了 Connect 中间件的工作机制，本篇继续介绍如何组合中间件、中间件的顺序以及创建可配置的中间件



#### 组合中间件

Connect 中使用 use 方法来组合中间件。首先定义两个中间件 `logger` 和 `helloConnect`

```js
function logger(req, res, next) {
    console.log(req.url, req.statusCode)
    next()
}

function helloConnect(req, res) {
    res.end('hello connect')
}
```
`helloConnect` 中没有 `next` 是因为它在里面完成了 HTTP 响应，不需要再往下调用中间件

组合 `logger` 和 `helloConnect`
```js
app.use(logger)
   .use(helloConnect)
   .listen(8806)
```

`use` 函数返回 Connect 实例，支持链式调用



#### 中间件的顺序

中间件的调用会对程序的行为产生很大的影响，如果漏掉 `next` 的调用后面的中间件不会调用，会使本次响应无法正常返回

比如改变上面的中间件调用顺序，先调用 `helloConnect` 再调用 `logger`

```js
app.use(helloConnect)
   .use(logger)
   .listen(8806)
```

访问 localhost:8806 能正常返回‘hello connect’。以下两次中间件的执行顺序，左边是第一次，右边是第二次


![](https://s2.ax1x.com/2019/07/11/Zg5Fnx.png)



### 创建可配置的中间件

为了达到中间件的可复用性、通用性，需要创建可配置的中间件

可配置的中间件的原则是定义一个函数返回另一个函数，返回的这个函数是一个中间件，基本结构如下

```js
function setupLogger(option) {
    // 处理配置逻辑
    return function logger(req, res, next) {
        // 处理中间件逻辑
    }
}
```

使用可配置的中间件

```js

app.use(setupLogger(option))

```

接下来会使用一个例子来演示如何构建一个可配置的中间件



创建一个静态文件服务的中间件

```js
function static(req, res, next) {
    const staticDir = path.join(__dirname, '/public')
    const staticURLPath = '/static'
    const urlPath = req.url.split('?')[0]

    if (!urlPath.startsWith(staticURLPath)) {
        next()
    }

    const filepath = path.join(staticDir, urlPath.slice(staticURLPath.length))

    const stream = fs.createReadStream(filepath)

    stream.pipe(res)
}

app.use(static)
```
在项目目录下建立 public 文件夹添加 index.html 文件
```html
<!-- index.html -->
<p>hello static</p>
```

访问 localhost:8806/static/index.html
```bash
$ curl localhost:8806/static/index.html
<p>hello static</p>
```


当前 `static` 中间件请求 url 和本地文件路径都是固定的，无法在其他项目中复用

创建一个静态文件服务的中间件，使得请求 url 和本地文件路径可配置

```js
function setupStatic(staticURLPath, staticDir) {
    return function static(req, res, next) {
        // const staticDir = path.join(__dirname, '/public')
        // const staticURLPath = '/static'
        const urlPath = req.url.split('?')[0]
    
        if (!urlPath.startsWith(staticURLPath)) {
            next()
            return
        }
    
        const filepath = path.join(staticDir, urlPath.slice(staticURLPath.length))
        console.log('filepath',filepath, staticDir, urlPath)
        const stream = fs.createReadStream(filepath)
    
        stream.pipe(res)
    }
}

app.use(setupStatic('/static', path.join(__dirname, '/public')))
```
`setupStatic` 成为了可配置中间件，通过传人不同的路径参数来映射不同的文件夹，可以在其他地方复用这段代码

整个 Connect 社区都在使用可配置中间件的概念，Connect 的核心中间件都是可配置的[^1]




#### Connect 的错误处理中间件

Connect 中错误处理中间件比常规的中间件多了一个错误对象，Connect 的两种错误处理模式：默认错误处理器和自行处理


默认错误处理器

```js
app.use((req, res) => {
    foo()
})
```
`foo` 方法没有定义, Connect 默认会返回500状态码


自行处理错误

```js
function handleError(err, req, res, next) {
    res.end('server error')
}
app.use(handleError)
```

错误处理中间件必须有4个参数err, req, res, next，程序发生错误时，Coonect 会跳过其他中间件，直接调用错误处理中间件

访问 localhost:8806
```bash
$ curl localhost:8806
server error
```





[^1]:《Node.js实战第二版》第六章 深入了解 Connect 和 Express









