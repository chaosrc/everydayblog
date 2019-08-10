---
title: Node.js 分享
date: 2019-08-04
---

## Node.js 简介以及使用



#### 起源
Ryan Dahl 2009 年创建

![](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Ryan_Dahl.jpg/440px-Ryan_Dahl.jpg)

2012 年离开 Node.js 社区, 2018年创建 [Deno](https://github.com/denoland/deno)




#### Node.js 组成
![](https://image.slidesharecdn.com/nodejs-140507132306-phpapp02/95/nodejs-code-tracing-2-638.jpg?cb=1427946166)
<span style="display: none">
![](https://www.researchgate.net/profile/Rainer_Poeschl/publication/282847216/figure/fig5/AS:606912362061826@1521710591440/Architecture-of-Nodejs.png)
![](https://imelgrat.me/wp-content/uploads/2018/12/Node-Application-Runtime.png)
</span>


- V8
由 Google 为 Chrome 开发的Javascript 引擎，核心工程师 Lars Bak 之前在 Sun公司研究Java 虚拟机，产出了 HotSpot 

Javascript 引擎的执行速度

![](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2017/02/01-01-perf_graph05.png)

V8特点
1. JIT（Just-In-Time）编译，也就是即时编译，通过监听高频运行的代码，保存编译其结果进行优化，大大提供 Javascript 的运行速度 （后来的 Javascript 都支持了 JIT） 
2. 垃圾回收， V8的垃圾回收借鉴了 Java VM 的精确垃圾回收管理，垃圾回收的效率远远高于其他引擎
3. 其他优化，内联缓存提高属性访问、隐藏类对动态添加类属性的优化
4. 遵循 ECMAScript，紧根 ECMAScript 最新标准，支持最新的语法




- libuv
![](https://raw.githubusercontent.com/libuv/libuv/master/img/banner.png)
libuv 是一个专注与异步 I/O 的跨平台库，由 Ryan Dahl 为 Node.js 编写，libuv 由事件循环和线程池组成，负责所有 I/O 任务的分发与，也用于Luvit, Julia, pyuv等平台。




#### Node.js 的特点

- 非阻塞异步 I/O 模型
- 事件驱动

比如读取文件
```js
const fs = require('fs')

fs.readFile('./package.json', (err, data) => {
    console.log(data.toString())
})
```

回调的问题，回调地狱
```js
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```
使用 async/await

```js
async function start() {
    const value1 = await step1()
    const value2 = await step2(value1)
    const value3 = await step3(value2)
    const value4 = await step3(value3)
}
```


使用事件监听
```js
// 文件index.js

// 引入net模块
const net = require("net")

const server = net.createServer(socket => {
  //监听data事件
  socket.on("data", handleDataReceive)

  //处理data事件的方法
  function handleDataReceive(data) {
    socket.write(`server: ${data.toString()}`)
  }
})

server.listen(8801)
```
socket 是一个事件发射器，当用户发送数据时会触发socket的data事件，在data事件中注册了函数handleDataReceive来处理data事件




#### Node.js 应用场景
- 跨平台桌面应用：使用electron/nw.js等框架, Node.js与操作系统互交提供统一的api，浏览器作为UI展示
- 前端工程化：React\Vue\Angular等主流框架使用的webpack/gulp等打包编译
- 打包工具，使用Node.js构建
Web应用开发：io密集型web应用，为前端提供Api接口

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-05-17%2007.25.05.png)




#### 使用 Node.js

创建一个 index.js 文件
```js
const http = require('http')

const server = http.createServer((request, response) => {
    response.end('hello node')
})

server.listen(8080)
```
运行 node index.js 运行
```bash
$ node index.js

$ curl http://localhost:8080
hello node
```

- 安装依赖

Node.js 中自带包管理工具 npm
```bash
$ npm -v
6.9.0
```
安装 express

```js
$ npm install express
```

```js
const express = require("express")

const app = express()

const port = process.env.PORT || 8800

app.get("/", (req, res) => {
  res.send("Hello world \n")
})
app.listen(port, () => console.log(`Server start at localhost:${port}`))
```

```bash
$ npm start
Server start at localhost:8800
```











