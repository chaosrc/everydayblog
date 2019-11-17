---
title: Golang 并发（一）
date: 2019-11-14
---


## Golang 并发（一）



如今并发编程越来越重要，web 服务器一次处理上千次请求，前端页面渲染 UI 动画同时进行计算和网络请求，甚至传统的数据读取、计算和输出也使用并发来隐藏潜在的 I/O 操作，充分利用现代计算机的多核 CPU。

Go 中有两种方式的并发编程。一种是使用 goroutines 和 channels，支持*通信顺序进程*即 CSP （communicating sequential processes），一种并发模型，其中值在独立的活动之间传递但是变量在很大程度上限制与单个活动上。另一种是传统的*共享变量多线程*。

在很多环境下中，并发编程实现正确的共享变量访问并不容易。Go 鼓励通过通信传递来共享值，任何时候只有一个 goroutine 访问某个变量。一个总的原则是：

> Do not communicate by sharing memory; instead, share memory by communicating
> 不要以共享内存进行通信，而是，通过通信来共享内存




#### Goroutines

在 Go 中，每一个并发的执行行为被称为 *goroutine*。考虑一个程序，有两个函数，一个计算另一个输出，两个之间互不调用。一个顺序程序可能会调用一个然后调用另一个，但是并发程序使用两个或多个 goroutine，同时调用两个方法。

当一个程序开始运行，它唯一的 goroutine 是调用 main 函数的 goroutine，它被称为 main goroutine。新的 goroutine 使用 go 语句来创建，go 语句是在原始函数或方法调用前使用关键词 go 做为前缀。go 关键词会导致函数在新的 goroutine 中执行。

```go
f()    // 调用函数 f() 并等待函数返回
go f() // 创建一个新的 goroutine 调用 f()，不等待函数返回
```

下面的例子，在主 goroutine 中计算第 45 个斐波纳契数，在它运行期间给用户提供一个正在运行的视觉提示。

```go
package main

import (
	"time"
	"fmt"
)

func Fib(n int) int {
	if n < 2 {
		return 1
	}
	return Fib(n-1) + Fib(n-2)
}

func Spinner(t time.Duration) {
	for {
		for _, r := range `-\|/` {
			fmt.Printf("\r%c", r)
			time.Sleep(t)
		}
	}
}

func main() {
	go Spinner(time.Millisecond * 100)
	n := Fib(45)

	fmt.Printf("\rFib(45)=%d\n", n)
	
}
```

运行
![](https://s2.ax1x.com/2019/11/14/MUYbgs.gif)

在 main 函数返回后，所有的 goroutine 会被终止，然后程序退出。除了 main 函数返回或程序退出外，没有其他编程方式从一个 goroutine 来停止其他的 goroutine，但是可以通过通信的方式来请求 goroutine 自我停止。
