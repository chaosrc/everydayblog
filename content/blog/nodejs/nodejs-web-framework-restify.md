---
title: Node.js Web 框架之 Restify
date: 2019-07-05
---

## Node.js Web 框架之 Restify



Restify Web 服务框架，专门针对构建语义正确的 RESTful Web 服务进行了优化，可以大规模地用于生产[^1]



#### 安装

```bash
$ npm install restify
```



#### 创建 Web 服务

```javascript
const restify = require("restify")

const server = restify.createServer()

server.get("/home", (req, res, next) => {
  res.send("This is home page\n")
})

server.listen(8804, () => console.log("Restify server start at 8804"))
```

curl 访问

```bash
$ curl -is localhost:8804/home -H "accept: text/plain"
HTTP/1.1 200 OK
Server: restify
Content-Type: text/plain
Content-Length: 17
Date: Fri, 05 Jul 2019 15:36:40 GMT
Connection: keep-alive

This is home page
```



#### 添加路由

Restify 路由类似于 Express，用 HTTP 动词和参数化的 URL 来定义路由的处理函数

```javascript
function handleResponse(req, res, next) {
  res.send(`Hello ${req.params.name}`)
  return next()
}

server.post("/home/:name", handleResponse)
server.head("/home/:name", handleResponse)
```


使用 URL 参数访问

```bash
$ curl localhost:8804/home/foo -X POST
"Hello foo"

$ curl -is localhost:8804/home/foo -X HEAD
HTTP/1.1 200 OK
Server: restify
Date: Fri, 05 Jul 2019 16:09:16 GMT
Connection: keep-alive
```



#### 路由版本化

大部分的 RESTful API 都趋向于版本化，Restify 中通过在 header 中添加`Accept-Version`支持 [semver](https://semver.org/) 版本规范

```javascript
function handleUserV1(req, res, next) {
  res.send(`name: ${req.params.name}`)
  return next()
}
function handleUserV2(req, res, next) {
  res.send(`NAME: ${req.params.name}`)
  return next()
}
server.get(
  "/user/:name",
  restify.plugins.conditionalHandler([
    { version: "1.0.5", handler: handleUserV1 },
    { version: "2.1.0", handler: handleUserV2 },
  ])
)
```
上面定义了两个版本的`handleUser`方法，通过Restify 的 `conditionalHandler` 插件控制版本

```bash
$ curl -H "Accept-Version: ~1" localhost:8804/user/sandy
"name: sandy"

$ curl -H "Accept-Version: ~2" localhost:8804/user/sandy
"NAME: sandy"

# 如果不指定版本号默认选择最高的版本号
$ curl localhost:8804/user/sandy
"NAME: sandy"
```




Restify 以建立正确的 RESTful Web 服务为目标，规范化 RESTful Web 服务的开发，使得开发流程变得简单，同时支持 WebSocket、错误处理、插件等功能





[^1]: http://restify.com/
