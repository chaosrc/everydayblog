---
title: Typescript系列(四)：类型别名以及交叉类型、联合类型
date: 2019-06-18
time: 22:30-00:30
description: 本篇介绍typescript中的类型别名及交叉类型、联合类型的定义使用
---

### 类型别名
类型别名就是给类型起一个新的名字，可以作用于任意类型包括基本类型、class类型、接口类型等，但是相对于接口来说不能用于继承

#### 给基本类型定义别名：
```typescript
type Name = string
let name: Name = 'foo'
```
那么name的类型依然是string，单独给基本类型定义别名一般没有什么意义，最常用的是给类、接口定义别名，定义别名的意义在于可以生成交叉类型和联合类型

#### 给接口定义别名：
```typescript
interface Student {
    name: string
    age: number
}
type Pupil = Student
```
Student和Pupil会被当做同一个类型
```typescript
let student: Student = {name: 'foo', age: 18}
let pupil: Pupil = {name: 'bar', age: 6}
pupil = student
```
type还可以像接口一样进行定义
```typescript
type Pupil = {
    name: string
    age: number
}
```
相对于定义了一个匿名的接口再给它定义一个别名，右边属性的定义完全和接口一致

#### 交叉类型
交叉类型可以把多个类型合并为一个类型，类似于接口中的多重继承。交叉类型是使用&符号链接多个类型

```typescript
type A = {
    a: string
}
type B = {
    b: string
}
type C = {
    c: string
}

type ABC = A & B & C

```
ABC中同时拥有a、b、c三个属性
由于js的灵活性，经常会出现这种需要合并多个类型的情况

#### 联合类型
如果说交叉类型是and的关系，那么联合类型就是或的关系。联合类型使用|符合链接多个类型，联合的后类型可以是其中几个类型中某的一个。同样由于js的灵活性，一个方法中的某个参数可能会是多种类型，这是就需要用到联合类型，而且这种场景非常常见。

```typescript 
type Value = number | number[]
function count(value: Value) {
    if (value instanceof Array) {
        return value.length
    } else {
        return 1
    }
}
count(1)
count([1,2,3,4])
```
count函数中的value即可以是number类型也可以是number数组。

交叉类型和联合类型在ts中的使用非常常见，对比接口的继承有很大的灵活性





