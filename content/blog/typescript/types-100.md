---
title: Typescript 及其基本类型
date: 2019-09-23
---

## Typescript 及其基本类型



Typescript 是 Javascript 的超集，可以编译成纯 Javascript。Typescript 中的 type 表示指类型，在 Javascript 语言的基础上增加了可选的类型系统、类以及接口等静态语言特性。

使用 Typescript 类型系统带来的静态语言特性，结合 IDE 类型推断、代码提示能够大大提高开发效率，可以对代码做静态检查。由于其完全兼容 Javascript 语法，可以逐步添加类型，进行平滑迁移，甚至与 Javascript 代码共存。Typescript 已经逐渐成为前端开发的趋势



Typescript 与 Javascript 的关系

<img src="https://raw.githubusercontent.com/basarat/typescript-book/master/images/venn.png" style="width:350px;text-algin:center">




#### Typescript 基础类型


Typescript 支持与 Javascript 相同的数据类型，同时提供了一些额外的类型

- 布尔值
最基本的数据类型值为 true/false，和 Javascript 一样用 boolean 类型表示

  ```ts
  let isRight: boolean = true
  ```

- 数值
和 Javascript 一样，所以数值都为浮点数，用 number 类型表示

```ts
// 十进制
let dec = 9
// 十六进制
let hex = 0x1dbdb1
// 八进制
let oct = 0o677
// 二进制
let bin = 0b010101
```

- 字符串
和 Javascript 中的一样表示文本数据，可用单引号或双引号表示，其类型为 string

```ts
let name: string = 'bob'
name = "sam"
```

- 数组
数组有两种定义方式，一种是在元素后面加 `[]`，表示由此元素组成的数组
```ts
let list: number[] = [1,2,3,4]
let names: string[] = ['bob', 'sam']
```
另一种是使用数组泛型

```ts
let list: Array<number> = [1,2,3,4]
let names: Array<string> = ['bob', 'sam']
```

- 元组 Tuple
元组类型可以用来表示一个已知数量和类型的数组，数组元素的类型可以不一样
```ts
let foo: [number, string]
foo = [100, 'bob']
// 如果类型不匹配则会报错
foo = ['bob', 100] // 报错，类型不匹配
```

- any 
有时候在编程阶段还不知道变量的类型，有可能是第三方库传人或者用户输入的动态内容，这时我们不希望编译器对此进行类型检查，那么可以用 any 类型来表示

```ts
let name: any = 'bob'
name = 123
name = false
```

- void
void 与 any 相反，它表示没有任何值，一般在函数的返回为空时用 void 表示。void 一般不用于变量的类型声明

```ts
function postUser(): void {

}
```

- null 和 undefined

在 Typescript 中，null 和 undefined 值，分别对应两种类型 null、undefined。默认情况下 null 和 undefined 是所有类型的子类型，比如可以将 null 或 undefined 赋值给 number 类型

```ts
let age: number = 10
age = null
age = undefined
```


- never

neber 类型表示永不存在的值的类型，比如抛出异常或者没有返回值的函数表达式

```ts
// 抛出异常
function error(msg: string): never {
    throw new Error(msg)
}
// 没有返回值
function loop(): never {
    while(true) {

    }
}
```

never 类型是任何类型的子类型，可以赋值给任何类型, 但是没有类型是 never 的子类型，即没有类型可以赋值给never类型（除了never本身之外）


- object

object 表示非原始类型，即除了 boolen, number, string, symbol, null 和 undefined 之外的类型

```ts
let obj: object
obj = {name: 'sam'}
```






