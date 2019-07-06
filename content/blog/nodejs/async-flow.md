---
title: Node.js的异步流程控制以及串行流程的实现
date: 2019-06-28
description: Node.js的异步流程控制以及串行流程的实现
---

## Node.js的异步流程控制以及串行流程的实现



> 在异步程序的执行过程中，有些任务可能随时发生，根程序中其他部分在做什么没关系，什么时候做这些任务都不会出问题。但是也有一些任务只能在某些特定的任务之前或之后执行

Node.js 中有两类异步流程控制：**串行**和**并行**

串行流程
![](https://s2.ax1x.com/2019/06/29/ZQEBI1.png)

并行流程
![](https://s2.ax1x.com/2019/06/29/ZQElan.png)

串行的异步流程形式上和同步逻辑类似，但是每个任务都是异步执行的


#### 串行流程的实现

使用串行流程实现以下功能：

- 从文件中读取 RSS 源
- 下载 RSS 源数据
- 展示 RSS 预定源中的标题和 URL

创建项目并安装`request`、`htmlparser`依赖

```bash
$ npm init -y
$ npm install --save request request-promise htmlparser
```

创建 RSS 预定源文件

```bash
$ echo 'http://blog.nodejs.org/feed' >> rss.txt
```

引人依赖

```javascript
const fs = require("fs").promises
const request = require("request-promise")
const htmlparser = require("htmlparser")
```

检查 RSS 文件是否存在

```javascript
// 检查文件是否存在
async function checkRSSFile(path) {
  let stat = await fs.stat(path)
  return stat.isFile()
}
```

从 RSS 源文件中随机读取一个 RSS 源

```javascript
// 从RSS源文件中随机读取一个RSS源
async function readRSS(path) {
  const text = await fs.readFile(path)
  const rssList = text.toString().split("\n")

  const random = Math.floor(Math.random() * rssList.length)

  return rssList[random].trim()
}
```

获取 RSS 源数据

```javascript
async function downloadRSS(url) {
  const res = await request(url)
  return res
}
```

解析 RSS 源数据

```javascript
async function parseRSSHTML(html) {
  const handler = new htmlparser.RssHandler()
  const parse = new htmlparser.Parser(handler)

  parse.parseComplete(html)

  if (!handler.dom.items.length) {
    return new Error("No RSS item")
  }
  let item = handler.dom.items.shift()
  console.log(item.title)
  console.log(item.link)
}
```

前面的每一个`async`方法都是异步执行的

通过`await`来串行执行异步函数

```javascript
async function start() {
  let path = "./rss.txt"
  try {
    const isFile = await checkRSSFile(path)
    if (!isFile) {
      console.log(`${path} no file`)
    }

    const url = await readRSS(path)

    const html = await downloadRSS(url)

    await parseRSSHTML(html)
  } catch (error) {
    console.error(error)
  }
}

start()
```

执行结果
```bash
$ node index.js
![CDATA[Node v12.5.0 (Current)]]
https://nodejs.org/en/blog/release/v12.5.0 
```
获取到了RSS源(<http://blog.nodejs.org/feed>)数据并展示了其中的第一条数据

下一篇演示并行流程