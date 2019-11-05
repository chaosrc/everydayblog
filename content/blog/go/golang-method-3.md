---
title: Golang 方法（三）
date: 2019-11-04
---


## Golang 方法（三）



#### 方法值和表达式

通常我们在同一个表达式中选择并调用方法，比如 `p.Distance()`，但是这两个操作是可以分开的。选择器 `p.Distance` 生成了一个方法值，这个函数将方法（p.Distance）绑定到特定的 receiver 值 p 。然后可以调用这个函数而不需要 receiver 值，只需要非recevier 的参数。

```go
func main() {
	p := geometry.Point{1,2}
	q := geometry.Point{3,4}
    // 方法值
	distance := p.Distance
    //调用方法值
    d := distance(q)
	fmt.Println(d) // 2.8284271247461903
}
```

与方法值相关的是方法表达式。当调用一个方法，而不是原始函数时，我们必须使用选择器语法这种特定的方式来提供 receiver。一个方法表达式写做 T.f 或 (*T).f (T 是一个类型)，产生一个函数值，其第一个常规参数取代 receiver，所以它可以使用正常方式调用

```go
func main() {
	p := geometry.Point{1, 2}
	q := geometry.Point{3, 4}
    // 方法表达式
    distance := geometry.Point.Distance
    // 调用方法
	d := distance(p, q)
    fmt.Println(d) // 2.8284271247461903
}
```

当我们需要在不同条件下来选择类型中的不同方法来对多个receiver 执行时，方法表达式就非常有用

```go
// pacakge geometry

//Add 相加
func (p Point) Add(q Point) Point {return Point{p.X + q.X, p.Y + q.Y}}

//Substract 相减
func (p Point) Substract(q Point) Point {return Point{p.X-q.X, p.Y-q.Y}}

type Path []Point
// Transition 移动
func (p Path) Transition(offset Point, add bool) Path {
    var op func (Point, Point) Point
    
	if add {
		op = Point.Add
	} else {
		op = Point.Substract
	}

	for i, point := range p {
		p[i] = op(point, offset)
	}
	return p
}
```

```go
func main() {
	offset := geometry.Point{1, 1}
	path := geometry.Path{
		{1,2},
		{3,4},
		{5,6},
	}
	path = path.Transition(offset, false)
	fmt.Println(path) // [{0 2} {2 4} {4 6}]
}
```

上面 Transition 方法中的 op 变量既可以是 Point 类型的 Add 方法也可以是 Substract 方法。



