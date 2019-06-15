---
title: Typescript(一)：基本类型
date: 2019-06-15
description: 本篇是Typescript系列的第一篇，介绍了什么是Typescript、为什么要用Typescript以及Typescript的基本类型
---

本篇文章主要介绍Typescript，阅读之前需要对有Javascript有一定的了解

### Typescript是什么

根据 [Typescript官网][1] 的介绍'Typescript是Javascript类型的超集，可编译成纯Javascript'，Typescript（以下简称ts）是在Javascript（以下简称js）的基础上增加了类型系统，在编译的时候去掉ts的类型，编译成纯的js。

### 为什么要用Typescript
动态语言由于没有类型的限制很多问题在运行是才会出现，而静态语言在编译时就能发现，在一些稍微大型或者复杂的项目中动态语言更容易出现bug，在没有类型的情况下bug也不好定位，ts的出现很好的解决了这个问题，而且完全兼容js，不需要对原有的代码重写。有了类型提示后结合ide的代码提示，能够大大提高开发效率。越来越多的公司开始使用ts，ts已经有了很完备的生态和[发展路线][roadmap]。

### 安装Typescript
```sh
#需要先安装nodejs  https://nodejs.org/en/download/
npm install -g typescript
```

创建ts文件
```typescript
// hello.ts
function hello() {
    console.log('hello, world')
}
```

编译ts代码
```sh
tsc hello.ts
```
得到hello.js文件
```javascript
// hello.ts
function hello() {
    console.log('hello, world')
}
```
由于ts完全兼容js，ts里面写的是纯js代码所以编译后没有变化，接下来会给ts来增加类型

### Typescript的基本类型
由于ts完全兼容js所以js的基本类型在ts中存在, 在变量声明后加 `:`和'类型'
```typescript
// 布尔类型
let isLoading: boolean = true
// 字符串类型
let content: string = 'Lorem ipsum'
// 数字类型
let count: number = 42
// 数组
let list: number[] = [1,2,3]
let names: string[] = ['Lorem', 'ipsum']
// Tuple(元组)
let tuple: [number, string] = [20, 'hello']
// undefined类型
let uf: undefined = undefined
// null类型
let nl: null = null
// object类型
let o: object = {}
```
在变量声明类型后如果赋值其他的类型会在编译时报错，比如
```typescript
let isLoading: boolean = true
isLoading = 'y' // error： Type '"y"' is not assignable to type 'boolean'.

let tuple: [number, string] = [20, 'hello']
tuple[0] = 'foo' //error: Type '"foo"' is not assignable to type 'number'.

let nl: null = null
nl = 1 //error: Type '1' is not assignable to type 'null'

```
ts中增加了Enum（枚举类型）、any类型、void类型、never类型，Enum，void和never平时使用比较少大家可以去[官网][ts types]了解一下，最常用的是any类型，当我们不知道类型的时候，或者为了更高的灵活性，不想受到类型系统的限制时就可以用any类型，但同时也失去了类型限制的好处，合理的使用非常重要
```typescript
let anything: any = '42'
// 使用any后可以人缘赋值
anything = 42
anything = {}
anything = null
```

ts的基本类型就这些了，通过tsc编译，去掉所有的类型，默认编译到es5
```javascript
// 布尔类型
var isLoading = true;
// 字符串类型
var content = 'Lorem ipsum';
// 数字类型
var count = 42;
// 数组
var list = [1, 2, 3];
var names = ['Lorem', 'ipsum'];
// Tuple(元组)
var tuple = [20, 'hello'];
// undefined类型
var uf = undefined;
// null类型
var nl = null;
// object类型
var o = {};
var anything = '42';
// 使用any后可以人缘赋值
anything = 42;
anything = {};
anything = null;

```

下一篇会写ts的引用类型和接口类型






[1]: https://www.tslang.cn/
[roadmap]: https://github.com/microsoft/TypeScript-wiki/blob/master/Roadmap.md
[ts types]: https://www.typescriptlang.org/docs/handbook/basic-types.html