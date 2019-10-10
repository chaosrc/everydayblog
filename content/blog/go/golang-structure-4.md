---
title: Go 程序结构（四）
date: 2019-10-10
---

## Go 程序结构（四）



#### new 函数

另一个创建变量的方式是使用内置的 `new` 函数。表达式 `new(T)` 创建了 T 类型的一个未命名变量，初始化为 T 类型零值，并且返回它的地址

```go
func main() {
	p := new(int)
	fmt.Println(*p) // 0

	*p = 2
	fmt.Println(*p) // 2
}
```
使用 new 表达式和原本的创建局部变量然后获取其地址是一样的，但是少了声明变量的过程直接拿到地址，因此 new 表达式只是一个语法。下面的两个方法是等价的

```go
func newFn() *int {
	return new(int)
}
```

```go
func newFn() *int {
	var a int
	return &a
}
```

new 是一个预定义函数而不是关键词，因此 new 可以被重新定义

```go
func foo(new int, old int) int {
	return new - old
}
```



#### 变量生命周期

变量的生命周期是程序执行时变量存在的时间间隔。包级别的变量生命周期是整个程序执行时间，局部变量的生命周期是创建实例开始到变量无法达到（unreachable)

```go

func forLoop() {
	for i := 0; i < 10; i++ {
		fmt.Println(i * i)
	}
}
```
上面的代码中 i 只在 for 循环内部有效



#### 赋值

通过赋值语句可以更新变量的值，最简单的形式是使用 = 赋值。

```go
func assig() {
	x = 1
	*p = true
	person.name = "jack"
	count[x] = count[x] * scale
}
```

每个算术和按位运算符都有对应的赋值操作

```go
func assig2() {
    b := 1
    
	b += 1
    b++
    
	b -= 1
	b--
}
```