---
title: Golang 并发（六）
date: 2019-11-19
---


## Golang 并发（六）



#### 单向 Channel 类型

随着程序的增长，将大型函数分解成小块是很自然的。上一篇例子中的程序分解为三个函数：

```go
func counter(out chan int)
func squarer(out, in chan int)
func printer(in chan int)
```
squarer 函数位于 pipleline 中间，接收两个参数：输入 channel 和输出 channel。虽然两个参数类型相同，但是它们的使用意图是完全相反的，in 仅仅用来接收值，而 out 仅仅用来发送值，而且没有任何东西阻止向 in 发送值以及从 out 接收值。

Go 类型系统中提供了单向 channel 类，只暴露发送和接收中的一个操作。类型 `chan<- int` 为只能发送整数的 channel 类型，只允许发送操作；类型 `<-chan int` 为只能接收整数的 channel 类型，只允许接收操作。

使用单向 channel 类型的 pipline 程序
```go
func pipeline() {
	naturals := make(chan int)
	squares := make(chan int)

	// Counter
	go counter(naturals)
	// Squarer
	go squarer(naturals, squares)

	// Printer
	printer(squares)
}

func counter(ch chan<- int) {
	for i := 0; i < 100; i++ {
		ch <- i
	}
	close(ch)
}

func squarer(in <-chan int, out chan<- int) {
	for x := range in {
		out <- x * x
	}
	close(out)
}

func printer(in <-chan int) {
	for x := range in {
		fmt.Println(x)
	}
}
```

在调用 counter(naturals) 时会隐式的将 naturals 的 channel int 类型转换为参数类型 `<-chan int` 类型。

在任何赋值语句中都可以将双向类型转为单向类型 channel，但是一旦将类型转换为单向类型比如 `chan<- int` 后，则没有方法从它里面获取到原来的双向 channel 类型值






