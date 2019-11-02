---
title: Golang 函数（五）
date: 2019-11-01
---


## Golang 函数（五）




#### Panic

在 Go 的类型系统中很多错误在编译时就能捕获，但是其他的，比如数组越界或者 nil 指针引用，需要运行时检查。当 Go 运行时检测到错误，它将发生 painc。

在一个典型的 painc 中，正常的执行停止，所有在当前 goroutine 的延迟（defered）函数将会被执行，程序崩溃并输出一条日志信息。输出的日志信息包括 painc 值，通常是某种类型的错误（error）信息，对于每一个 goroutine，会输出发生 panic 的函数调用栈。


并不是所有 painc 都来自于运行时。内置的 panic 函数能够被直接调用，它能够接受任何值做为参数。

```go
switch i {
case 1: //...
case 2: //...
case 3: // ...
default:
    panic("error")
}
```


当 panic 发生，所有的 defer 函数按照相反的顺序执行，开始于栈中最顶端的函数进行至 main 函数

```go
func f(x int) {
	fmt.Printf("f(%d)\n", x+0/x)
	defer fmt.Printf("defer f(%d)\n", x)
	f(x - 1)
}
func main(){
    f(3)
}
```

输出
```go
f(3)
f(2)
f(1)
defer f(1)
defer f(2)
defer f(3)
panic: runtime error: integer divide by zero

goroutine 1 [running]:
main.f(0x0)
        /Users/chao/workspace/go/gostart/functions/panic.go:18 +0x1be
...
```

上面的函数 f 在参数 x 为 0 时会发生 panic，defer 函数依次调用，程序终止，输出错误信息



#### Recover

终止程序通常是对 panic 的正确反应，但也不总是。可能需要使用某些方式恢复程序，或者至少在放弃之前做一些清理工作。这时可以使用 recover 内置的函数

如果 recover 函数在 defer 函数中被调用，并且这个包含 defer 语句的函数发生 panic，recover 结束当前的 panic 状态并且返回 panic 值。发生 panic 的函数不会在其停留的地方继续而是正常返回。如果 recover 函数在其他任何时候调用，不会产生任何影响并且返回 nil。

```go

func re() {
	defer func(){
		if err := recover(); err != nil {
			fmt.Println(err)
		}
	}()

	panic("error")

}
func main() {
	fmt.Println(1)
	re()
	fmt.Println(2)
}
```
输出
```sh
1
error
2
```
因为在 re 方法使用中 reover 恢复程序执行，所以 fmt.Println(2) 能正常执行


通常在同一个包中使用 recover 能够简化复杂或者不可预期的错误，但是通常的原则是，不要尝试 recover 其他包抛出的 panic。







