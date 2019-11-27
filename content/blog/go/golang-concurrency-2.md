---
title: Golang 共享变量并发(二)
date: 2019-11-27
---
 
## Golang 共享变量并发(二)



#### 互斥锁：sync.Mutex


之前我们使用缓冲 channel 做为计数信号来保证不会超过 20 goroutine 同时发送 HTTP 请求。同样的方式，我们可以使用容量为 1 的 channel 来保证每次最多只有一个  goroutine 访问某个共享变量，这种只有一个计数的信号也称为二元信号（binary semaphore）。

```go
var sema = make(chan struct{}, 1)
var balance int

func Deposit(amount int) {
	sema <- struct{}{}
	balance += amount
	<-sema
}

func Balance() int {
	sema <- struct{}{}
	defer func() { <-sema }()
	return balance
}
```

互斥锁模式非常有用，因此 sync 包中的 Mutex 类型直接支持它。Mutex 的 Lock 方法获取 token，Unlock 方法释放 token。

```go
var balance int
var mu sync.Mutex

func Deposit(amout int) {
	mu.Lock()
	balance += amout
	mu.Unlock()
}

func Balance() int {
	mu.Lock()
	defer mu.Unlock()
	return balance
}
```

考虑下面的撤销操作。首先减去撤销金额，如果余额小于 0 撤销失败，恢复余额并返回false，否则撤销成功返回 true。因为整个操作不是原子性的所以需要使用互斥锁

```go
func Withdraw(amount int) bool {
	mu.Lock()
	defer mu.Unlock()
	Deposit(-amount)
	if Balance() < 0 {
		Deposit(amount)
		return false
	}
	return true
}
```
但是上面的方法并不正确，因为 Deposit 会再次去调用 mu.Lock 获取 token，而互斥锁是无法重入的（re-entrant），从而会导致死锁。

通常的解决方法是将 Deposit 方法分开为两个方法：一个未导出的方法 deposit，假定已经锁存在然后执行真正的操作；另一个导出的方法 Deposit 获取锁后再调用 deposit 方法。同样在 Withdraw 中也调用 deposit 方法。

```go
func Deposit(amount int) {
	mu.Lock()
	deposit(amount)
	mu.Unlock()
}
func deposit(anount int) {
	balance += anount
}
func Withdraw(amount int) bool {
	mu.Lock()
	defer mu.Unlock()
	deposit(-amount)
	if balance < 0 {
		deposit(amount)
		return false
	}
	return true
}
```


