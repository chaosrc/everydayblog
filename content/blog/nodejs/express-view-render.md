---
title: express 环境配置与模版渲染
date: 2019-07-13
---


## express 环境配置与模版渲染



上一篇中我们创建了 express web 程序并定义了路由，本篇我们继续配置 express 环境以及使用模版渲染



#### 环境配置

express 自带了一个极简的环境配置系统，由以下几个方法组成：

- app.set()
- app.get()
- app.disable()
- app.disabled()
- app.enable()
- app.enabled()

`app.set()` 和 `app.get()` 用来设置和获取环境配置的值，比如通过 `app.get('env')` 可以获取到 `NODE_ENV`:

设置 NODE_ENV 环境变量
```sh
$ NODE_ENV=production npm start
``` 
获取环境变量
```js
console.log(app.get('env'))
// => production
```

`app.enable()` 和 `app.disable()` 用来设置布尔类型的环境变量，等同于 `app.set('foo', ture)`，一般用来设置是否启用某个功能




#### 模版渲染

模版渲染的概念很简单，就是将**数据**传递给**视图**(view)层，然后将**视图**层再渲染成HTML


1. 设置模版的查找路径

```js
app.set('views', path.join(__dirname, 'views'));
```
在调用 `app.render()` 函数渲染时会从项目的 `views` 文件夹查找渲染模版


2. 设置默认的渲染引擎

```js
app.set('view engine', 'ejs')
```
调用 `app.render('index')`会去寻找 `index.ejs` 渲染文件。express 可以同时支持多个渲染引擎，非默认的引擎模版需要加上后缀名，比如 pug `app.render('user.pug')`


3. 设置渲染缓存

在开发环境下 `render()` 每次调用都会重硬盘读取，所以每次修改模版文件无需重启就能使修改生效，但是对于生产环境来说非常影响性能，所以在生成环境下默认会开启模版缓存来提高性能，每次修改模版后需要重启服务器
```js
// 开启模版缓存
app.enable('view cache')
```

4. 数据传递

express 中有两种方式将数据传递给模版引擎，最常用的是通过 `render()` 函数的第二个参数传递，也可以通过 `res.locals`或者 `app.locals` 传递。下面是在模版中获取变量的顺序：

![](https://s2.ax1x.com/2019/07/13/Z4bV2t.png)

express 还会默认传人一个 `settings` 变量包含 `app.set()` 中所以设定的值，比如 `app.set('appName', 'foo')`，在模版中可以听过 `settings` 变量引用

```ejs
<p><%= settings.appName %></p>
```

输出
```
<p>foo</p>
```




学会环境配置和模版渲染后，接下来就可以创建数据库来做数据持久化了











