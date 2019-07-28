---
title: Node.js 单元测试
date: 2019-07-27
---


## Node.js 单元测试




Node.js 自带了 assert 模块，是大多数单元测试的基础，很多第三方测试框架都用到了 assert 模块。

先定义一个简单的待办事项程序（ Todo ） 程序，然后使用 assert 模块对代码进行单元测试




#### 定义 Todo 程序

```js
class Todo {
    constructor() {
          this.todos = [] 
    }

    add(item) {
        if (!item) throw new Error('参数为空')
        this.todos.push(item)
    }
    
    deleteAll() {
        this.todos = []
    }

    count() {
        return this.todos.length
    }

    doAsync(cb) {
        setTimeout(cb, 2000, true)
    }
}

module.exports = Todo
```

在构造器 `constructor` 中初始化 Todo，`add` 方法添加代办事项，如果为空则抛出异常，`deleteAll` 方法清空所有代办事项，`count` 方法计算待办事项的数量，`doAsync` 方法异步执行回调, 2 秒后调用 cb 方法并传人 true


引入测试模块，创建 Todo

```js
const assert = require('assert')
const Todo = require('./Todo')

const todos = new Todo()

let passCount = 0

```



#### 测试删除功能

```js
function testDelete() {
    todo.add('first item')
    assert.equal(todo.todos.length, 1, 'Todo 中存在一条待办事项')
    todo.deleteAll()
    assert.equal(todo.todos.length, 0, '待办事项为空')
    passCount ++
}
```
先添加一个待办事项，使用 assert.equal 方法来比较 todo 对象中的 todos 的长度是否为 1，如果不为1，则会抛出异常，deleteAll 方法删除所有待办事项后 todos的长度应为 0




####  测试异步调用

```js
function asyncTest(cb) {
    todo.doAsync((value) => {
        assert.ok(value, '异步回调执行')
        passCount++
        cb()
    })
}
```

调用 doAsync 方法，回调中执行 assert.ok 断言传人的值为 true




#### 测试异常是否抛出

```js
function throwTest() {
    assert.throws(todo.add, /空/) 
    passCount++
}
```
assert.throws 方法可以检查测序是否抛出错误，第二参数是正则表达式，用来匹配错误信息中的关键词




#### 运行测试

```js
function start() {
    testDelete()
    throwTest()
    asyncTest(() => {
        console.log('pass count', passCount)
    })
}
start()

// 输出：pass count 3
```



