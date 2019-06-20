---
title: Typescript系列(五)：泛型及泛型的约束
date: 2019-06-19
time: 22:30-00:30
description: 本篇介绍typescript中的泛型及泛型的约束
---

# 泛型及泛型的约束

### 泛型是什么
先从一个例子开始：
```typescript
function log(message: string) {
    console.log(message)
}
log('foo')
```
对于log函数有了类型限定后message参数只能为string类型，那么函数的通用性不够，比如要打印一个数字`log(123)`，会报类型错误，一种方式是将message设置为any类型
```typescript
function log(message: any) {
    console.log(message)
}
```
此时log函数可以可以传人任意值，虽然解决了通用性问题，但是同时也丢失了类型信息，比如需要打印message的长度
```typescript
function log(message: any) {
    console.log(message.length)
}
```
message可能没有length属性，甚至如果message为null，在运行的时候会直接报错，那么有么有一种更好的方式来解决这个问题呢？
#### ts中泛型的定义
在ts中可以使用类型变量来定义泛型
```typescript
function map<T>(o: T): T{
    let a: T
    // 做一些操作
    return a
}
let b = map<string>('123')
let c = map<number>(123)
// b的类型为string
// b的类型为number
```
其中T称作类型变量，是一种特殊的变量，只能用来表示类型不能表示值，在使用map方法的时候，b的类型为string,返回值c为number类型

如果不使用泛型
```typescript
function map(o: any): any{
    let a: any
    // 做一些操作
    return a
}
let b = map('123')
let c = map(123)
// b和c都为any
```
b和c的都为any类型

在很多情况下ts编译器可以自动推导类型, 比如T的类型可以通过参数o推导
```typescript
function map<T>(o: T): T {
    let a: T
    // 做一些操作
    return a
}
let b = map('123')
let c = map(123)
// b的类型为string
// b的类型为number
```
当编译器可以推导出类型的时候可以省略对类型变量的指定


回到最初的问题，使用泛型定义log函数
```typescript
function log<T>(message: T) {
    console.log(message.length) //error: Property 'length' does not exist on type 'T'
}
```
这时候编译器会报错message中没有length属性。在定义log方法的时候编译器依然无非确定类型T中是否有length属性，于是就有了泛型的约束

#### 泛型的约束
通过extends关键字来对泛型实现约束，extends后面的类型就是对泛型的约束，泛型在没有约束的情况下可以是任意的类型，通过约束后使得泛型必须是满足约束的类型
```typescript
type Length = {
    length: number
}
function log<T extends Length>(message: T) {
    console.log(message.length)
}
log('222')
log(111) // error: Argument of type '111' is not assignable to parameter of type 'Length'.
log({length: 3})
```
这是由于number类型没有length属性所以会报错。只要满足Length类型的都能使用log方法

ts中泛型使得类型有了更大的灵活性和可扩展性，同时能够保留类型信息

