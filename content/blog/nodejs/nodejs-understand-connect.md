---
title: Node.js Web 之深入了解 Connect 中间件（一）
date: 2019-07-09
---



## Node.js Web 之深入了解 Connect 中间件（一）



> connect 是一个基于 HTTP 服务器的工具集，它提供了一种新的组织代码的方式来与请求和响应对象进行交互，称为中间件（书上原话）。通俗的来说，http 创建服务器接收请求时，所有的响应都要写在一个回调函数里面，对于不同的请求路径，所返回的响应信息都是通过 if 和 else 来区分，所有的逻辑都是在一个函数中，当逻辑复杂起来会有各种回调，极容易出现问题，故有了让问题简单起来的 connect 中间件的产生，connect 把所有的请求信息都拆分开，形成多个中间件，http 请求就相当于是水流一样流过中间件，当路径相同时，就会响应该请求，否则就继续往下流，直到结束。中间件就是函数组成的。[^1]




#### 安装

```bash
$ npm install connect
```



#### 创建 Connect Web 程序

```js
const Connect = require("connect")

const app = Connect()
app.use((req, res, next) => {
  res.end("hello connect")
})

app.listen(8806)
```
传给 `app.use()` 的为中间件函数，处理 HTTP 响应。一个 Connect Web 程序就是由很多个中间件函数组成。


根据中间件在整个http处理流程的位置，可将中间件大致分为三类[^2]：
- Pre-Request 通常用来改写request的原始数据
- Request/Response 大部分中间件都在这里，功能各异
-  Post-Response 全局异常处理，改写response数据等

![](https://files.cnblogs.com/luics/connect-middleware.zip)




#### 了解 Connect 中间件的机制

Connect 中间件就是一个 Javascript 函数，它接受请求对象（Request）、响应对象（Response）以及 回调函数 next，一个中间件执行完成后如果要继续往下执行后续的中间件，就可以调用 next 函数[^3]。

在中间件执行之前，Connect 中的分派器（Dispatcher）会接管请求，然后开始执行第一个中间件，再依次执行后续的中间件。

```js
...
const app = Connect()
app.use(logger)
   .use(bodyParser)
   .use((req, res, next) => {
      res.end("hello connect")
    })
...

```

执行流程

![](https://s2.ax1x.com/2019/07/10/Z6dP4e.png)

- Dispatcher 接受到请求，将请求传给第一个中间件
- 调用 logger 中间件打印日志，logger 中调用 next()，将请求传给下一个中间件
- bodyParser 中间件解析请求的 body，调用 next() 将请求继续传给下一个中间
- 最后一个中间件处理响应，结束请求，不在调用 next()

Connect 通过中间件组合具有非常大的可扩展性，能够轻松实现复杂的逻辑




[^1]: https://www.cnblogs.com/aicanxxx/p/7132427.html

[^2]: https://www.cnblogs.com/luics/archive/2012/11/28/2775206.html

[^3]: 《Node.js实战第二版》第六章 深入了解 Connect 和 Express

