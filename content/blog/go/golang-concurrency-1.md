---
title: Golang 共享变量并发（一）
date: 2019-11-26
---


## Golang 共享变量并发（一）



#### 竞态条件

在一个顺序执行的程序中，一个程序只有一个 goroutine，程序的每一步都按照程序逻辑决定的顺序执行，在有两个或多个 goroutine 的程序中，每一个 goroutine 的每一步都按照顺序执行，但是通常我们不知道一个 goroutine 的事件 x 是发生在另一个 goroutine 事件 y 的前面还是后面，或者是同时发生。当我们无法确定的说一个事件发生在另一个事件之前时，事件 x 和 y 为并发。

竞态条件是程序因为多个 goroutine 的一些交叉操作而没有给出正确结果的情况。


下面的程序并发更新 x 为两个不同长度的 slice。

```go
var x []int
go func (){
    x = make([]int, 10)
}()
go func () {
    x = make([]int, 1000000)
}()
x[99999] = 1
```
最后一个语句中 x 的值不确定，可能是 nil、长度为 10 的slice或长度为 1000000 的 slice，这种现象被称为未定义行为（undefined behavior）。


有三种方式避免数据竞争

第一种：不修改变量。比如下面的 map，在每个 key 第一次请求时填充，如果 Icon 顺序执行，程序可以正常工作，但是如果 Icon 并发调用，则对 map 的获取存在数据竞争。

```go
var icons = make(map[string]image.Image)

func loadIcon(name string) image.Image

// 并发不安全
func Icon(name string) image.Image {
	icon, ok := icons[name]
	if !ok {
		icon = loadIcon(name)
		icons[name] = icon
	}
	return icon
}
```
如果我们在其他 goroutine 创建之前，用所有需要的数据初始化 map，然后不再修改，那么任意数量的 goroutine 都可以安全的并发调用 Icon 方法。

```go
var icons = map[string]image.Image{
	"spades.png": loadIcon("spades.png"),
	"hearts.png": loadIcon("hearts.png"),
	....
}

func loadIcon(name string) image.Image

// 并发安全
func Icon(name string) image.Image {

	return icons[name] 
}
```

第二种方式是避免从多个 goroutine 获取变量。因为其他 goroutine 无法直接获取变量，因此必须使用 channel 发送请求来更新变量，这也是 Go 的标语“不要通过共享变量来通信，而是要通过通信来共享变量”的含义。

下面的程序通过 channel 来共享变量
```go
var deposits = make(chan int)
var balances = make(chan int)

func Deposit(amount int) {
	deposits <- amount
}
func Balance() int {
	return <-balances
}

func teller() {
	var balance int

	for {
		select {
		case amount := <-deposits:
			balance += amount
		case balances <- balance:

		}
	}
}

func init() {
	go teller()
}

func main() {
	done := make(chan int)

	go func() {
		for i := 0; i < 10000; i++ {
			Deposit(1)
		}
		done <- 1
	}()

	go func() {
		for i := 0; i < 10000; i++ {
			Deposit(1)
		}
		done <- 1
	}()
	for i := 0; i < 2; i++ {
		<-done
	}
	fmt.Println(Balance())
}
```

第三种是允许多个 goroutine 获取变量，但是控制每次只有一个 goroutine，这种方式叫做互斥。