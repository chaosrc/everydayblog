---
title: Golang 方法（一） 
date: 2019-11-02 
---


## Golang 方法（一）



自20世纪90年代初以来，面向对象编程一直是工业和教育领域的主流编程范式，几乎所有广泛使用的编程语言都对它进行了支持，Go 也不例外。

尽管没有普遍接受面向对象的的定义，但是对我们的目的来说，一个对象只是一个拥有方法的值或者变量，一个方法只是一个与特定类型关联的函数。



#### 方法声明

一个方法的声明是原本函数声明的变体，在函数名前面多了一个额外的参数。这个参数将函数附加到参数对应的类型上。

下面在一个几何包中定义方法：

```go
package geometry

import (
	"math"
)

// Point 位置
type Point struct {
	x, y float64
}

// Distance 计算两点之间的距离
func (p Point) Distance(q Point) float64 {
	return math.Hypot(p.y-q.y, p.x-q.x)
}
```

额外的参数 p 叫做方法的接受者（receiver）

在 Go 中对于 receiver 没有一个特定的名字比如 this 或 self，而是可以像其他任何参数一样定义 receiver 的名字。

在方法调用时，receiver 参数出现在方法名称之前，与方法声明时 receiver 在方法名称之前保持一直

```go
func main() {
	x := geometry.Point{1, 4}
	y := geometry.Point{3, 5}

	fmt.Println(x.Distance(y))
}
```

每一个类型对方法名称都有自己的命名空间，我们可以在其他类型上定义名称为 Distance 的方法。比如定义一个 Path 类型

```go
// Path 路径
type Path []Point

// Distance 计算 Path 的距离
func (p Path) Distance() float64 {
	var sum float64

	for i, point := range p {
		if i > 0 {
			sum += point.Distance(p[i-1])
		}
	}
	return sum
}
```

上面的 `Path` 是命名的 slice 类型，而不是和 Point 一样的 struct 类型，然而仍然可以为它定义方法。

在允许方法与任何类型相关联上，Go 与很多其他面向对象的语言不同。对于简单的类型比如 numbers、strings、slice、maps，定义额外的行为非常方便。方法可以声明在同一包中的任何命名类型上，只要基础类型不是指针或者接口。

