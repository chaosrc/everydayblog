---
title: Node.js编程基础
date: 2019-06-25
description: Node.js的核心模块简介，Node.js中的代码组织方式
---

## Node.js编程基础 

#### Node.js核心模块

对Javascript有一点了解的都知道，Javascript没有与操作系统互交的能力，比如文件I/O、TCP/IP网络等，Node.js中的核心模块为Javascript添加了这些功能，使它可以用来编写服务端程序
 
- 文件系统模块：fs、path
- TCP客户端和服务端：net
- http库： http、https
- 域名解析： dns
- 操作系统库： os
- 断言库： assert

读取一个文件并且在终端输出
```javascript
const fs = require('fs')

fs.readFile('./package.json', (err, data) => {
    console.log(data)
})
```

创建一个简单的http服务器
```javascript
const http = require('http')

const server = http.createServer((request, response) => {
    response.end('hello node')
})

server.listen(8080)
```
运行并访问8080端口
```bash
$ node index.js

$ curl http://localhost:8080
hello node
```

#### Node.js中的代码组织方式

Node.js采用 CommonJS 模块规范，每个文件就是一个模块，有自己的作用域，在模块里面定义的变量、函数等都是私有的，对于其他文件不可见[^1]

```javascript
// 文件 demo.js
let bar = 100

function foo() {
    console.log('inside module')
}
```

如果想定义全局变量可以定义在`global`对象

```javascript
global.bar = bar
```
`bar`变量可以在任何文件中获取，一般不推荐这种写法，因为设置全局变量失去了模块化的意义

Node.js每个模块内部有两个变量module、exports，exports同时也是module上的一个属性，通过exports可以导出模块中的变量

```javascript
// 文件 demo.js
let bar = 100
let x = 10

function foo() {
    console.log('inside module')
}

exports.bar = bar
exports.foo = foo
```

在index.js中通过`require`函数引人demo.js模块

```javascript
// 文件index.js
const demo = require('./demo')
console.log(demo)
console.log(demo.bar)
console.log(demo.foo)
```

`demo`只包含了demo.js中exports的变量
```bash
$ node index.js
{ bar: 100, foo: [Function: foo] }
100
[Function: foo]
```

总结：

- 在一个模块内部通过exports对象导出变量
- 在另一个文件中使用`require`函数引用模块并使用


Node.js模块的特点
- 模块作用域不会影响全局
- 多次引入只会在第一次时运行是实例化模块，以后运行读取缓存
- 模块安照引用顺序同步加载





[^1]: https://javascript.ruanyifeng.com/nodejs/module.html