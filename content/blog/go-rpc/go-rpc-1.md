---
title: Go RPC (一)
date: 2019-12-20
---


##  Go RPC (一)



RPC 是远程过程调用的简称，是分布式系统节点之间的一种交流方式。Go 标准库中提供了一个简单的 RPC 实现。



#### RPC 版 “Hello world“

创建 HelloService 类型

```go
type HelloService struct {
}

func (h *HelloService) Hello(request string, response *string) error {
	*response = "Hello: " + request
	return nil
}
```
Hello 方法必须满足 Go 中 RPC 规则：接收两个序列化参数，第二个为指针类型，并且返回一个 error 类型。



注册 RPC 服务

```go
import (
	"log"
	"net"
	"net/rpc"
)
func main() {
	rpc.RegisterName("HelloService", new(HelloService))

	listener, err := net.Listen("tcp", ":9999")
	if err != nil {
		log.Fatal(err)
	}
	conn, err := listener.Accept()
	if err != nil {
		log.Fatal(err)
	}

	rpc.ServeConn(conn)
}
```

RegisterName 方法会将所有满足 RPC 规则的函数注册到 “HelloService” 服务空间下。



创建客户端请求

```go
import (
	"fmt"
	"log"
	"net/rpc"
)

func main() {
	client, err := rpc.Dial("tcp", ":9999")
	if err != nil {
		log.Fatal(err)
	}
	var response string
	err = client.Call("HelloService.Hello", "world", &response)
	if err != nil {
		log.Fatal(err)
	}
    fmt.Println(response) //Hello: world
}
```

