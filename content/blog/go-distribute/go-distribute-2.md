---
title: 分布式锁（一）
date: 2019-12-29
---

## 分布式锁（一）




#### trylock

某些场景下，我们希望一个任务有单一的执行者，后来的 goroutine 在抢锁失败后，需要放弃其流程，这时就可以使用 trylock

trylock 的意思是，尝试加锁，如果成功继续执行后续流程，如果失败也不阻塞流程，而是直接返回加锁的结果。

在 Go 语言中我们可以使用缓冲 1 的 channel 来模拟 trylock

```go
package main

import (
	"fmt"
	"sync"
)

type Lock struct {
	c chan struct{}
}

func NewLlock() *Lock {
	c := make(chan struct{}, 1)
	c <- struct{}{}
	return &Lock{c: c}
}

func (l *Lock) Lock() bool {
	result := false
	select {
	case <-l.c:
		result = true
	default:
	}
	return result
}

func (l *Lock) Unlock() {
	l.c <- struct{}{}
}

func main() {
	lock := NewLlock()

	var counter int

	var wg sync.WaitGroup

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			if !lock.Lock() {
				fmt.Println("lock failed")
				return
			}
			counter++
			lock.Unlock()
		}()
	}

	wg.Wait()
	fmt.Printf("Counter: %d\n", counter)
}
```
运行结果
```shell
$ go run .
lock failed
lock failed
lock failed
lock failed
lock failed
lock failed
lock failed
lock failed
Counter: 992
```

在单机系统中，trylock 并不是一个好的选择，因为大量的 goroutine 抢锁可能会导致 CPU 无意义的浪费。这种抢锁场景也被称为活锁。



#### 基于 Redis 的 setnx 

```go
package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/go-redis/redis"
)

var lockKey = "lock_counter"
var counterKey = "counter"

func incr(client *redis.Client) {

	// 加锁
	res := client.SetNX(lockKey, 1, time.Second*5)
	success, err := res.Result()
	if err != nil || !success {
		fmt.Println("lock failed")
		return
	}

	// counter 加 1
	counterRes := client.Incr(counterKey)
	_, err = counterRes.Result()
	if err != nil {
		fmt.Println(err)
	}

	delRes := client.Del(lockKey)
	unlockSuccess, err := delRes.Result()
	if !(err == nil && unlockSuccess > 0) {
		fmt.Println(err)
	}
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0, // 使用默认 DB
	})

	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			incr(client)
		}()
	}

	wg.Wait()

	res := client.Get(counterKey)
	result, err := res.Result()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Counter: %s\n", result)
}
```

调用 SetNX 方法和 trylock 非常相似，如果获取锁失败那么后面流程不执行