---
title: Express Web 之用户注册
date: 2019-07-16
---


## Express Web 之用户注册



上一篇中完成了用户的认证流程，在此基础上我们继续构建用户的注册流程

需要完成以下功能：
- 创建注册页面
- 创建注册接口
- 储存用户注册数据




#### 创建注册页面
```html
<!-- 文件：register.ejs -->
<p>用户注册</p>
<form action="/users/register" method="POST">
    <input placeholder="请输入用户名" name="name"></input><br/>
    <input placeholder="请输入密码" name="password"/><br/>
    <input type="submit" value="注册"></input>
</form>
```
添加路由

```js
router.get('/register', (req, res) => {
  res.render('register', {title: '注册'})
})
```
访问http://localhost:3000/users/register

![](https://s2.ax1x.com/2019/07/17/Zq9RjP.png)




#### 创建错误提示模版

用户在注册的时候可能会报错比如用户名重复等，需要将错误消息提示给用户

```html
<% if(locals.messsages) { %>
    <% locals.messages.forEatch(msg => {%>
        <p><%= msg %></p>
    <%})%>
<%}%>
```
在 register.ejs 中引人

```html
...
<p>用户注册</p>
<%- include('message'); -%>
<form action="/users/register" method="POST">
...
```
通过将错误信息放在 locals 中来传递，但是夸请求，比如重定向后 locals 会丢失，这是需要用到 `session`(会话)




#### 在会话中存放临时消息

安装 `express-session`
```bash
$ npm install express-session
```

添加 session 中间件
```js
var session = require('express-session')
...
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true
}))
...
```




#### 创建 message 中间件

```js
...
app.use(message)
...
function message(req, res, next) {
  res.error = (errStr) => {
    if (!req.session.messages) {
      req.session.messages = []
    }
    req.session.messages.push(errStr)
  }

  res.locals.messages = req.session.messages;
  next()
}
```
定义好 message 中间件后所有请求中都可以使用 `res.error` 方法以及 `res.locals.messages` 变量




#### 实现用户注册
```js
router.post('/register', (req, res, next) => {
  // 查找当前用户是否存在
  User.getByName(req.body.name, (err, user) => {
    if (err) return next(err)
    if (user && user.id) {
      // 用户存在提示错误
      res.error('用户名重复')
      res.redirect('back')
    } else {
      //保存用户
      const user = new User(req.body)
      user.save((err) => {
        if (err) return next(err)
        res.render('success')
      })
    }
  })
})
```

首先查找当前用户是否存在如果不存在则返回注册页面并提示错误，如果存在则保存注册消息，注册流程完成



