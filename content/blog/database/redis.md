---
title: 在 Node.js 中使用 Redis
date: 2019-07-25
---

#### 在 Node.js 中使用 Redis



Redis 是非常热门的结构化内存数据库，使用 key/value 来储存数据，其中 value 值包括以下类型：
- string 字符串
- hash 哈希表
- list 列表
- sets 集合
- sorted sets 有序集




####  Redis 安装与启动

安装
```bash
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make
```
启动
```bash
$ src/redis-server
```




#### 连接到 Redis

安装 Node.js 客户端
```bash
$ npm install redis
```

连接到 Redis server
```js
const Redis = require('redis')

let db = Redis.createClient()

db.on("connect", () => console.log('connect success'))
db.on('ready', () => console.log('connect ready'))
db.on('error', err => console.error(err))
```

处理键/值对

Redis 使用 get 和 set 方法来读写键/值对，值可以是字符串和任意的二进制数据

```js
db.set('foo', '123455')
db.get('foo', (err, re) => console.log(re))
```
如果写入的键以经存在，那么原来的值将会被覆盖

可以通过 exists 方法检查键是否存在

```js
db.exists('foo', (err,re) => console.log(re))
// output: 1
```




#### 编码与数据类型

在 Redis 服务器中键和值都是二进制的，默认情况下键和值都会被强制转换成字符串。如果 set 中的值是 Javascript 对象，则会提示警告信息

```js
db.set('foo1', { a: 123456 })
// node_redis: Deprecated: The SET command contains a argument of type Object.
// This is converted to "[object Object]" by using .toString() now and will return an error from v.3.0 on.
// Please handle this in your code to make sure everything works as you intended it to.
```
在设置值的时候需要关注数据类型的正确性




#### 使用 hash 表

hmset 方法可以存储一个哈希表，使用 hmget 获取哈希表

```js
db.hmset('hash', { name: 'abc', age: 123 })
db.hmget('hash', 'name', (err, re) => console.log(re))
```



#### 使用列表

lpush 方法向列表中添加一个值，lrange 方法读取一定范围的值
```js
db.lpush('list', 1)
db.lpush('list', 3)
db.lpush('list', 5)
db.lrange('list', 0, -1, (err, re) => console.log(re) )
// output: [ '5', '3', '1']
```



#### 使用集合

sadd 方法添加值到集合中，smember获取集合中的所有成员

```js
db.sadd('set', 'a')
db.sadd('set', 'b')
db.sadd('set', 'a')
db.sadd('set', 'c')
db.smembers('set', (err, re) => console.log(re))
//output: [ 'c', 'b', 'a' ]
```



