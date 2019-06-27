---
title: Node.js中的异步编程以及回调的使用
date: 2019-06-26
description: Node.js中的两种异步编程方式回调、事件监听的介绍以及回调的使用
---

## Node.js 中的异步编程



Node.js 中异步编程是通过**事件**触发响应逻辑，在 Node.js 的世界里流行两种响应逻辑：回调和事件监听

- **回调**通常用来处理一次性响应逻辑，比如对于数据库的查询，可以指定一个回调来处理查询结果
- **事件监听**本质上也是一个回调，不同的是它是和事件关联的，比如在 Node.js 中有 HTTP 请求过来时，会发送 request 事件，我们可以监听 request 事件并且添加回调，每次有请求过来时都会调用这个回调函数，比如：

```javascript
// 定义回调函数
function handleRequest(res) {
  console.log(res)
}
// 监听request事件并添加回调
server.on("request", handleRequest)
```


#### 使用回调

**回调**是一个函数，它被当作参数传给异步函数，用来处理异步完成之后要做的操作

下面通过一个简单的 HTTP 服务器演示回调，实现如下功能：

- 异步获取文件中文章的标题
- 异步获取 HTML 模版
- 把标题插入到 HTML 中
- 发送 HTML 给用户

```javascript
// 文件index.html
const http = require("http")
const fs = require("fs")

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 读取标题
  readTitle(res)
})

// 监听端口
server.listen(8888)

// 读取标题
function readTitle(res) {
  fs.readFile(__dirname + "/titles.json", (err, data) => {
    if (err) {
      console.log(err)
      res.end("Read title error")
    } else {
      // 生成HTML
      generateHTML(JSON.parse(data.toString()), res)
    }
  })
}

// 生成HTML
function generateHTML(titles, res) {
  fs.readFile(__dirname + "/temp.html", (err, data) => {
    if (err) {
      console.log(err)
      res.end("Read HTML error")
    } else {
      let html = data.toString()

      html = html.replace(
        /{title}/,
        titles.map(title => `<li>${title}</li>`).join("")
      )

      res.writeHead(200, { "Content-Type": "text/html" })

      res.end(html)
    }
  })
}
```

```JSON
// titles.json
[
    "Typescript(一)：基本类型",
    "Typescript(二)：接口",
    "Typescript(三)：接口的实现和继承",
    "Typescript系列(四)：类型别名以及交叉类型、联合类型"
]
```

```html
<!-- 文件temp.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <h3>文章标题</h3>
    <ul>
      {title}
    </ul>
  </body>
</html>
```

每次读取文件都是异步，再回调方法中处理读取文件的结果，在读取标题的回调中去读取 HTML 文件，再在读取 HTML 回调中给 HTML 插入标题，并发送给用户

运行
```bash
$ node inex.js
```
在浏览器中访问 http://localhost:8888/

![](https://s2.ax1x.com/2019/06/27/Zm00wq.png)



下一篇将会演示异步中的事件监听
