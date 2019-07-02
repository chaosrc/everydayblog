---
title: 在 Node.js Web 程序中添加数据库
date: 2019-07-01
description: 在 Node.js 使用 SQLite 作为数据库系统，实现对数据的查询、存储和删除
---


## 在 Node.js Web 程序中添加数据库



Node.js 支持多种常用的数据库，比如 MySQL、PostgreSQL、Redis、SQLite 等，这里使用非常简单的、适合入门的 SQLite 数据库




#### 定义数据模型 API

```typescript
type ArticleType = {
  title: string
  content: string
}

interface ArticleInterface {
  // 返回所有文章
  all(cb: Function): void
  // 查找对应id的文章
  find(id: string | number, cb: Function): void
  // 创建文章
  create(art: ArticleType, cb: Function): void
  // 根据id删除文章
  delete(id: string | number, cb: Function): void
}
```



#### 安装 sqlite3 模块

```bash
$ npm install sqlite3
```

连接到 sqlite3 [^1]

```typescript
import sqlite3 from "sqlite3"

// 将执行模式设置为verbose以生成长堆栈跟踪
const sql = sqlite3.verbose()

// 创建database
const db = new sql.Database("article", err => {
  if (err) {
    return console.error(err)
  }
  console.log("Connect to sqlite3 success")
})
```



#### 实现数据模型 API [^2]

```typescript
db.serialize(() => {
  const sql = `CREATE TABLE IF NOT EXISTS articles (id integer primary key, title text, content text)`
  db.run(sql)
})

export class Article implements ArticleInterface {
  all(cb: Function) {
    db.all("select * from articles", cb)
  }
  find(id: string | number, cb: Function) {
    db.get("select * from articles where id = ?", id, cb)
  }
  create(art: ArticleType, cb: Function) {
    const sql = "INSERT INTO articles(title, content) VALUES(?, ?)"
    db.run(sql, art.title, art.content, cb)
  }
  delete(id: string | number, cb: Function) {
    db.run("DELETE FROM articles where id = ?", id, cb)
  }
}
```




#### 在 HTTP 路由中获取数据

```typescript
const articels = new Article()

app.get("/articles", (req, res, next) => {
  articels.all((err: Error, rows: ArticleType[]) => {
    if (err) return next(err)
    res.send(rows)
  })
})

app.post("/articles", (req, res, next) => {
  articels.create(req.body, (err: Error) => {
    if (err) return next(err)
    res.end("success\n")
  })
})

app.get("/articles/:id", (req, res, next) => {
  const id = req.params.id
  articels.find(id, (err: Error, row: ArticleType) => {
    if (err) return next(err)
    res.send(row)
  })
})

app.delete("/articles/:id", (req, res, next) => {
  const id = req.params.id
  articels.delete(id, (err: Error) => {
    if (err) return next(err)
    res.send("Delete success \n")
  })
})
```



#### 使用 curl 访问验证 [^3]

```bash
$ curl -d '{"title": "Node.js", "content":"learn Node.js"}' -X POST -H "Content-Type: application/json" http://localhost:8800/articles
success

$ curl http://localhost:8800/articles
[{"id":1,"title":"Node.js","content":"learn Node.js"}]

$ curl http://localhost:8800/articles/1
{"id":1,"title":"Node.js","content":"learn Node.js"}

# 删除文章
$ curl -X DELETE http://localhost:8800/articles/1
Delete success

# 再查询，返回空数组
$ curl http://localhost:8800/articles
[]

```


下一步添加用户界面





[^1]: http://www.sqlitetutorial.net/sqlite-nodejs/connect/
[^2]: http://www.sqlitetutorial.net/sqlite-nodejs/query/
[^3]: https://gist.github.com/subfuzion/08c5d85437d5d4f00e58