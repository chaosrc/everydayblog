---
title: Golang 函数（三）
date: 2019-10-30
---


## Golang 函数（三）



#### 函数值

函数在 Go 中是第一类（first-class）值，和其他值一样，函数有类型，可以赋值给变量、作为参数传入函数或者从函数中返回。函数值可以像任何其他函数一样调用：

```go
func square(n int) int     { return n * n }
func negative(n int) int   { return -n }
func product(m, n int) int { return m * n }

f := square
fmt.Println(f(3))   // 9

f = negative
fmt.Println(f(10))  // -10

f = product(3, 4) // error: cannot use product(3, 4) (value of type int) as func(n int) int value in assignment
```

函数类型的零值为 nil。调用 nil 的函数会导致 panic

```go
var fn func(int) int

fn(3) //error: panic: runtime error: invalid memory address or nil pointer dereference
```

函数值可以和 nil 比较，但是它们之间无法比较，无法做为 map 的 key 使用



#### 匿名函数


命名的函数只能在包级别声明，但是我们能够在任何表达中，使用函数字面量来声明一个函数值。函数字面量的写法和函数声明类似，只是在 func 关键词后面没有函数名称，这种函数值被称为匿名函数

函数字面量允许我们在使用时定义一个函数，比如调用 strings.Map，它接受一个函数参数和字符串

```go
s := strings.Map(func(r rune) rune { return r + 1 }, "hello")
fmt.Println(s)   // ifmmp
```

更重要的是，这种方式定义的函数，能够获取整个词法环境，因此内部的函数能够引用到闭合函数的变量（也就是闭包），比如：

```go
func squares() func()int {
	var x int

	return func() int {
		x++
		return x * x
	}
}

sq := squares()
fmt.Println(sq())
fmt.Println(sq())
fmt.Println(sq())
```

squares 函数返回了另一个函数类型为 `func() int` 的函数，在返回的匿名函数中引用了 squares 函数中的本地变量 x


