---
title: 嵌入式数据库 LevelDB
date: 2019-07-26
---



## 嵌入式数据库 LevelDB



嵌入式数据库是嵌入在程序的进程中的，不需要依赖外部的服务器。在程序需要做到自包含时候比如移动端或者桌面程序，只能选择嵌入式数据库。

Node.js 中常用的嵌入式数据库有 SQLite、LevelDB、RocksDB等，除了 SQLite 外大部分都是简单的键值对储存


LevelDB 是由 Google 开发的嵌入式的键值对存储数据库，拥有非常简单的操作命令：Get、Put、Del 和 Patch



#### 安装 LevelDB

npm 中的 level 模块封装了 LevelDB 操作，由于 LevelDB 是嵌入式的所以不需要再安装额外的依赖

```bash
$ npm install level
```



#### 使用 LevelDB

创建数据库
```js
const level = require('level')
let db = level('article')
```
level 方法的第一参数用来指定数据库文件的位置，调用 level 将会在指定的文件夹下创建数据库



键值对的读写

```js
db.put('name', 'foo', (err) => {
    if (err) return console.error(err)
    db.get('name', (err, value) => {
        if (err) return console.log(err)
        console.log(value)
    } )
})
```
使用 put 方法将数据插入数据库，如果 key 已经存在则覆盖之前的数据。get 方法获取 key 的 value， 如果 key 不存在则报错

删除数据

与 get 不同，如果 key 不存在也不会报错
```js
db.del('name', (err) => console.log(err))
```

批量操作

batch 方法支持快速的批量操作 put 和 del。batch 操作支持两种方式： 数组（array form）和链式（chained form）[^1]

数组形式
```js
db.batch([
    {
        type: "del", key: 'name'
    },
    {
        type: "put", key: 'foo', value: '123'
    },
    {
        type: "put", key: 'foo2', value: '345'
    }
], err => console.log(err))
```

链式调用
```js
db.batch()
  .del('name')
  .put('foo', 1234)
  .put('foo2', 456)
  .write( () => console.log('done'))
```





[^1]: https://github.com/Level/level#batch

