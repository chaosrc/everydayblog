---
title: Golang 共享变量并发（三）
date: 2019-11-28
---

## Golang 共享变量并发（三）



#### 读写互斥锁：sync.RWMutex

在一些场景下，我们需要一种特殊的锁允许只读操作彼此平行进行，但是写操作完全独占访问。这种锁称为多读单写锁（multiple readers, single writer lock），在 Go 中通过 sync.RWMutex 提供

```go
var balance int
var mu sync.RWMutex
func Balance() int {
	mu.RLock()  // 读锁
	defer mu.RUnlock()
	return balance
}
```

Balance 方法现在调用 RLock 和 RUnlock 来获取和释放读锁。RLock 只能被用在对共享变量没有写入操作的临界区。


#### 内存同步

你也许会疑问为什么 Balance 操作需要互斥，它只是单个操作，没有其他 goroutine 在它‘中间’执行的危险。这里有两个理由需要互斥，第一 Blance 不能在其他操作（比如 Withdraw ）‘中间’执行，第二同步不仅仅是多个 goroutine 的执行顺序，也受内存影响。

在一个现代计算机上可能有许多处理器，每一个都拥有主内存的本地缓存。为了效率，写入内存被缓存在每个处理器，只有在需要的时候才会排出（flushed）至主内存。像 channel通信和互斥操作这些基本的同步操作会使得处理器排出并提交它累计的写入，因此在这个点上 goroutine 执行的影响能够保证对其他运行的 goroutine 是可见的。

```go
var x, y int
go func() {
    x = 1
    fmt.Print("y:", y， “ ”)
}()
go func() {
    y = 1
    fmt.Print("x:", x， “ ”)
}()
```

上面的两个 goroutine 并发执行并且没有使用互斥锁来获取共享变量，因此输出结果有下面 4 种情况

```
y:0 x:1
x:0 y:1
x:1 y:1
y:1 x:1
```
但是下面的两种结果会让人感到意外：

```
x:0 y:0
y:0 x:0
```
它们的发生可能处决于编译器、CPU和其他的一些因素