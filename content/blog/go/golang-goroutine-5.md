---
title: Golang 并发（五）
date: 2019-11-18
---


## Golang 并发（五）



#### Piplines

Channel 可以将 goroutine 连接在一起，所以一个 goroutine 的输出可以做为另一个的输入，下面的图展示了三个 goroutine 被两个 channel 连接的情况。

![Mc8hX8.png](https://s2.ax1x.com/2019/11/18/Mc8hX8.png)

第一个 goroutine —— Counter 生成整数 0、1、2...，并且通过 channel 发送至第二个 goroutine —— squarer 接收每一个值进行平方计算，然后通过另一个 channel 发送给第三个 goroutine —— printer 打印接收到的值。

```go
func pipeline() {
	naturals := make(chan int)
	squares := make(chan int)

	// Counter
	go func() {
		for i := 0;; i++ {
			naturals <- i
		}
	}()
	// Squarer
	go func() {
		for {
			x := <-naturals
			squares <- x * x
		}
	}()
	// Printer
	for {
		fmt.Println(<-squares)
	}
}
```
上面的程序会无限的打印平方数，如果我们需要限制它的数量，那么我们可以让发送者告诉接收者让它停止接收，使用内置的 close 函数就可以做得这一点：

```go
clase(naturals)
```

当一个 channel 关闭后，任何发送操作都会 panic。当关闭的 channel 的最后一个发送元素被接收后，所有的接收操作将会非阻塞执行并且产生一个零值。

没有方法可以检查一个 channel 是否关闭，但是接收操作可以接收两个值：接收一个 channel 元素和一个 bool 值，bool 值为 true 时接收成功，为 false 表示 channel 已经关闭。对于上面的 Squarer 可以通过这种方式，当 naturals 关闭时跳出循环

```go
// Squarer
go func() {
    for {
        x, ok := <-naturals
        if !ok {
            break
        }
        squares <- x * x
    }
    close(squares)
}()
```

还有一种更加方便的语法：使用 for range 循环来迭代 channel，在接收到最后一个值时循环自动结束。

```go
// Squarer
go func() {
    for x := range naturals {
        squares <- x *x 
    }
    close(squares)
}()
```

上面的例子中我们修改 Counter 循环 100 次后关闭 naturals channel，使 Squarer 循环终止，关闭 squares channel，最后 main goroutine 结束循环程序退出。

```go
func pipeline() {
	naturals := make(chan int)
	squares := make(chan int)

	// Counter·
	go func() {
		for i := 0; i < 100; i++ {
			naturals <- i
		}
		close(naturals)
	}()
	// Squarer
	go func() {
		for x := range naturals {
			squares <- x *x 
		}
		close(squares)
	}()
	// Printer
	for x := range squares {
		fmt.Println(x)
	}
}
```