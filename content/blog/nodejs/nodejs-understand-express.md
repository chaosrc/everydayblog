---
title: Node.js Web 之深入了解 express 框架
date: 2019-07-12
---




## Node.js Web 之深入了解 express 框架



express 是 Node.js 中最流行的 Web 框架，使用起来很简单但是功能强大。



#### 生成 express 程序

```sh
$ sudo npm install -g express-generator
```

`express-generator` 是一个 express 程序生成器，安装完成后可通过 `express --help` 查看其功能

```sh
$ express --help

  Usage: express [options] [dir]

  Options:

        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
        --no-view        use static html instead of view engine
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory
    -h, --help           output usage information
```

生成 shoutbox 项目 

```bash
$ express -e shoutbox
```

项目结构
```sh
shoutbox/
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.ejs
    └── index.ejs
```



#### 项目实践


通过实现一个在线留言版服务来熟悉 express 开发，功能规划如下：
- 用户可登陆、注册、退出
- 用户可以发送信息
- 在页面中分页浏览线留言版条目
- 简单的认证功能

通过这些需求可以初步定义项目需要的路由，如下：

  - GET /entries: 获取条目列表
  - GET /entries/page: 获取单条条目
  - POST /entries/create: 创建条目
  - POST /login: 登陆
  - POST /logout： 退出
  - POST /register：注册

下一步将使用 express 框架实现这些功能




