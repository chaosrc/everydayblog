---
title: Node.js 测试框架 Mocha
date: 2019-07-28
---



## Node.js 测试框架 Mocha



Mocha 是一个功能丰富的 Javascript 测试框架，能够运行在 Node.js 和浏览器中，能够简单方便的对异步流程进行测试 [^1]




#### 安装 Mocha

```bash
$ npm install mocha
```

创建 test 目录，在 package.json 里面添加执行脚步
```json
"scripts": {
    "test": "mocha"
  }
```
执行 `npm test` mocha 会默认运行 test 目录下的所有测试




#### 使用 Mocha 进行测试

Mocha 默认使用 BDD 风格的 API，提供了`descript()`, `it()`、`before()`、 `after()`、`beforeEach` 和 `afterEach` 等函数

Mocha 测试的基本结构
```js
const assert = require('assert')

describe('Test todo model', () => {
    it('should be true', () => {
        assert.ok(true, 'run test')
    })
})

```

`describe()` 方法用来定义一个测试集，第一参数为测试集的标题，第二个参数为回调函数里面用来运行具体的测试案例

`it()` 方法用来定义一个测试案例，第一个参数为测试案例的标题，第二个参数为回调函数，里面运行具体的测试代码




#### 钩子函数

Mocha 提供了 `before()`、 `after()`、`beforeEach` 和 `afterEach` 四个钩子函数。`before()` 和 `after()` 在测试集运行之前和之后运行，`beforeEach` 和 `afterEach` 在每个测试案例运行之前和之后运行

```js
describe('Test todo model', () => {
    before(() => {
        console.log('before all test')
    })
    after(() => {
        console.log('after all test')
    })

    beforeEach(() => {
        console.log('before each test')
    })
    afterEach(() => {
        console.log('after each')
    })

    it('should be true', () => {
        assert.ok(true, 'run test')
    })
    it('should be false', () => {
        assert.ok(true, 'run test')
    })
})
```




#### 断言

Mocha 允许使用任意断言库，包括Node.js 自带的 assert 库。只要能够抛出错误（Error）对象 Mocha 就能正常工作

常用的断言库：
- shuold.js
- chai
- expect.js
- better-assert




#### 测试异步代码

在 `it()` 方法的回调函数中添加一个参数，一般命名这个参数为 `done`，`done` 是一个回调函数，Mocha 会等待 `done` 被调用，在执行异步代码时如果失败则调用 `done` 并传人 Error 对象，本次测试案例失败，如果成功直接调用 `done` 方法无需传人任何参数，本次测试案例成功，如果没有调用 `done` 方法 Mocha 会抛出错误

```js
it('should call after 1 second', (done) => {
    setTimeout(done, 1000)
})

it('should fail after 1 seccond', (done) => {
    setTimeout(() => {
        done(new Error('time out'))
    }, 1000)
})
```




[^1]: https://mochajs.org/