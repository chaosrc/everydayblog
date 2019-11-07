---
title: Golang 方法（四） 
date: 2019-11-05
---


## Golang 方法（四） 



#### Struct 嵌入的组合类型

考虑下面的 ColoredPoint 类型

```go
type Point struct {
	X, Y float64
}

type ColoredPoint struct {
	Point
	Color color.RGBA
}
```
在 ColoredPoint struct 中我们嵌入一个 Point 来提供 X、Y 值，而不是去定义 X、Y、Color 三个字段。这种嵌入方式使用简短的语法来定义一个包含所有 Point 字段以及其他字段的 ColoredPoint 类型。如果我们想要，我们可以在不提及 Point 的情况下选择 ColoredPoint 中 Point 提供的字段，如下：
```go
cp := geometry.ColoredPoint{}

// 通过 Point 获取字段
cp.Point.X = 10
fmt.Println(cp.Point.X) // 10

// 直接获取字段
cp.X = 20
fmt.Println(cp.X)   // 20
```
方法调用也是相同的机制
```go
// 调用 Point 的 Distance 方法
distance := cp.Distance(geometry.Point{3,4})
fmt.Println(distance)
```

通过这种嵌入方式，允许通过多个字段的组合构建具有很多方法的复杂类型。


嵌入的匿名字段也可以是指向命名类型的指针，这种情况下字段和方法间接的从指针对象引用
```go
type ColoredPoint struct {
	*Point
	Color color.RGBA
}

cp := geometry.ColoredPoint{&geometry.Point{1,2}, color.RGBA{}}
distance := cp.Distance(geometry.Point{3,4})
fmt.Println(distance) // 17.11724276862369
```

一个 struct 可以有多个嵌入的匿名字段，ColoredPoint 可以声明为：

```go
type ColoredPoint struct {
	Point
	color.RGBA
}
```
然后 ColoredPoint 将会拥有 Point 和 RGBA 的所有方法，以及其他直接声明在 ColoredPoint 上面的方法。


通常方法只能定义在命名类型和它们的指针上，但是由于嵌入字段的存在，使得未命名的 struct 也能够有方法

```go
var cache = struct {
	sync.Mutex
	mapping map[string]string
}{
	mapping: make(map[string]string),
}

func lookup(key string) string {
	cache.Lock()
	defer cache.Unlock()
	return cache.mapping[key]
}
```

上面的 cache 是未命名 struct 类型，由于嵌入了 sync.Mutex 字段，其 Lock 和 Unlock 方法提升到了未命名的 struct 类型，于是 cache 变量可以自己调用这些方法
