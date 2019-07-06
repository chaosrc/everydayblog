---
title: Node.js Web 框架之 Sails
date: 2019-07-06
---



## Node.js Web 框架之 Sails

![](https://sailsjs.com/images/get_started_hero@2x.png)



Sails 是 Node.js 中最流行的 MVC 框架，类似于 Ruby on Rails。使用 Sails 可以轻松构建企业级的 Node.js Web 服务[^1]



#### 特点

- Sails 内置强大的 ROM，提供了简单的数据层访问，无论使用什么数据库都能正常工作
- 自动生成 REST APIs
- 轻松整合 WebSockets
- 提供基础的安全性和基于角色的权限控制



#### 安装 Sails

```bash
$ npm install sails -g
```



#### 创建 Sails 项目

```bash
$ sails new sails-demo

```

![](https://s2.ax1x.com/2019/07/06/Z0pfjs.png)
输入 1 选择 Web App 模版

Sails 项目目录结构
![](https://s2.ax1x.com/2019/07/06/Z0mxr8.png)

运行项目

```
$ sails lift
```

访问 localhost:1337
![](https://s2.ax1x.com/2019/07/06/Z0Cpss.md.png)

添加路由

Sails 中有两种路由：自定义（custom）和自动(automatic)

- 自定义路由

在项目的 config/routes.js 文件中定义

```javascript
module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  "GET /": { action: "view-homepage-or-redirect" },
  "GET /welcome/:unused?": { action: "dashboard/view-welcome" },

  "GET /faq": { action: "view-faq" },

    ...

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  "/api/v1/account/logout": { action: "account/logout" },
  "PUT   /api/v1/account/update-password": {
    action: "account/update-password",
  },
  "PUT   /api/v1/account/update-profile": { action: "account/update-profile" },
}
```
每个路由由左边的**地址**（address）和右边的**目标**（target）组成，**地址**包括URl和可选的HTTP方法，**目标**可以是控制层的`action`，也可以直接指向 View 层的页面

- 自动生成路由

如何 URL 不匹配自定义的路由 Sails 会去匹配自动生成的路由，自动生成的路由主要包括两种：控制层、模型层生成的RESTful API 和静态文件比如CSS、图片、js等



对比之前的几个 Node.js Web 框架，显然 Sails 有更加完整的功能和一套自己的规范，功能强大同时也有一定的学习成本 


[^1]: https://sailsjs.com/
