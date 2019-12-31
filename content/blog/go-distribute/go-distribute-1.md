---
title: 分布式 ID 生成器
date: 2019-12-28
---

## 分布式 ID 生成器



有时我们需要生成类似 MySQL 自增 ID 这样不断增大，同时有不会重复的 ID，以支持业务中高并发的场景。

Twitter 的 snowflake 算法是这种场景的一个典型解法

![](https://chai2010.cn/advanced-go-programming-book/images/ch6-snowflake.png)


首先确定一个 64 位的数字，类型位 int64，划分为四个部分，不包含第一个bit，因为这个 bit 为符号位。第一部分 41 位，表示时间戳，单位为毫秒，然后 5 位表示数据中心 id，然后再 5 位表示机器示例 id，最后 12 位为 循环自增 id（达到 111111111111 后会归 0 ）。

这样可以支持同一台机器上同一毫秒内产生 2^12 = 4096 个 id，1秒内 409.6 万个 id。

数据中心和示例 id 一共 10 位，可以支持 1024 台机器。

时间戳 41 位可以支持使用 69 年，时间戳可以是相对于某个时间的增量。



#### worker_id 分配


timestamp 和 sequence_id 由程序运行时生成，而 datacenter_id 和
worker_id 需要在部署阶段获取，并且程序一旦启动后就不可更改。

datacenter_id 一般会有对应的 id，可以在部署阶段获取。而 worker_id 是逻辑上给机器分配的 id，可以通过自增 id 的工具生成，比如 MySQL：

```mysql
>insert into work_id(ip) values("129.1.1.1");
Query OK, 1 row affected (0.02 sec)
> select last_insert_id();
+------------------+
| last_insert_id() |
+------------------+
|                2 |
+------------------+
1 row in set (0.00 sec)
```

然后将 MySQL 生成的 id 持久化到本地，让实例 id 保持不变。



#### 使用 snowflake

github.com/bwmarrin/snowflake 是轻量化的 snowflake 的 go 语言实现，其格式为:

```
+--------------------------------------------------------------------------+
| 1 Bit Unused | 41 Bit Timestamp |  10 Bit NodeID  |   12 Bit Sequence ID |
+--------------------------------------------------------------------------+
```

使用

```go
package main

import (
	"fmt"

	"github.com/bwmarrin/snowflake"
)

func main() {

	node, err := snowflake.NewNode(1)
	if err != nil {
		fmt.Println(err)
		return
	}

	// 生成 snowflake ID
	id := node.Generate()

	fmt.Printf("Int64    %d\n", id)
	fmt.Printf("String   %s\n", id)
	fmt.Printf("Base2    %s\n", id.Base2())
	fmt.Printf("Base64   %s\n", id.Base64())

	fmt.Printf("Time     %d\n", id.Time())
	fmt.Printf("Node     %d\n", id.Node())
	fmt.Printf("Sequence  %d\n", id.Step())
}
```

输出结果
```shell
$ go run .
Int64    1210963827558977536
String   1210963827558977536
Base2    1000011001110001101010010111101101001100000000001000000000000
Base64   MTIxMDk2MzgyNzU1ODk3NzUzNg==
Time     1577551249767
Node     1
Sequence  0
```





