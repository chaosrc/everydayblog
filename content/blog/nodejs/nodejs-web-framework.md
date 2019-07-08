---
title: Node.js Web 框架比较
date: 2019-07-03
description: 对比了几种常见的 Node.js Web 框架的优缺点以及使用场景
---

## Node.js Web 框架比较




当我们开始构建 Web 服务器时，首先要选择一个适合的框架，各个框架有不同的优缺点以及应用场景，在选择之前最好了解一下常见的框架，以做出最好的选择。接下来会简单介绍以下几个 Web 框架：

- Koa
- Hapi
- Sails
- Restify
- Nest




#### Koa

> [Koa](https://koajs.com/) 被定义为下一代 Node.js Web 框架。由 Express 团队打造，使用 aysnc 函数来替换回调，并且增强了错误处理，能够优雅的编写服务端应用程序[^1]

安装

```bash
$ npm i koa
```

创建 Web 服务

```javascript
const Koa = require("koa")

const app = new Koa()

app.use(ctx => {
  ctx.body = "hello koa\n"
})

app.listen(8801)
```

访问

```bash
$ curl localhost:8801
hello koa
```

添加中间件
Koa 通过 async 函数来达到“真实”的中间层[^1]。

Koa 中间件的洋葱圈模型
![](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

以两个中间件 logger 和 response time 为例

```javascript
// logger
app.use(async (ctx, next) => {
  await next()
  const responseTime = ctx.response.get("X-Response-Time")
  console.log(ctx.req.url, responseTime)
})

// response time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const time = Date.now() - start
  ctx.response.set("X-Response-Time", time)
})

app.use(async ctx => {
  await sleep(100)
  ctx.body = "hello koa\n"
})

app.listen(8801)
```

其中 logger 中间件用来打印响应时间 X-Response-Time， response time 中间件用来计算每次请求的响应时间。请求会先经过 logger 调用`next()`进入 response time，记录开始时间，再进入 http 响应的处理逻辑，完成后再回到 response time 中间件记录结束时间，最后在回调 logger 中间件打印响应时间字段

访问

```bash
$ curl curl localhost:8801/index
hello koa
#服务端log
/index 105
```

总结：
Koa 简单小巧但是功能强大，结合 async 函数解决了回调地狱问题。因为其极简的设计模式，很多功能需要通过插件实现，使用要求比较高





#### Hapi

用于构建应用程序和服务的丰富框架，让开发人员专注于编写可复用的应用逻辑，而不是把时间花在构建基础架构[^2]


- 安装

```bash
$ npm install @hapi/hapi
```


- 创建 Web 服务

```javascript
const Hapi = require("@hapi/hapi")

// 创建服务
const init = async () => {
  const server = Hapi.server({
    port: 8803,
    host: "localhost",
  })
  await server.start()
  console.log("Hapi server run in localhost:", 8803)
}

// 异常处理
process.on("unhandledRejection", err => {
  console.error(err)
  process.exit(1)
})

init()
```


- 添加路由

与 Koa 极简模式不同，Hapi 自带了路由、认证、Cookies 等模块

```javascript
...
// 创建服务
const init = async () => {
    const server = Hapi.server({
        port: 8803,
        host: 'localhost'
    })
    // 添加路由
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello Hapi\n'
        }
    })
    // 异常处理
    await server.start()
    console.log("Hapi server run in localhost:", 8803)
}
...
```

Hapi 路由的 handler 方法的返回值会被当作请求响应，可以是字符串、JSON、Buffer、Stream 以及 Promise


- 使用 Cookies

在 state 方法中设置 cookies 的名字

```javascript
server.state("token")
```

在路由中设置 Cookies 的值

```javascript
server.route({
  method: "GET",
  path: "/login",
  handler: (request, h) => {
    // 设置 Cookies 值
    h.state("token", "AGYHU7644")

    return h.response("Login success")
  }
})
```


- 访问
```bash
$ curl -I localhost:8803/login
```

![](https://s2.ax1x.com/2019/07/05/ZaFsUK.png)


- 总结

相对于 Koa 框架自带了一套完整的 Web 开发体系，同时其完善的插件体系也带来了很好的灵活性





[^1]: https://koa.bootcss.com/
[^2]: https://hapijs.com/
