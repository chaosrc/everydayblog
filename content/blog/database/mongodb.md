---
title: MongoDB 简介
date: 2019-07-22
---



##  MongoDB 简介



MongoDB 是面向对象的分布式数据库，基于文档储存，将文档储存在无模式的数据集中，不需要为预先文档定义模式，同一个文档中也不用遵循相同的模式，因此拥有很高的灵活性。[^1]




#### 安装 MongoDB

```bash
$ docker run --name mongodb \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=123456 \
    -v ~/workspace/sql-data/mongo \
    -p 27017:27017 \
    -d mongo
```




#### 安装 Node.js 客户端

安装 MongoDB 官方 npm 包 mongodb
```bash
$ npm install mongodb
```




#### 连接到 MongoDB

```js
const Monogo = require('mongodb')

const mongo = Monogo.MongoClient

mongo.connect(
  "mongodb://***.***.***.***:27017",
  { useNewUrlParser: true, auth: { user: "admin", password: "123456" } },
  (err, client) => {
    if (err) return console.log(err);
    console.log("success");
  }
);
```
通过 `connect` 方法第一个参数 url 指定 ip 以及端口号，第二个参数是可选的配置项用来设置用户名、密码以及其他选项，第三个参数是回调如果连接失败则返回 err 对象，否则返回 client 对象




#### MongoDB 文档

MongoDB 将数据储存为 BSON 文档格式，BSON 是 JSON 的二进制展示方式比 JSON 有更多的数据类型。[^2]

MongoDB 文档由健值对组成，如下：
```json
{
    "key1": "value1",
    "key2": "value2",
    ...
    "keyn": "valuen"
}
```
值的类型可以是任意的 [BSON](https://docs.mongodb.com/manual/reference/bson-types/) 数据类型，以下是文档中包含的不同类型：
```js
const doc = {
    _id: ObjectId('12223dtgrtryry'),
    address: {province: '江苏'，city: '南京'}，
    birth: new Date(),
    array: [1, 2, 3, 4, 5]
}
```

健的类型是字符串，对健有如下限制：
- _id 为保留字段做为主健使用，它的值必须在集合中唯一并且不可变的
- 不能是 null
- 顶层的健不能以 $ 符号开头






[^1]: 《 Node.js 实战（第二版）》第8章存储数据

[^2]: https://docs.mongodb.com/manual/core/document/#bson-document-format

