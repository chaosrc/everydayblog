---
title: Express Web 之用户登录
date: 2019-07-17
---



##  Express Web 之用户登录



在上一篇中实现了注册功能，本篇来实现用户的登录，需要实现以下功能：
- 登录页面及其路由
- 登录表单的验证




#### 添加登录页面

```html
<!-- 文件 login.ejs -->
<%- include('head') -%>
 <form action="/users/login" method="POST">
    <p>登录</p>
    <%- include('message') -%>
    <input name="name" placeholder="请输入用户名" />
    <br/>
    <input name="password" type="password" placeholder="请输入密码"/>
    <br/>
    <button type="submit">登录</button>
 </form>

<%- include('footer') -%>
```
和注册页面一样也引人 `message` 错误提示模版

添加登录页面路由
```js
router.get('/login', (req, res) => {
  res.render('login', {title: '登录'})
})
```



#### 登录表单验证

添加登录请求的处理的路由，使用之前定义的 `authenticate` 校验方法对用户名和密码进行检查，如果正确则保存用户 id 到 session 中并重定向至首页，如果不正确则重定向至登录页并提示错误消息

```js
router.post('/login', (req, res, next) => {
  let body = req.body
  console.log(body)
  User.authenticate(body.name, body.password, (err, user) => {
    if (err) {
      res.error(err.message)
      res.redirect('back')
      return
    }
    req.session.uid = user.id
    res.redirect('/')
  })
})
```

添加登出路由

给用户提供登出连接，当用户登出的时候调用 `session.destroy` 方法销毁当前是会话

```js
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/')
  })
})
```



#### 定义获取用户消息的中间件

在登录的逻辑中如果登录成功会将用户 id 保存至 session 中。创建中间件使用 session 中的 id 获取用户信息并保存在请求的上下文中

```js
const User = require('../modle/User')


function getUser(req, res, next) {
    let id = req.session.uid
    User.getById(id, (err, user) => {
        if (err) return next(err)
        res.user = res.locals.user = user
        next()
    })
}

module.exports = getUser
```
使用中间件

```js
...
var user = require('./middleware/user')
...

app.use(user)
...
```

当用户登录后就可以在模版或者响应请求中获取当前登录用户的消息




#### 添加菜单栏

增加菜单栏模版，更加当前用户是否登录显示不同的菜单
```html
<ul>
  <li><a href="/users/register">注册</a></li>
  <li><a href="/users/login">登录</a></li>
  <% if(user) {%>
  <li><a href="/entry/form-page">发布</a></li>
  <li><a href="/users/logout">注销</a></li>
  <% } %>
</ul>
```
最终效果

登录前

![](https://s2.ax1x.com/2019/07/18/ZOYQtU.png)

登录后

![](https://s2.ax1x.com/2019/07/18/ZOYlhF.png)








