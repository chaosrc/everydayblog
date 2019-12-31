---
title: 负载均衡
date: 2019-12-30
---


## 负载均衡


现在有 n 个服务节点，需要从这 n 个服务中挑出一个来完成业务流程。每次随机选择一个服务节点，同时遇到下游返回错误时更换其他节点重试。

我们设计一个大小和节点数组相同的索引数组，每次新的请求过来，先对索引进行‘洗牌’，然后取第一个元素为服务节点，如果请求失败者选择下一个节点重试。

```go
package main

import (
	"fmt"
	"math/rand"
)

var endPoints = []string{
	"192.168.1.1",
	"192.168.1.23",
	"192.168.1.45",
	"192.168.1.30",
	"192.168.1.49",
	"192.168.1.7",
	"192.168.1.72",
}

func shuffle(slice []int) {
	l := len(slice)
	for i := 0; i < l; i++ {
		a := rand.Intn(l)
		b := rand.Intn(l)
		slice[a], slice[b] = slice[b], slice[a]
	}
}

func request() {
	var indexs = []int{0, 1, 2, 3, 4, 5, 6}

	shuffle(indexs)

	retryTimes := 3

	for i := 0; i < retryTimes; i++ {
		err := apiRequest(indexs[i])
		if err == nil {
			break
		}
	}
}

var counter = make(map[string]int)

// 模拟请求
func apiRequest(index int) error {
	counter[endPoints[index]]++
	return nil
}

func main() {
	for i := 0; i < 10000; i++ {
		request()
	}

	for key, val := range counter {
		fmt.Println(val, key)
	}
}
```

运行结果：
```shell
$ go run .
数量   地址
1281   192.168.1.23
1331   192.168.1.7
1290   192.168.1.30
1252   192.168.1.45
1255   192.168.1.49
2292   192.168.1.1
1299   192.168.1.72
```
可以看到上面的负载并不均匀，是因为洗牌不均匀导致第一个节点的选中概率较大。



#### 修正洗牌算法

在数学上的得到证明的还是经典的 fisher-yates 算法，每次随机挑选一个值，放在数组末尾，然后在剩下的 n-1 个数里面再随机挑选一个值，放在数组末尾，以此类推。

```go
func shuffle(slice []int) {
	l := len(slice)
	for i := l; i > 0; i-- {
		lastIdx := l - 1
		idx := rand.Intn(i)
		slice[idx], slice[lastIdx] = slice[lastIdx], slice[idx]
	}
}
```

Go 中也内置这个算法
```go
func shuffle3(n int) []int {
	return rand.Perm(n)
}
```

调用 rand.Perm 就可以获取我们想要的数组


