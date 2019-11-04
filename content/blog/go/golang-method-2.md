---
title: Golang 方法（二） 
date: 2019-11-03
---

## Golang 方法（二）



#### 指针 receiver 方法

调用一个函数会拷贝每一个参数值，如果一个函数需要更新一个变量，或者如果参数很大我们需要避免拷贝它，这时我们需要通过变量的指针来传递地址。对于方法也是一样如果需要更新 receiver 变量，应该附加类型的指针，比如 *Point

```go
// ScaleBy 放大
func (p *Point) ScaleBy(i float64){
	p.X *= i
	p.Y *= i
}
```

这个方法的名字是 (*Point).ScaleBy ，括号不能省略，因为没有括号表达式会解析为 *(Point.ScaleBy).

在实际的编程中，一般约定如果任何一个 Point 方法有指针 receiver，那么 Point 所有方法都应该有一个指针 recevier，即使有些方法不需要指针。下面会同时使用指针和值的 receiver 来阐述它们之间的不同。


命名类型（Point）和它们的指针（*Point）是出现在 recevier 声明中的唯一类型。为了避免歧义，方法声明中不允许指针类型的命名类型：

```go
type P *Point 

func (p P) f() { // error: invalid receiver P (pointer or interface type)
}
```

(*Point).ScaleBy 可以通过提供 *Point 指针来调用，比如：

```go
func main() {
	x := geometry.Point{X: 1, Y: 4}

    // 获取变量指针赋值给新的变量
	px := &x
	px.ScaleBy(0.8)
    fmt.Println(px) // &{0.8 3.2}
    
    // 获取变量指针直接调用指针 reveicer 方法
	(&x).ScaleBy(1.2)
	fmt.Println(x)  //{0.96 3.84}
}
```

上面的这两种方式都不太优雅，还好有语言的帮助，如果 receiver p 是一个类型为 Point 的变量，但是需要一个 *Point 的 receiver，我们可以使用下面的简写：

```go
p.ScaleBy(0.8)
```

编译器将会对变量进行隐式 &p 操作。这种方式仅仅对变量有效，包括 struct 字段比如 p.X 和数组元素 perim[0]。

```go
// package geometry
type Line struct {
	Start Point
	End Point
}

// pakcage main

// struct 字段
line := geometry.Line{
    geometry.Point{1, 2},
    geometry.Point{3, 4},
}
line.Start.ScaleBy(2)
fmt.Println("Line", line) // Line {{2 4} {3 4}}

// 数组元素
points := []geometry.Point{{1, 2}, {3, 4}}
points[0].ScaleBy(0.8)

fmt.Println("Points", points) // [{0.8 1.6} {3 4}]
```

上面的 `line.Start.ScaleBy(2)` 等同于 `(&line.Start).ScaleBy(2)`，`points[0].ScaleBy(0.8)` 等同于 `(&points[0]).ScaleBy(0.8)`。

不能在不能寻址的 Point receiver 上面调用 *Point 方法，因为无法获取到临时地址。比如：

```go
geometry.Point{1,2}.ScaleBy(0.8)  //cannot take the address of geometry.Point literal
```

但是使用 *Point receiver 可以调用 Point 方法，因为可以通过地址获取值，同样编译器会插入一个隐式的 * 操作：

```go
pptr := &geometry.Point{3,4}
// 下面两种方法调用是相同的
pptr.Distance(q)
(*pptr).Distance(q) 
```


如果一个命名类型 T 的所有方法都是 T 类型的 receiver，那么复制这个类型的实例是安全的，调用它的任何方法都必然会产生一份副本。但是如果 T 有任何方法是指针 reveiver，应该避免复制 T 的实例，因为这样做可能会侵犯内部的不变性，比如复制一个 bytes.Buffer 实例，可能会导致原本的实例和复制的实例使用同一个底层 bytes 数组
