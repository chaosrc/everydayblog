---
title: Node.js异步控制流程之并行流程
date: 2019-06-29
description:
---

## Node.js 的并行流程控制

并行流程任务不需要一个接着一个安顺序执行，任务之间的开始时间和结束时间不会相互影响，但是必须等所有任务执行完成后才能执行后面的逻辑。比如同时下载多个文件，全部下载完成后再打包成一个文件，那么必须等所有文件下载完成后才能打包，但每个文件下载完成的时间可能都不一样

#### 并行流程的实现

通过一个简单的例子来看并行流程的实现：

- 异步读取某个文件夹下面所有文件
- 统计每个文件中的字数
- 计算总字数

定义全局变量记录任务状态

```javascript
const fs = require("fs")
const path = require("path")
// 总的任务数
let totalTasks = 0
// 已完成任务数
let compeleteTasks = 0
// 总的字数
let totalWordCount = 0
```

检查是否所有任务已经完成

```javascript
function isCompelete() {
  return compeleteTask === totalTask
}
```

读取文件夹下的所有文件

```javascript
function readDir(dir, cb) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err
    }
    cb(files.map(file => path.join(dir, file)))
  })
}
```

异步读取单个文件，统计字数，判断是否所有任务已经完成

```javascript
function countFile(filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err
    }

    const count = data
      .toString()
      .trim()
      .split(/\s+/).length

    console.log(filePath, count)

    totalCount += count
    compeleteTask++

    if (isCompelete()) {
      console.log("total", totalCount)
    }
  })
}
```

并行计算逻辑：读取 count 文件夹下的所有文件，`forEach`循环，并行计算文件中字数

```javascript
function start(dir) {
  readDir(dir, fileList => {
    totalTask = fileList.length
    fileList.forEach(countFile)
  })
}
start("./count")
```

执行结果

```bash
$ node index.js
count/channel.js 85
count/index.js 23
total 108
```

使用回调实现并行流程不容易理解而且比较复杂，Node.js 社区一直在探索更好的方式，从 Promise、Generator 到 Async 函数。[^1]

![](https://static.cnodejs.org/FowNmdNw00ghB3PxKtMz9ajo2i5c)

当前 Async 函数已经成为主流，但是底层还回调实现，所以回调也是 Node.js 中必须掌握的技巧之一

以下是同样的功能 async 函数的实现方式

```javascript
const fs = require("fs").promises
const path = require("path")

async function readDir(dir) {
  let fileList = []
  const files = await fs.readdir(dir)

  for (let file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      const subFileList = await readDir(filePath)
      fileList = fileList.concat(subFileList)
    } else {
      fileList.push(filePath)
    }
  }
  return fileList
}

async function countFile(filePath) {
  const data = await fs.readFile(filePath)
  const count = data
    .toString()
    .trim()
    .split(/\s+/).length
  return {
    filePath,
    count,
  }
}

async function start(dir) {
  try {
    const fileList = await readDir(dir)
    const counts = await Promise.all(fileList.map(file => countFile(file)))
    const totalCount = counts.reduce((sum, val) => (sum += val.count), 0)

    counts.forEach(count => console.log(`${count.filePath}: ${count.count}`))
    console.log(`total: ${totalCount}`)
  } catch (error) {
    console.log(error)
  }
}
start("./count")
```

[^1]: https://cnodejs.org/topic/5ab3166be7b166bb7b9eccf7
