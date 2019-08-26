---
title: Node.js 日志中间件 morgan
date: 2019-08-25
---

## Node.js 日志中间件 morgan

morgan 是一个 Node.js 日志中间件，下面将介绍如何使用 morgan




#### 基本使用

```js
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.end('Hello World')
})

app.listen(8001)
```
上面的代码创建了一个 express web 服务，使用 morgan 中间件打印每一次请求的日志

调用`morgan(format, options)` 方法会创建一个日志中间件，参数 format 可以是内置的格式化输出，也可以自定义格式化输出




#### 内置格式化输出

- tiny

```js
morgan('tiny')
```
格式为
```js
:method :url :status :res[content-length] - :response-time ms
```
输出
```bash
::1 - - [25/Aug/2019:10:21:44 +0000] "GET / HTTP/1.1" 200 - "-" "curl/7.54.0"
```

- combined

标准的 Apache combined 输出

```js
morgan('combined')
```
格式
```bash
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```

输出

```bash
::1 - - [25/Aug/2019:10:55:38 +0000] "GET / HTTP/1.1" 200 - "-" "curl/7.54.0"
```

- combined

标准的 Apache common 输出

```js
morgan('common')
```
格式
```bash
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
```

输出

```bash
::1 - - [25/Aug/2019:10:58:30 +0000] "GET / HTTP/1.1" 200 -
```



#### 将日志输出到文件

```js
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const app = express()

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'))

app.use(morgan('common', {stream: logStream}))

app.get('/', (req, res) => {
    res.end('Hello World')
})

app.listen(8001)
```

上面的代码创建了一个 WriteStream 对象，设置 morgan 输出到 WriteStream，每一次请求日志将输出至 access.log 文件

```bash
$ cat access.log 
::1 - - [25/Aug/2019:11:15:24 +0000] "GET / HTTP/1.1" 200 -
::1 - - [25/Aug/2019:11:15:26 +0000] "GET / HTTP/1.1" 200 -
```



#### 日志分割

前面设置了日志输出至文件但是随着日志的增加文件体积会越来越大，使用 `rotating-file-stream` 模块可以将日志输出按日期分割

```js
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')

const app = express()

const logStream = rfs('access.log', {
    interval: '1d', // 设置日志按日分割
    path: path.join(__dirname, 'logs')
})

app.use(morgan('common', {stream: logStream}))

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.end('Hello World')
})

app.listen(8001)
```

通过配置 `rotating-file-stream` 的 `interval` 参数设置日志分割的时间，`path` 指定日志文件的存储位置





