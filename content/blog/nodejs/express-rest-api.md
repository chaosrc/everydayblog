---
title: Express Web 之创建 REST API
date: 2019-07-18
---

## Express Web 之创建 REST API



在之前的基础上实现以下功能：
- 设计一个让用户显示、提交和移除消息列表的 API
- 添加基本认证
- 实现路由
- 通过 JSON 响应




#### 设计 API

在动手写代码之前想好会用到哪些路由，然后在去实现，会有更好的思路
```js
const express = require('express')

const router = express.Router()

router.get('/entry/:page',(req, res) => {

})

router.post('/entryDelete/:id', (req, res) => {

})
router.post('/entrySubmit', (req, res) => {

})
```




#### 添加基本认证中间件

安装 `basic-auth` 模块

```bash
$ npm install basic-auth
```
创建基本认证中间件

```js
const basic = require('basic-auth')
const User = require('../modle/User')

const basicAuth = (req, res, next) => {
    const {name, pass} = basic(req)
    User.getByName(name, (err, user) => {
        if (err) return next(err)
        if (!user || !user.id) {
             next(new Error('用户不存在'))
        } 
        res.remoteUser = user
    })
}
module.exports = basicAuth
```
使用认证

```js
...
app.use('/api', basicAuth)
...

var basicAuth = require('./middleware/auth')
```




#### 获取消息列表

```js
router.get('/entry/:page',(req, res) => {
    let page = req.page
    Entry.getRange(page.form, page.to, (err, list ) => {
        if(err) return next(err)
        res.json(list)
    })
})
```
通过 Entry 的 getRange 获取分页消息列表



下一步将会添加分页中间件以及返回 JSON 和 XML 格式数据





#### 添加分页中间件

获取消息列表 `/entry/:page` 时通过参数 page 来得到当前显示的页数

```js
function page() {
    return (req, res, next) => {
        const p = req.params.page
        const size = 10
        const page = {
            form: (Number(p) - 1) * size,
            to: Number(p) * size,
        }
        req.page = page
        next()
    }
}
```

访问 localhost:3000/api/entry/1
```
$ curl http://localhost:3000/api/entry/1
[{"title":"hahaewrw","content":"bzddddwrwfew"},{"title":"1133","content":"11222222222"},{"title":"ww","content":""},{"title":"hello","content":"qqqqqqq"}]
```



#### 格式化响应数据

创建完 API 后，接下来看看如何是接口支持多种数据类型

HTTP 请求通过 Accept 请求头提供内容协商机制，比如请求头：
```
Accept: text/plain; q=0.5, text/html
``` 
其中 q 表示 quality value，即 text/html 的优先级比 text/plain 要高出 50%。Express 会解析这个信息并放在 req.accepted 数组中

```js
[
    { value: 'text/html', quality: 1 },
    { value: 'text/plain', quality: 0.5 }
]
```

在 Express 中还提供了 res.format 方法，它的参数是 MIME 类型和 回调函数

添加 JSON 格式的响应

```js
res.format({
    'application/json': () => {
        res.send(list)
    }
})
```
添加 XML 格式的响应

```js
res.format({
    'application/json': () => {
        res.send(list)
    },
    'application/xml': () => {
        res.write('<entries>')
        list.forEach(item => {
            res.write(`
            <entry>
                <title>${item.title}</title>
                <content>${item.content}</content>
            </entry>
            `)
        })
        res.end('</entries>')
    }
})
```

访问并获取 XML 格式的数据
```bash
$ curl -H 'Accept: application/xml'   http://localhost:3000/api/entry/1
```
```html
<entry>
    <title>hahaewrw</title>
    <content>bzddddwrwfew</content>
</entry>

<entry>
    <title>1133</title>
    <content>11222222222</content>
</entry>

<entry>
    <title>ww</title>
    <content></content>
</entry>

<entry>
    <title>hello</title>
    <content>qqqqqqq</content>
</entry>
</entries>

```

还可通过模版的形式来返回 XML 格式数据

先定义 ejs 模版
```html
<!-- 文件 list.ejs -->
<entries>
  <% list.forEach(item => { %>
  <entry>
    <title><%= item.title %></title>
    <content><%= item.content %></content>
  </entry>
  <% }) %>
</entries>
```
在格式化回调函数中渲染模版
```js
res.format({
    'application/json': () => {
        res.send(list)
    },
    'application/xml': () => {
        res.render('list', { list })
    }
})
```




