---
title: Golang 并发（七） 
date: 2019-11-20
---

## Golang 并发（七）



#### 缓冲 Channels（Buffered Channles）

一个缓冲 channel 有一个元素队列，队列的最大长度由它创建时通过 make 函数的容量参数确定。

下面的语句创建一个 string 类型的缓冲 channel。

```go
ch := make(chan int, 3)
```
ch 以及它引用的 channel
![MhNFzD.png](https://s2.ax1x.com/2019/11/20/MhNFzD.png)


缓冲 channel 上的一个发送操作将会在它的队列的后面插入一个元素，一个接收操作将会在队列前面移除一个元素。如果 channel 已满，发送操作将会阻塞它所在的 goroutine 直到另一个 goroutine 的接收操作使得 channel 队列有空位。同样，如果 channel 为空，一个接收操作将会阻塞直到另一个 goroutine 发送值。

上面的缓冲 channel 能够在不阻塞 goroutine 的情况下发送三个值

```go
ch <- "A"
ch <- "B"
ch <- "B"
```
这时 channel 已满，如果再向 channel 发送则会阻塞

![MhasaR.png](https://s2.ax1x.com/2019/11/20/MhasaR.png)

如果我们接收一个值

```go
fmt.Println(<-ch) // "A"
```
channel 即不是满的也不是空的，这时发送操作或者接收操作都不会阻塞。通过这种方式， channel 的缓冲解耦了 goroutine 的发送和接收操作。

![MhdgTs.png](https://s2.ax1x.com/2019/11/20/MhdgTs.png)

调用内置的 cap 方法可以获取 channel 队列的容量
```go
fmt.Println(cap(ch)) // 3
```
len 方法返回channel 队列中当前缓冲的元素的数量
```go
fmt.Println(len(ch)) // 2
```

下面的 mirrorQuery 方法中 3 个请求并行，将它们的响应发送到缓冲 channel， 然后接收并且仅仅返回第一个响应。

```go
func mirrorQuery() string {
	ch := make(chan string, 3)

	go func() { ch <- request("a.mirror.com") }()
	go func() { ch <- request("b.mirror.com") }()
	go func() { ch <- request("c.mirror.com") }()

	return <-ch

}
func request(url string) string {//...
}
```

如果使用非缓冲的 channel ，那么另外两个比较慢的 goroutine 将会发送它们的响应到一个没有 goroutine 接收的 channel 上，这种情况叫做 goroutine 泄露，将会是一个 bug。不像变量的垃圾回收，泄露的 goroutine 不会自动回收，因此确保不需要的 goroutine 正确关闭是非常重要的。











