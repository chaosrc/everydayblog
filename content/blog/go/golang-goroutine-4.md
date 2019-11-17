---
title: Golang 并发（四）
date: 2019-11-17
---


## Golang 并发（四）



#### Channels

*channels* 是 goroutine 之间的连接，是让一个 goroutine 发送值到另一个 goroutine 的一个交流机制。每一个 channel 是一个特定类型值的管道，这个类型被称为 channel 的元素类型。元素类型为 int 的 channel 类型写做 `chan int`。

创建一个 channel 可以使用内置的 make 方法：
```go
ch := make(chan int) // ch 的类型为 chan int
```

和 map 一样，一个 channel 是 make 函数创建的数据结构的引用。复制一个 channel 或者做为一个参数传递给函数时，复制的是引用。和其他引用类型一样，channel 的零值为 nil。

两个相同类型的 channel 可以使用 == 比较，当两个 channel 引用同一个 channel 数据结构时，比较结果为 true。

channel 有两个主要的操作: 发送和接收，总体来说就是*交流*。一个发送语句通过 channel 从一个 goroutine 传输值到另一个执行相应的接收表达式的 goroutine。两个操作都使用 `<-` 操作符。

```go
ch <- x  // 发送语句
x = <-ch // 赋值语句中的接收表达式
<-ch     // 接收语句；结果被丢弃
```
channel 支持第三个操作：关闭（close），关闭操作设置一个标志表示这个 channel 将不会再有值发送。在一个关闭的 channel 上执行接收操作会接收已经被发送的值，直到没有值剩下，之后任何接收操作都立即完成，并产生 channel 元素类型的零值。

使用内置的 close 方法关闭 channel

```go
close(ch)
```
简单的调用 make 方法创建的 channel 叫做 *unbuffered channel*，但是 make 方法接收可选的第二个参数，一个被称为 channel 容量的整数。如果容量不为 0，make 方法创建一个 *buffered channel*。
```go
ch := make(chan int)    // unbuffered channel
ch := make(chan int, 0) // unbuffered channel
ch := make(chan int, 3) // buffered channel
```



#### Unbuffered Channels

一个在 unbufferd channel 上执行发送操作阻塞发送的 goroutine，直到另一个 goroutine 在同一个 channel 执行对应的接收操作，这时值的传输完成，两个 goroutine 可以继续执行。相反，如果一个接收操作先开始，接收的 goroutine 阻塞直到另一个 goroutine 在同一个 channel 执行发送操作。

通过 unbuffered channel 通信使得发送和接收的 goroutine 同步（synchronize）。所以 unbuffered channel 也被称作同步 channel （synchronous channels）。

main goroutine 结束时会关闭其他的 goroutine，下面的例子使用同步 channel 使得 main goroutine 等待其他 goroutine 完成再退出

```go
func main() {
	ch := make(chan int)

	go func() {
		time.Sleep(time.Second * 3)
		fmt.Println("done")
		ch <- 1
	}()

	<-ch
}
```
