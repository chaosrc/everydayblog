---
title: Typescript(二)：接口
date: 2019-06-16
decription: 本篇为Typescript系列的第二篇，主要介绍Typescript的接口
----

> 本篇文章主要介绍Typescript接口，阅读之前需要了解Typescript的基本类型，可参考[Typescript(一)：基本类型][basic type]

一门语言中的类型出了基本类型之外大部分都是自定义的类型，Typescript（以下简称ts）中提供两种定义类型的方式type（类型别名）和interface（接口）。[ts文档][https://www.typescriptlang.org/docs/handbook/interfaces.html]中是这样介绍的'TypeScript的核心原则之一是对值所具有的结构进行类型检查'，也就是鸭子类型。

## interface
如果了解过其他的一些静态语言比如Java里面也有interface，和ts中的interface比较相似，在js里面的对象没有限制可以动态的添加任意的属性和值，interface的作用就是对对象做出限制，在编译时给出提示不能随意的添加属性，先看一个简单的例子：
```typescript
// 定义接口
interface Rect {
    x: number
    y: number
}
// 指定变量类型
let rect: Rect = {x: 1, y: 0}
// 如果类型不满足也会报错
let rect2: Rect = {x: 1} // Property 'y' is missing in type '{ x: number; }' but required in type 'Rect'.

rect.y = 1
rect.z = 2 // error: Property 'z' does not exist on type 'Position'

```
#### 可选属性
interface对对象做出了限制，默认interface中的属性是必须的，但在使用的过程中时某个是配必须的，ts中可设置某个属性为可选属性,如下：
```typescript
// 可选属性是在属性后面加？号
interface Rect {
    x: number
    y: number
    z?: number
}
let rect: Rect = {x: 1, y: 2}
rect.z = 3
let rect2: Rect = {x: 1, y: 2, z: 3}
```
可选属性给了ts类型更多的灵活性
#### 只读属性
在一些情况下不希望interface里面的属性的值在申明后被修改，这时就可以用到只读属性了
```typescript
// 在属性前面加readonly关键词设置只读属性
interface Person {
    readonly name: string
    age: number
}
let friend: Person = {name: '小明', age: 20}
friend.name = '小张' //error: Cannot assign to 'name' because it is a read-only
```

#### 用interface来定义函数
interface除了能给对象定义类型，也可以定义函数的类型即函数的参数、返回值
```typescript
// 定义
interface Sum {
    // 括号里面函数的参数，冒号后面为函数的返回值的类型
    (x: number, y: number): number
}
// 使用
let sum: Sum

sum = (x, y) => x + y // ts会做类型推断，x、y多会认为是number类型

sum('1', 2) //error: Argument of type '"1"' is not assignable to parameter of type 'number'.
```

#### 可索引类型
在js中对象可以动态添加任意多的属性，如果在ts中每个属性都先申明才能使用，那么就失去了js动态类型的灵活性，而可索引类型给予了动态添加属性的能力同时又有类型限制
```typescript
interface Map {
    [x: string]: string
}
let map: Map = {a: 'foo'}
// map 中可以随意添加属性，但是类型必须是string
map.b = 'bar' //error: Type '1' is not assignable to type 'string'.ts
```

interface 的基本介绍就到这里了，下一步写interface的实现和继承以及类型别名




[basic type]: https://chaosrc.github.io/everydayblog/typescript/