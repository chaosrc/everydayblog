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

（未完待续）


