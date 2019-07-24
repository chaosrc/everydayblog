---
title: MongoDB 数据库插入和查询操作
date: 2019-07-23
---

## MongoDB 数据库插入和查询操作



#### 插入文档


> 如果当前集合不存在，插入操作将会创建集合

通过 `Collection.insertOne` 在集合中插入一个文档

```js
let result = await db.collection("article").insertOne({
  title: 123,
  content: 123432,
  tag: ["tech"],
})
```

`insertOne` 返回的 Promise 中提供了 result 对象， result.insertedId 为新插入文档的 \_id

```js
console.log(result.insertedId)
// 5d3727b6aff0881ccd998522
```



`Collection.insertMany` 方法传人一个数组可以将多个文档插入集合中

```js
let result = await db
  .collection("article")
  .insertMany([
    { title: "foo", content: "Lorem ipsum dolor sit amet" },
    { title: "bar", content: "consectetur adipisicing elit." },
  ])
console.log(result.insertedIds)
// { '0': 5d372a377df7ec1ff7631ed8, '1': 5d372a377df7ec1ff7631ed9 }
```

同样 result.insertedIds 中包含了新插入文档的 \_id

在 MongoDB 中每一个储存在集合中的文档需要一个唯一的 \_id 做为主健（primary key），如果插入的文档中没有 \_id 字段，MongoDB 会 z 自动生成

在 MongoDB 中所以的写操作在单个文档层面都是原子性的




#### 查找文档



查找集合中的所有文档

```js
let cursor = db.collection("article").find({})
```

上面的操作等同于 SQL 中的 `select * from article`



指定相等条件查询

```js
let cursor = db.collection("article").find({ status: "D" })
```

等同于 SQL 中的 `select * from article where status = "D"`



IN 条件查询

```js
let cursor = da.collection("article").find({ status: { $in: ["A", "D"] } })
```
等同于 SQL 中的 `select * from article where status in ["A", "D"]`



AND 条件查询

在查找文档是如果指定多个字段，隐含了 AND 逻辑，比如：
```js
let cursor = da.collection("article").find({ status: 'A', qty: 20 })
```
相当于 `select * from article where status = "A" and qty = 20`



OR 条件查询

使用 $or 操作符来表达或的逻辑
```js
let cursor = da.collection("article").find({
    $or: [{ status: 'A' }, { qty: 20 }]
})
```

相当于 `select * from article where status = "A" or qty = 20`



AND 和 OR 操作

选择 status 为 A 并且 name 以 foo 开头或者 qty 小于 30 的所有文档
```js
let cursor = da.collection("article").find({ 
        status: 'A',
        $or: [{ name: { $regex: '^foo' }}, { qty: { $lt: 20 }}]
    })
```
相当于 `select * from article where status = "A" and ( qty < 20 or name like "foo%")`

> MongoDB 支持正则表达式 `$regex`, 以及 `$lt` 小于，`$gt` 大于等操作符，参考文档[Query and Projection Operators](https://docs.mongodb.com/manual/reference/operator/query/)






