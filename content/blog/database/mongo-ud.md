---
title: MongoDB 数据库更新和删除操作
date: 2019-07-24
---


## MongoDB 数据库更新和删除操作



#### 更新文档

MongoDB 中提供了三个方法更新文档

- Collection.updateOne
- Collection.updateMany
- Collection.replaceOne

以及更新文档的操作符, 操作符的使用形式如下：
```js
{
  <update operator>: { <field1>: <value1>, ... },
  <update operator>: { <field2>: <value2>, ... },
  ...
}
```

常用的操作符

| 操作符 | 描述 |
|-------|------|
| $set  | 更新文档中对应字段的值 |
| $min  | 只更新文档中小于当前值的字段 |
| $max  | 只更新文档中大于当前值的字段 |
| $currentDate | 设置字段的值为当前时间 |
| $rename | 重命名字段 |

使用 updateOne 更新文档
```js
db.collection('article').updateOne(
    {
        item: 'paper'
    },
    {
        $set: { qty: 200, status: 'C' },
        $currentDate: { modifiedDate: true}
    }
)
```
选择了集合 article 中 item 字段为 'paper' 值的文档，更新其 qty 和 status 字段，并且将 modifiedDate 设置为当前时间，如果 modifiedDate 字段不存在则会自动创建

更新前
```json
{
    "_id": "5d372d0b61329f241be05720",
    "item": "paper",
    "qty": 100,
    "size": {
      "h": 8.5,
      "w": 11,
      "uom": "in"
    },
    "status": "D"
}
```
更新后
```json
{  
    "_id": "5d372d0b61329f241be05720",
    "item": "paper",
    "qty": 200,
    "size": {
      "h": 8.5,
      "w": 11,
      "uom": "in"
    },
    "status": "C",
    "modifiedDate": "2019-07-24T16:14:30.906Z"
  }
  ```


  

  #### 删除文档

 MongoDB 中提供了两个方法删除文档
 - Collection.deleteMany
 - Collection.deleteOne

 使用 deleteMany 方法传人`{}`空对象，删除集合中的所有文档，deleteMany 返回 reult，result.deletedCount 为删除的文档条数

```js
db.collection('article').deleteMany({})
```

在 deleteMany 中传人**查询操作**，将会删除所有匹配的文档
```js
db.collection('article').delectMant({ qty: { $lt: 100 }})
```

deleteOne 只删除所有匹配项中的第一个