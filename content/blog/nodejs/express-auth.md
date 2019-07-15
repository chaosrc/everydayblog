---
title: Express Web 之用户认证
date: 2019-07-15
---



## Express Web 之用户认证



使用 Express 从头开始创建一个认证系统，包括注册、登录、认证功能。



#### 创建用户模型

```js
const redis = require('redis')

const db = redis.createClient()

class User {
    constructor(obj) {
        Object.keys(key => this[key] = obj[key])
    }

    save(cb) {
        if (this.id) {
            this.update(cb)
        } else {
            this.create(cb)
        }
    }
    // 创建用户
    create(cb) {
        db.incr('user:ids', (err, num) => {
            if (err) return cb(err)
            this.id = num
            this.update()
            cb()
        })
    }
    // 更新用户
    update() {
        const data = JSON.stringify(this)
        db.set(`user:id:${this.name}`, this.id, (err) => {
            if (err) return cb(err)
            db.hmset("user:data", this.id, data)
            cb()
        })
    }
}
```
调用 `save` 方法，先检查用户 `id` 是否纯存在，如果存在就调用 `update` 方法更新用户信息，如果不存在就创建新的用户



#### 给密码加哈希

安装 `bcrypt`
```bash
$ npm install bcrypt
```

```js
...
const bcrypt = require('bcrypt')
...

class User {
    ...
    // 创建用户
    create(cb) {
        db.incr('user:ids', (err, num) => {
            if (err) return cb(err)
            this.id = num
            this.hashPassword((err) => {
                if (err) return cb(err)
                this.update(cb)
            })
        })
    }
    ...
    hashPassword(cb) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return cb(err)
            this.salt = salt
            bcrypt.hash(this.password, salt, (err, ecpt) => {
                if (err) return cb(err)
                cb(ecpt)
            })
        })
    }
    ...
}
```



#### 测试用户模型逻辑

```js
let user = new User({name: 'hahah', age: 14, password: '123456'})

user.save(() => {
    user.name = 'yayay'
    user.update(console.log)
})
```

在 redis 中查看储存结果
```bash
> hgetall user:data
1) "2"
2) "{\"name\":\"yayay\",\"age\":14,\"password\":\"$2b$12$HBiT2ho45R2QOaUOcbv3q..YVa02Oya8qN9nt9FOdyzQHFn6iLWUq\",\"id\":2,\"salt\":\"$2b$12$HBiT2ho45R2QOaUOcbv3q.\"}"
```




#### 用户登录认证


```js
class User {
    ...
    static authenticate(name, password, cb) {
        User.getByName(name, (err, user) => {
            if (err) return cb(err)
            bcrypt.hash(password, user.salt, (err, hash) => {
                if (err) return cb(err)
                if (hash === user.password) {
                    return cb(null, user)
                }
                cb(new Error('密码错误'))
            })
        })
    }    
}
```
先根据用户名查找到用户数据，将用户输入的密码和存储在用户数据中的盐值做哈希，和用户数据中的哈希比较如果匹配则用户输入密码正确






