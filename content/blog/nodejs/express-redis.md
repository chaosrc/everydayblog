---
title: Express Web 之使用中间件校验表单
date: 2019-07-14
---

## Express Web 之使用中间件校验表单



在校验表单之前，首先要实现表单提交功能，然后使用中间件校验表单



#### 创建表单模型

安装 Redis
```sh
$ npm install redis
```
借助 Redis 和 ES6 的特性，可以在不使用复杂数据库的情况下能够创建轻便的数据模型


创建模型

```js
const redis = require("redis")
const db = redis.createClient()

class Entry {
    constructor(obj) {
        Object.keys(obj).forEach(key => this[key] = obj[key])
    }

    // 保存表单信息
    save(cb) {
        db.lpush('entries', JSON.stringify(this), cb)
    }

    // 获取表单信息
    static getRange(from, to, cb) {
        db.lrange('entries', from, to, (err, items) => {
            if (err)  return cb(err)

            const entries = items.map(item => JSON.parse(item))
            cb(entries)
        })
    }
}

module.exports = Entry
```
`save` 方法用来保存表单，`getRange` 方法用来获取表单列表



#### 添加保存表单的路由

```js
var express = require('express');
var Entry = require('../modle/entry')
var router = express.Router();

router.get('/form-page', (req, res) => {
    res.render('form-page', { title: "FORM"})
})

router.post('/submit',  (req, res, next) => {
    let entry = new Entry(req.body.entry)
    entry.save((err) => {
        if (err) return res.render('error', err)
        res.render('success')
    })
})

module.exports = router
```
表单 HTML 文件
```html
<!-- form-page.ejs -->
<form action="/entry/submit" method="POST">
    <p>
        <input placeholder="标题" name="entry[title]"></input>
    </p>
    <p>
        <textarea placeholder="内容" name="entry[body]"></textarea>
    </p>
    <p>
        <button type="submit">提交</button>
    </p>
</form>
```



#### 获取表单列表

从 Redis 获取列表，将获取到的数据传入 `entry-list.ejs` 模版进行渲染
```js
router.get('/list', (req, res, next) => {
    Entry.getRange(0, -1, (err, list) => {
        if (err) return res.render('error', err)
        res.render('entry-list', {title: '列表', list})
    })
})
```
```html
<!--  entry-list.ejs -->
<ul>
    <% list.forEach(item => { %>
        <li><%= item.title %></li>
        <span><%= item.content %></span>
    <% })  %>
</ul>
```



#### 添加表单校验中间件

```js
function validateTitle(req, res, next) {
    let entry = req.body.entry
    if (!entry.title) {
        return next(new Error('标题不能为空'))
    }
    if (entry.title.length < 4) {
        return next(new Error('标题不能小于4个字符'))
    }
    next()
}

router.post('/submit', validateTitle, (req, res, next) => {
    // ...
})
```

每个路由可以定义自己的中间件，放在路由回调函数之前，只有匹配当前路由时中间件才会被调用




#### 创建可配置化的校验中间件

上面的校验中间件只能用于当前的 `submit` 路由，如果将其进一步抽象就能在其他路由中使用

```js
function validateRequire(filed = '') {
    const fileds = filed.split('.').filter(Boolean)

    return (req, res, next) => {
        let content = req.body
        fileds.forEach(f => {
            content = content[f]
        })
        if (!content) {
            return next(new Error(`${filed} 不能为空`))
        }
        next()
    }
}

router.post('/submit', validateRequire('entry.title'), (req, res, next) => {
    // ...
})
```

通过中间件的方式来做校验，将通用代码提炼出来以提高代码的复用性，同时也减少了代码的复杂度















