---
title: Node.js 错误栈
date: 2019-08-20
---

## Node.js 错误栈



当程序出现错误是通常会抛出错误栈（error.stack），通过错误栈可以定位到出错的代码。 Node.js 的 Error 对象中包含错误栈（stack）以及 name、message 等属性。




#### Node.js 中内置的 Error 类型

- Error: 通用的错误类型，比如 new Error('Network Error!')
- SyntaxError: 语法错误，Javascript 语法错误
- ReferenceError: 引用错误，比如引用未定义的变量
- TypeError: 类型错误
- URIError: 全局的 URI 处理函数抛出的错误
- AssertError: 使用 assert 模块时抛出的错误



#### Stack Trace

错误栈本质上是调用栈（或者叫做堆栈追踪），在 Javascript 中，调用栈指每当有一个函数被调用，就会将该函数压入栈顶，在调用结束时在将其从栈顶移出

比如下面的代码：
```js

function c() {
    console.log('c')
    console.trace()
}

function b() {
    console.log('b')
    c()
}

function a() {
    console.log('a')
    b()
}

a()
```

输出：
```bash
$ node stack.js 
a
b
c
Trace
    at c (/Users/chao/workspace/node/node-demo/promise/stack.js:4:13)
    at b (/Users/chao/workspace/node/node-demo/promise/stack.js:9:5)
    at a (/Users/chao/workspace/node/node-demo/promise/stack.js:14:5)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/stack.js:17:1)
```

在函数 c 中调用 console.trace 方法打印出当前函数的栈追踪，依次为 c、b、a，可以看出时 a 调用 b，b 调用 c 


做一点小的修改，在 b 方法调用 c 之后打印栈追踪

```js
function c() {
    console.log('c')
}

function b() {
    console.log('b')
    c()
    console.trace()
}

function a() {
    console.log('a')
    b()
}

a()
```

输出：
```bash
$ node stack.js 
a
b
c
Trace
    at b (/Users/chao/workspace/node/node-demo/promise/stack.js:9:13)
    at a (/Users/chao/workspace/node/node-demo/promise/stack.js:14:5)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/stack.js:17:1)
```
在 b 方法中调用 c 后，c 从栈顶移除，打印的栈追踪中只有 a 调用 b 




#### Error.captureStackTrace

Error.captureStackTrace 是 V8 提供的一个 API，用来捕获调用栈。captureStackTrace 接受两个参数

```js
Error.captureStackTrace(targetObject, constructorOpt?)
```

Error.captureStackTrace 会在 targetObject 上添加一个 stack 属性，在对该属性进行访问是，将以字符串的形式返回 Error.captureStackTrace 被调用时的堆栈信息

```js

let obj = {}

function c() {
    console.log('c')
    Error.captureStackTrace(obj)
}

function b() {
    console.log('b')
    c()
}

function a() {
    console.log('a')
    b()
}

a()

console.log(obj.stack)

```

输出：
```bash
$ node stack.js 
a
b
c
Error
    at c (/Users/chao/workspace/node/node-demo/promise/stack.js:6:11)
    at b (/Users/chao/workspace/node/node-demo/promise/stack.js:11:5)
    at a (/Users/chao/workspace/node/node-demo/promise/stack.js:16:5)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/stack.js:19:1)
```

Error.captureStackTrace 的第二个参数 constructorOpt 为可选参数，constructorOpt 是一个函数，传人这个参数后，在调用 targetObject.stack 查看栈追踪时，constructorOpt 函数之上的栈信息都会被忽略，比如：

```js

let obj = {}

function c() {
    console.log('c')
    Error.captureStackTrace(obj,b)
}

function b() {
    console.log('b')
    c()
}

function a() {
    console.log('a')
    b()
}

a()

console.log(obj.stack)
```
输出：

```bash
$ node stack.js 
a
b
c
Error
    at a (/Users/chao/workspace/node/node-demo/promise/stack.js:16:5)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/stack.js:19:1)
```

在 Error.captureStackTrace(obj,b) 中第二参数传人的是 b，那么 b 方法之上的栈信息被忽略，对于一些调用栈比较深的栈追踪很有帮助，能够更快的定位问题