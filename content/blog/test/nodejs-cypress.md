---
title: Node.js 端到端测试框架 Cypress
date: 2019-07-31
---


## Node.js 端到端测试框架 Cypress



使用 Cypress 能够对浏览器中运行的任何内容进行快速，简单和可靠的测试

对比 Selenium 运行在浏览器之外，Cypress运行在浏览器里面能够直接获取 document、window 等 Javascript 对象，对 Javascript 方法、对象能够更好的模拟，也因为如此 Cypress 只支持 Javascript




#### 安装 Cypress

使用 npm 安装 cypress
```bash
$ npm install cypress
```
也可以直接下载安装包 [cypress下载](https://download.cypress.io/desktop), 解压运行

在项目中添加启动脚本
```js
// 文件： package.json
...
"scripts": {
    "cypress:open": "cypress open"
}
...
```


#### 编写第一个测试

在项目目录下创建一个测试文件
```bash
$ touch cypress/integration/sample_spec.js
```
添加测试代码
```js
describe('第一个测试', () => {
    it('一定为真', () => {
        expect(true).to.equal(true)
    })
})
```

其中 describe，it 来自于 mocha 测试框架，expect 来自于断言库 Chai

运行结果

![](https://s2.ax1x.com/2019/08/01/eNLAQs.png)




#### 访问网站

```js
describe('第一个测试', () => {
    ...
    it('访问网站', () => {
        cy.visit('https://example.cypress.io')
    })
})
```
使用 cy.visit() 打开一个网站



#### 添加点击事件

```js
describe('第一个测试', () => {
    it('访问网站', () => {
        cy.visit('https://example.cypress.io')
        cy.contains('type').click()
    })
})
```
通过 cy.contains() 方法来查找页面中包含 type 内容的元素，click 方法模拟点击事件

![](https://s2.ax1x.com/2019/08/01/eNLCFS.png)




#### 添加断言
```js
describe('第一个测试', () => {
    it('访问网站', () => {
        cy.visit('https://example.cypress.io')

        cy.contains('type').click()

        cy.url().should('include', '/commands/actions')

    })
})
```

![](https://s2.ax1x.com/2019/08/01/eNLpo8.png)


调用 cy.url() 获取 url，链式调用 should 进行断言，其中 should 第一个参数为断言操作来自于 [Chai](https://docs.cypress.io/guides/references/assertions.html#Chai)测试框架, 第二个参数为断言的值












