---
title: Golang 复合类型（六）
date: 2019-10-26
---

## Golang 复合类型（六）



#### struct 字面量

一个 struct 类型的值可以通过指定字段的字面量来创建。有两种方式的字面量，第一种是按照字段顺序指定每一个字段的值
，如下：

```go
type T struct{
	a int
    B string
}

t := T{1, "foo"}
```
这种方式需要精确记住每一个字段的含义，如果之后给类型增加字段或者修改顺序，那么字面量声明也需要做相应的修改。因此这种形式的字面量一般在包内部或者对小 struct 类型使用

第二种方式是列出部分或所有的字段名称以及它们对应的值，比如：

```go
t2 := T{a: 1, B: "foo"}
t3 := T{B: "bar"}
```
如果某个字段没有在声明中指定，则初始化为类型零值。使用指定字段名字的方式，就不需要再按照字段的顺序声明

如果有未导出的字段，第一种方式无法在其他包中引用时使用，因为在其他包中无法获取未导出的变量

```go
// 包 a 定义 struct T
package a

// T t
type T struct{
	a int
	B string
}
```
```go
package main

// 引用包 a
import (
    "a"
)

t := structI.T{B: "foo"}
t2 := structI.T{1, "foo"}   // error: implicit assignment to unexported field a in structI.T literal
t3 := structI.T{a: 1, B: "foo"} // error: unknown field a in struct literal
```

struct 能够通过参数传递给函数以及从函数中返回

```go
type Position struct {
	x, y int
}

func zoom(p Position, f int) Position {
	p.x *= f
	p.y *= f
	return p
}
```

因为在 Go 中函数的参数是值传递，方法接受的是参数的拷贝而不是引用，所以对于大的 struct 或者需要修改传人的参数时通常使用指针传递参数

```go
func move(p *Position, x, y int) {
	p.x += x
	p.y += y
}

func main() {
    a := &Position{1, 2}
    move(a, 3, 3)
    fmt.Println(a)
}

```


如果 struct 所有字段都可以比较则这个 struct 是可以比较的。使用 == 或 != 操作符会按照顺序比较对应的字段

```go
b := Position{1,2}
c := Position{1,3}
z := Position{1,2}

fmt.Println(b == c)  // false
fmt.Println(b == z)  // true
```


