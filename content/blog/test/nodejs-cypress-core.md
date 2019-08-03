---
title: Cypress 测试框架的核心概念
date: 2019-08-01
---

## Cypress 测试框架的核心概念



#### 查询元素

类似于 jQuery 的选择器, 但是不会同步返回元素，比如:

```js
// jQuery
let el = $('input')
// Cypress
let el = cy.get('input')
```
Cypress 里面不会直接返回元素，而是会包装一层重试和超时逻辑，使用 .then 方法异步获取元素

```js
cy.get('input').then(el => console.log(el))
```



#### 设置超时

当查找的元素不存在时，cypress 不会马上失败，而是会等待一个超时时间后报错, 如下设置10秒的超时：
```js
cy.get('.name', {timeout: 100000})
```
默认的超时时间为4秒




#### 与元素的互交

cypress 中提供了以下与元素互交的方法:
- .type() 输入 input 元素的值
- .blur() 使元素失去焦点
- .focus() 使元素聚焦
- .clear() 清除 input 或者 textarea 的值
- .check() 选择 checkbox
- .uncheck() 取消 checkbox 选择
- .select() 选择 option
- .dbclick() 双击元素

通过链式调用与元素互交
```js
cy.get('textarea.post')
  .type('hello')

cy.get('.btn')
  .click()
```



#### 设置别名

Cypress 提供了一个功能可以快速获取之前以及选择过的元素，如下：
```js
cy
  .get('.my-selector')
  .as('myElement') // 设置别名
  .click()
cy
  .get('@myElement')
  .click()
```
通过 as 方法设置别名，后面可以通过别名来获取元素，可以复用之前的选择



#### 异步执行命令

一个非常重要的理解是 Cypress 命令在调用的时候不会立即执行，而是将它们储存在队列中稍后运行，因此Cypress 命令是异步执行的

```js
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path') 

  cy.get('.awesome-selector')  
    .click()   

  cy.url()               
    .should('include', '/my/resource/path#awesomeness') 
})
```
当 it 方法执行完成后才会依次执行上面的每一个命令
