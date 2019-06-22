---
title: Typescript系列(六)：索引类型与映射类型
date: 2019-06-20
time: 22:30-01:00
description: 本篇介绍typescript中的索引类型与映射类型
---

## 索引类型与映射类型

### 索引类型

通过keyof(**索引类型查询操作符**)关键词,可以拿到类型的所有属性即索引
```typescript
type T = {
    name: string
    age: number
    phone: string
}
type K = keyof T
// K为'name|age|phone'类型
```
K的类型为T所有的属性的联合类型`name|age|phone`，这时K等同于
```typescript
type K = 'name'|'age'|'phone'
```
再通过in关键词来索引
```typescript
type M = {
    [P in K]: string
}
// M: {name: string, age: string, phone: string}
type M2 = {
    [P in K]: T[P]
}
// M2: {name: string, age: number, phone: string}
```
其中T[P]是**索引访问操作符**，通过像索引一样查询T中对应的类型。M的类型为`{name: string, age: string, phone: string}`, M2的类型为`{name: string, age: number, phone: string}`

索引类型非常强大可以创作出各种映射类型

### 映射类型

经常会出现一种情况是在旧的类型中创建一种新的类型但是保持类型的属性名不变而类型变化
```typescript
type DateRange = {
    start: Date
    end: Date
}
```
DateRange中的start和end的类型为Date，但是传输给后端的时候需要转换成string类型，当然也可以手动创建一个新的类型
```typescript
type DateRangeText = {
    start: string
    end: string
}
```
这样会造成代码冗余不易维护，这时就可以使用映射类型
```typescript
type MapType<T> = {
    [K in keyof T]: string
}
type DateRangeText = MapType<DateRange>

// DateRangeText = {start: string, end: string }
```
这时DateRangeText中start和end都为string类型

更灵活的方式时通过泛型指定Map后的类型
```typescript
type MapType<T, P> = {
    [K in keyof T]: P
}
type DateRangeText = MapType<DateRange, string>
// DateRangeText = {start: string, end: string }

type DateRangeNumber = MapType<DateRange, number>
// DateRangeText = {start: number, end: number }
```
ts中内置了一些映射类型，比如：
- Readonly<T> 将类型每一个属性映射为只读属性
- Partial<T> 将类型每一个属性映射为可选属性
- Pick<T, P> 从T中选取出P在中存在的的属性，其中P继承自keyof T

以下时他们的实现方式及用法
```typescript
// 定义Reaonly映射类型
type Reaonly<T> = {
    readonly [K in keyof T]: T[K]
}
// 将DateRange映射为readonly
let readonlyDate: Readonly<DateRange>
//修改readonlyDate属性会报错，Cannot assign to 'start' because it is a read-only property.
//readonlyData.start = new Date()

// 定义Partial映射类型
type Partial<T> = {
    [K in keyof T]?: T[K]
}
// start和end都成为了可选属性
let partialDate: Partial<DateRange> = {start: new Date()}

// 定义Pick映射类型
type Pick<T, P extends keyof T> = {
    [K in P]: T[K]
}
type StartDate = Pick<DateRange, 'start'>
//StartDate的类型为： {start: Date}

type EndDate = Pick<DateRange, 'end'>
//EndDate的类型为： {end: Date}

```

通过使用索引类型与映射类型，能够很大的提高代码的可复用性和可维护性


