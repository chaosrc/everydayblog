---
title: Node.js简介
date: 2019-06-23
time: 22:20 - 00:20
description: 什么是Node.js以及Node.js的非阻塞I/O模型、事件驱动、应用场景
---

## Node.js简介
> Node.js 不是一门语言也不是框架，它只是基于 Google V8 引擎的 JavaScript 运行时环境，同时扩展了 JavaScript 功能，使之支持 io、fs 等只有语言才有的特性。[^1]

### 非阻塞 I/O 模型

> Node.js使用事件驱动（event-driven），非阻塞 I/O 模型（non-blocking I/O model），使得它具有高效和轻量级特点。[^2]

对于web应用来说网络访问、文件读取这些io操作往往是相对较慢的，如果采用同步的方式就会阻塞新的请求，Node.js中采用异步的方式进行io操作，耗时的操作交给另外的线程去做，操作完成后通过事件驱动会调Node.js，同时空闲的Node.js可以用来处理新的请求


### 事件驱动

Node.js是单线程运行的，通过一个事件循环来执行消息队列，当涉及到I/O操作的时候，nodejs会开一个独立的线程来进行异步I/O操作，操作结束以后将消息推入消息队列[^3]

一个简单的例子

```javascript
console.log('start')

setTimeout(function (){
    console.log('async')
}, 1000)

console.log('end')
```
执行结果为：
```
start
end
async
```
先同步执行'start'，然后异步执行setTimeout，1秒钟后将方法推送到消息队列，同步执行'end'，开始事件循环，setTimeout的消息推送后执行'async'


### Node.js的应用场景

- 跨平台桌面应用：使用electron/nw.js等框架, Node.js与操作系统互交提供统一的api，浏览器作为UI展示
- 前端工程化：React\Vue\Angular等主流框架使用的webpack/gulp等打包编译打包工具，使用Node.js构建
- Web应用开发：io密集型web应用，为前端提供Api接口

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-05-17%2007.25.05.png)




参考：

[^1]: https://github.com/i5ting/How-to-learn-node-correctly

[^2]: https://nodejs.org/en/

[^3]: https://segmentfault.com/a/1190000005173218



