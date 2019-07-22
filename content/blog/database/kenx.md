---
title: 查询构建器 Knex
date: 2019-07-21
---



## SQL 查询构建器 Knex



Knex 是一个功能完备的SQL查询构建器支持Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle等数据库。
Knex 既支持传统的 Node.js 风格的回调，也支持 Promise 来进行异步流程控制[^1]。Knex 是一个轻量级的 SQL 抽象包，可以通过它的声明式 API 构建出 SQL 字符串



#### 安装 Knex

安装 knex 模块
```bash
$ npm install knex
```


安装数据库客户端模块
```bash
# PostgresSQL
$ npm install pg

# MyMySQL
$ npm install mysql

# sqlite3
$ npm install sqllite3
```



#### 连接数据库

连接 Postgres

```js
const knex = require('knex')

const pg = knex({
    client: "pg",
    connection: {
        host: '***.***.***.***',
        user: 'postgres',
        password: '123456',
        pool: '5432',
        database: 'articles'
    }
})
```
连接 MySQL

```js
const mysql = knex({
    client: 'mysql',
    connection: {
        host: '***.***.***.***',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'test'
    }
})
```

连接 sqlite

```js
const sqlite = knex({
    client: "sqlite3",
    connection: {
        filename: __dirname + '/articles.db',
    },
    useNullAsDefault: true
})
```



#### 使用 Knex 进行查询

创建表
```js
await db.schema.createTable('student', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.text('address')
})
```

插入数据
```js
let insert = await db('student').insert({name: 'foo', address: 'shanghai'})
console.log(insert)
// 输出： [ 1 ]
```

查询数据
```js
let find = await db('student').orderBy('name')
console.log(find)
// 输出： [ { id: 1, name: 'foo', address: 'shanghai' } ]
```

删除数据
```js
let del = await db('student').del().where({id: 1})
console.log(del)
// 输出： 1
```


通过 knex 查询构建器能够支持多种数据库同时消除了各种 SQL 方言的差异，提供同样的接口，方便在不同的数据库之间进行切换





[^1]: https://knexjs.org/