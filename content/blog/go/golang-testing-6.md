---
title: Golang 测试（六）
date: 2019-12-07
---

## Golang 测试（六）



#### Profiling

基准测试对于测量特定操作的性能非常有用，但是当我们想要将一个慢的程序变快时，通常不知道从哪儿开始。

当我们想要仔细的查看程序的运行速度时，定位关键代码的最好的技术是 *profiling*。Profiling 是一个在运行期间基于对若干profile 事件取样的自动性能测试方式。

Go 支持多种 profiling，每一种都涉及一个不同方面的性能。go test 工具内置了多种 profiling ;

- CPU profile 定位执行最耗 CPU 时间的方法。

- heap profile 定位分配内存最多的语句。

- block profile 定位阻塞最长的 goroutine ，比如系统调用、channel 发送和接收、获取锁。

测试时只需要使用下面的参数即可收集对应的 profile

```go
go test -cpuprofile=cpu.out
go test -blockprofile=block.out
go test -memprofile=mem.out
```

对于非测试程序添加 profile 支持也是非常容易的，Go 的运行时 profile 能够使用 runtime API 程序控制开启。

一旦 profile 收集我们需要使用 pprof 工具来分析它（go tool pprof）。

下面的命令展示了如何收集和显示一个简单的 CPU profile：

```shell
$ go test -run=NONE -bench=ClientServerParallelTLS64 -cpuprofile=cpu.log net/http
BenchmarkClientServerParallelTLS64-4  6940            186778 ns/op           18864 B/op        231 allocs/op
PASS
ok      net/http        2.104s
```
```shell
 go tool pprof -text -nodecount=10 ./http.test cpu.log 
File: http.test
Type: cpu
Time: Dec 7, 2019 at 11:39pm (CST)
Duration: 2s, Total samples = 5070ms (253.06%)
Showing nodes accounting for 4050ms, 79.88% of 5070ms total
Dropped 172 nodes (cum <= 25.35ms)
Showing top 10 nodes out of 206
      flat  flat%   sum%        cum   cum%
    1620ms 31.95% 31.95%     1620ms 31.95%  runtime.pthread_cond_signal
     860ms 16.96% 48.92%      860ms 16.96%  runtime.pthread_cond_wait
     400ms  7.89% 56.80%      400ms  7.89%  runtime.madvise
     300ms  5.92% 62.72%      300ms  5.92%  syscall.syscall
     270ms  5.33% 68.05%      270ms  5.33%  runtime.memmove
     170ms  3.35% 71.40%      170ms  3.35%  vendor/golang.org/x/crypto/curve25519.ladderstep
     130ms  2.56% 73.96%      130ms  2.56%  runtime.memclrNoHeapPointers
     130ms  2.56% 76.53%      130ms  2.56%  syscall.rawSyscall
     100ms  1.97% 78.50%      100ms  1.97%  math/big.addMulVVW
      70ms  1.38% 79.88%      190ms  3.75%  bytes.(*Buffer).ReadFrom
```

`-text` 参数指定输出模式为文本模式，每一行一个方法，按照最‘热’的函数排序（即消耗 CPU 最多的），`-nodecount` 限制输出结果为 10 行





