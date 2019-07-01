---
title: Node.js Web程序之搭建 RESTful Web 服务
date: 2019-06-30
description: 搭建 RESTful Web 服务
---

## 搭建 RESTful Web 服务



本文内容：

- 创建一个 Node.js Web 程序
- 搭建 RESTful 服务



#### 了解 Node.js Web 程序的结构[^1]

通常 Node.js 程序的目录如下：

- package.json —— 包含程序的依赖列表和程序的运行脚本
- public/ —— 静态资源文件夹，用来存放 CSS 和客户端 Javascript
- node_modules/ —— 用来存放项目的依赖
- app.js 或 index.js —— 程序的启动代码
- models/ —— 数据库模型
- views/ —— 页面的渲染模版
- controllers/ 或 routers/ —— HTTP 请求处理器
- middleware/ —— 中间件组件

这个目录只是一个参考，可以按照自己的需求或者喜好进行命名和组织



#### 创建一个 Web 程序

创建一个 Node.js 项目

```bash
$ mkdir node-start
$ cd node-start
$ npm init -y
```

安装 express 模块

```
$ npm install express
```

express 基于 Node.js 平台的快速(fast)、开放(unopinionated)、极简(minimalist)的 Web 开发框架, 很多流行的开发框架都是基于 express 构建的[^2]



#### 写一个 Hello World 服务器

```typescript
import express from "express"

const app = express()

const port = process.env.PORT || 8800

app.get("/", (req, res) => {
  res.send("Hello world \n")
})
app.listen(port, () => console.log(`Server start at localhost:${port}`))
```
运行
```
$ npm start
Server start at localhost:8800
```
访问 localhost:8800
```bash
$ curl localhost:8800
Hello world
```


#### 搭建 RESTful Web 服务

实现以下功能：
- POST /articels —— 创建文章
- GET /articels/:id —— 根据id获取文章
- GET /articels —— 获取所有文章
- DELETE /articels/:id —— 根据id删除文章

先不考虑数据的存储，先实现以上路由接口，再逐步加入数据库以及前端页面

```typescript
import express from "express";

const port = process.env.PORT || 8800;
const app = express();
const articels = [
  { title: "Node.js异步编程之事件监听" },
  { title: "Node.js异步控制流程之并行流程" }
];

app.get("/articles", (req, res) => {
  res.send(articels);
});

app.post("/articles", (req, res) => {
  res.end("success \n");
});

app.get("/articles/:id", (req, res) => {
  const id = req.params.id;
  res.send(articels[id]);
});

app.delete("/articles/:id", (req, res) => {
  const id = req.params.id;
  delete articels[id]
  res.send('Delete success \n');
});

app.listen(port, () => console.log(`Server start at localhost:${port}`));

```

运行
```bash
$ npm start
Server start at localhost:8800
```

访问
```bash
$ curl localhost:8800/articles
[{"title":"Node.js异步编程之事件监听"},{"title":"Node.js异步控制流程之并行流程"}]

$ curl localhost:8800/articles/1
{"title":"Node.js异步控制流程之并行流程"}

$ curl -X POST localhost:8800/articles
success 

$ curl -X DELETE localhost:8800/articles/0
Delete success

```

下一步就是给 Web 程序添加数据库




[^1]: 《Node.js 实战（第 2 版）》第 45 页

[^2]: https://expressjs.com/
