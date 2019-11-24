---
title: Golang 并发（十）
date: 2019-11-23
---


## Golang 并发（十）



#### 多路传输和 select

下面是一个倒计时程序，time.Tick 函数返回一个 channel，定时发送事件

```go
func count() {
	tick := time.Tick(time.Second *1)

	for num := 10; num >0 ; num--{
		fmt.Println(num)
		<- tick
	}
}
```
现在添加中断倒计时的功能，在倒计时过程中按下一个按键中断倒计时。首先定义一个 abord channel ，在一个 goroutine 中读取用户输入，如果成功则给 abord 发送值
```go
abord := make(chan struct{})
go func() {
    key := make([]byte, 1)
    os.Stdin.Read(key)
    abord <- struct{}{}
}()
```
此时每次倒计时需要等待两个时间：tick 和 abord。我们不能直接从两个 channel 接收，因为无论我们先尝试那一个操作都会阻塞，直到完成。我们需要 multiplex（多路传输）这些操作，需要使用 select 语句

```go
select {
    case <- ch1:
        //...
    case x := <- ch2:
        //...
    case ch3 <- y:
        //...
    default:
        //...
}
```

和 switch 语句一样 select 可以有多个 case 和 可选的 default。每个 case 指定一个*通信*（发送或接收）操作以及相关的语句块。

select 等待直到某个 case 的通信准备执行，然后执行这个通信操作以及这个 case 下面的语句，其他 case 的通信将不会发生。一个没有 case 的 select 语句（select {}）会永远等待。


添加中断功能后的 count 程序

```go
func count() {
	abord := make(chan struct{})

	go func() {
		key := make([]byte, 1)
		os.Stdin.Read(key)

		abord <- struct{}{}
	}()

	tick := time.Tick(time.Second * 1)

	for num := 10; num > 0; num-- {
		fmt.Println(num)
		select {
		case <-tick:
		case <-abord:
			fmt.Println("Abord")
			return
		}
	}
}
```

如果有多个 case 已经准备好，select 会随机选择一个执行，保证每个 channel 有相同的选择机会。

下面的 select 语句从 abord channel接收一个值，如果有则接收，没有则什么都不做。
```go
select{
    case <- abord:
        fmt.Println("abord")
        return
    default:
}
```
这是一个非阻塞（non-blocking）接收操作。重复这这种的操作被称为轮询通道（polling channel）

channel 的零值为 nil。nil channel 有时候非常有用，因为它发送和接收操作会永远阻塞，select 语句中 channel 为 nil 的 case 永远不会被选择。这让我们可以使用 nil 启用或禁用 case 通信来处理超时或取消操作。


