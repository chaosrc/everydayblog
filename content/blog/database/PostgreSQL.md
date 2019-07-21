---
title: PostgreSQL 简单使用
date: 2019-07-20
---




## PostgreSQL 简单使用



PostgreSQL 是开源、强大、且功能丰富的关系型数据库




#### 安装 PostgreSQL

最简单的方式是使用 Docker 安装

```bash
$ docker run --name my-postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=postgres -v ~/workspace/sql-data/postgre:/var/lib/postgresql/data -p 5432:5432 -d postgres
```

`POSTGRES_PASSWORD` 环境变量用来设置数据库的密码，`POSTGRES_USER` 用来设置数据库的用户名，然后将数据库数据映射到宿主机

通过日志查看是否启动

```bash
$ docker logs my-postgres
...
2019-07-20 16:22:32.267 UTC [21] LOG:  redo starts at 0/16518F0
2019-07-20 16:22:32.268 UTC [21] LOG:  invalid record length at 0/16519D0: wanted 24, got 0
2019-07-20 16:22:32.268 UTC [21] LOG:  redo done at 0/1651998
2019-07-20 16:22:32.296 UTC [1] LOG:  database system is ready to accept connections

```
postgres 启动成功，接下来就可以创建数据库了




#### 创建数据库

```bash
$ docker exec -it my-postgres psql -U postgres -c "create database articles"
CREATE DATABASE
```




#### 在 Node.js 中连接 Postgres

```
$ npm install pg
```
pg 模块是 postgres 的 Node.js 客户端

连接到 Postgres 

```js
const Postgres = require('pg')

const db = new Postgres.Client({
    user: 'postgres',
    password: '123456',
    host: '***.***.***.***',
    port: '5432',
    database: 'articles'
})


class Articels {
    constructor(db) {
        this.db = db
    }
    async connect() {
        try {
            await this.db.connect()
            console.log('connect success')
        } catch (err) {
            console.log(err)
        }
    }
}

new Articels(db).connect()
```


#### 创建表

```js
async createTable() {
    let result = await this.db.query(`
        CREATE TABLE IF NOT EXISTS article (
            id SERIAL,
            PRIMARY KEY(id),
            content text
        )
    `)
    console.log('create table')
}
```



#### 插入数据
```js
async insert(content) {
    let result = await this.db.query(`
        INSERT INTO article (content) VALUES ($1)
    `,
    [content]
    )
    console.log('insert row: ', result.rowCount)
}
```



#### 更新数据
```js
async update(id, content) {
    let result = await this.db.query(`
        UPDATE article SET content = ($1) WHERE id=$2 
    `, [content, id])

    console.log('update: ', result.rowCount)
}
```



#### 查询数据
```js
async query() {
    let result = await this.db.query(`
        SELECT * FROM article ORDER BY id
    `)
    console.log('query: ', result.rowCount, result.rows)
}
```


#### 测试是否成功运行

测试代码
```js
async function start() {
    try {
        let art = new Articels(db)

        await art.connect()

        await art.createTable()

        await art.insert('hello postgres')
        await art.update(2, 'update content')

        await art.query()
        
        db.end()
    } catch (error) {
        console.log(error)
        db.end()
    }
}
start()
```

运行结果
```bash
$ node modle/pg.js 
connect success
create table
update:  1
query:  2 [
  { id: 1, content: 'hello postgres' },
  { id: 2, content: 'update content' }
]
```




