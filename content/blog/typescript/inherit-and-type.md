---
title: Typescript(三)：接口的实现和继承
date: 2019-06-17
time: 22:00-24:00
description: 本篇为Typescript系列的第三篇，主要内容为Typescript的接口的实现和继承
---

> 本篇为Typescript系列的第三篇，主要内容为Typescript的接口的实现和继承。阅读之前需要了解Typescript的接口，可以参考之前的文章 [Typescript(二)：接口](https://chaosrc.github.io/everydayblog/typescript/interface/)

上一篇介绍了Typescript（以下简称ts）中的接口的定义，本篇来讲如何来实现接口以及接口的继承

## 接口的实现
#### 使用字面量对象实现接口
由于ts是鸭子类型，所以只要字面量对象满足接口属性，就是对接口进行了实现，例如：
```typescript
interface Man {
    name: string
    age: number
    eat: (food: string) => void
}
let student: Man = { 
    name: 'foo', 
    age: 20, 
    eat: (food) => console.log(food) 
}
```

#### 使用Class继承接口来实现
和Java中的接口类似，在class中使用implements关键词来对接口进行实现
```typescript
interface Man {
    name: string
    age: number
    eat: (food: string) => void
}
// 如果Student类没有满足Man接口无法编译通过
class Student implements Man {
    name = 'foo'
    age = 20
    school = ‘’
    eat(food: string) {
        console.log(food)
    }
}
```

#### 接口之间的继承

接口之间使用extends关键词可以相互继承，而且接口之间可以多重继承
```typescript
interface Man {
    name: string
    age: number
    eat: (food: string) => void
}
interface Parent {
    child: string
}

interface Student extends Man {
    school: string
}

// Teacher 同时拥有Parent 和 Man的属性
interface Teacher extends Parent, Man {
    teach: string
}

```

#### 接口继承类
对于一些使用过Java的同学来说，可能会决定奇怪，接口抽象程度其实更高，接口如何继承类？其实ts中接口继承类是只是继承了类的属性而不是其实现，可以看做是于把类的属性提取出来形成一个接口，然后接口之间进行继承。因为类可以创建出类型所以类也可以当作接口来使用
```typescript
// 先定义一个类
class Man {
    name = 'foo'
    age = 20
    eat(food: string) {
        console.log(food)
    }
}
// Student接口继承类Man，Student拥有了Man的属性 
interface Student extends Man {
    school: string
}

```

### 总结
接口是ts类型中非常重要的内容，是ts对js类型做出的扩展和抽象，在js基础上构建出类型系统，同时又有接口之间的多重继承以及从类创建接口这样的灵活性
