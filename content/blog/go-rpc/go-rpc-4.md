---
title: Go RPC (四)
date: 2019-12-23
---

## Go RPC (四)



#### 反向 RPC

通常的 RPC 是基于 C/S 结构的，RPC 服务端对应网络的服务器，RPC 客户端对应网络客户端。但是在一些特殊场景下，比如内网提供的 RPC 服务无法在外网访问，这时我们可以使用类似反向代理的技术，从内网主动连接到外网 RPC 服务器，然后基于 TCP 向外网提供 RPC 服务。

反向 RPC 服务代码
```go
type HelloService struct{}

func (servicev *HelloService) Hello(request string, response *string) error {
	*response = "Hello: " + request

	return nil
}

func main() {
	err := rpc.Register(new(HelloService))
	if err != nil {
		log.Fatal(err)
	}

	for {
		conn, _ := net.Dial("tcp", "localhost:8002")
		if conn == nil {
			time.Sleep(time.Second)
			continue
		}
		rpc.ServeConn(conn)
	}

}
```

提供反向 RPC 的服务不再主动监听 TCP 服务，而是主动连接到对方的 TCP 服务器，提供反向 RPC 服务。

客户端代码
```go
func main() {
	listener, err := net.Listen("tcp", ":8002")
	if err != nil {
		log.Fatal(err)
	}

	clientChan := make(chan *rpc.Client)

	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				fmt.Println(err)
				continue
			}
			clientChan <- rpc.NewClient(conn)
		}
	}()

	doClientWork(clientChan)

}

func doClientWork(clientChan <-chan *rpc.Client) {
	client := <-clientChan

	var response string
	err := client.Call("HelloService.Hello", "world", &response)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(response)
}
```
客户端监听 TCP 服务，建立请求后构造 RPC 客户端对象，然后执行正常的 RPC 调用