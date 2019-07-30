---
title: Node.js 断言库 chai
date: 2019-07-29
---



## Node.js 断言库 chai


chai 是一个 BDD / TDD 风格的断言库，能在 Node.js 和 浏览器内运行。chai 有三个接口 should、expect 和 assert，should、expect 为 BDD 风格，assert 为 TDD 风格




#### 安装 chai

```bash
$ npm install chai
```



#### 使用 assert 接口进行测试

assert 接口提供了非常经典的断言操作，和 Node.js 自带的 assert 库类似，但是 chai 提供了更多断言测试并且支持在浏览器中运行

```js
const assert = require('chai').assert

const foo = 'foo'
const cat = { name: 'tom', eat: 'fish'}
const list = [1, 2, 3]

describe('使用 chai ', () => {
    it('should be equal', () => {
        assert.equal(foo, 'foo', 'foo 的值为 foo')
    })

    it('typeof test', () => {
        assert.typeOf(foo, 'string', 'foo 的类型为 string')
    })

    it('should hava property', () => {
        assert.property(cat, 'name', 'cat 对象有 name 属性')
    })

    it('test length', () => {
        assert.lengthOf(list, 3, 'list 的长度为三')
    })

})
```
相比于原生的 assert 库，chai 的 assert 提供了一些像 typeOf、property、lengthOf这样的断言，方便测试，更多详细的 API 可以参考 [Assert API](https://www.chaijs.com/api/assert/)




#### 使用 BDD 风格的 expect 和 should

expect 和 should 都属于 BDD 的测试风格，两者都使用相同的链式调用的语法来构建断言，不同之处在于 should 通过扩展每一个对象添加 should 属性来构建链式调用


expect 接口

```js
const expect = require('chai').expect

const foo = 'foo'
const cat = { name: 'tom', eat: 'fish'}
const list = [1, 2, 3]

describe('使用 chai ', () => {
    it('should be equal', () => {
        expect(foo).to.be.equal('foo', 'foo 的值为 foo')
    })

    it('typeof test', () => {
        expect(foo).to.be.a('string', 'foo 的类型为 string')
    })

    it('should have property', () => {
        expect(cat, 'cat 对象有 name 属性').to.have.property('name')
    })

    it('test length', () => {
        expect(list).to.have.lengthOf(3, 'list 的长度为三')
    })

})
```
expect 和 should 的 BDD 风格都是使用自然语言进行链式调用， expect 方法的第二个参数为可选的断言失败提示信息


should 接口

在运行 should 方法后，会为每一个对象添加 should 属性，然后可以使用 should 属性进行断言

```js
const should = require('chai').should

should()

const foo = 'foo'
const cat = { name: 'tom', eat: 'fish'}
const list = [1, 2, 3]

describe('使用 chai ', () => {
    it('should be equal', () => {
        foo.should.to.be.equal('foo', 'foo 的值为 foo' )
    })

    it('typeof test', () => {
        foo.should.to.be.a('string', 'foo 的类型为 string')
    })

    it('should have property', () => {
        cat.should.to.have.property('name')
    })

    it('test length', () => {
        list.should.to.have.lengthOf(3, 'list 的长度为三')
    })

})
```



