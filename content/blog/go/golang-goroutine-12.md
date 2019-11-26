---
title: Golang 并发（十二）
date: 2019-11-25
---


## Golang 并发（十二）



#### 示例：聊天服务器

创建一个聊天服务器，让几个用户之间广播文本信息。这个程序有 4 种 goroutine，一个 main goroutine 和 广播 goroutine 实例，每个用户连接有一个 handleConn goroutine 和 clientWriter goroutine

main goroutine 的主要工作是监听和接收客户端的网络连接

```go
func main() {
	listen, err := net.Listen("tcp", ":9900")
	if err != nil {
		log.Fatal(err)
	}
	// 运行广播
	go createBroadcaster()
	for {
		conn, err := listen.Accept()
		if err != nil {
			log.Println(err)
		}
		go handleConn(conn)
	}
}
```

然后是广播 goroutine，它的本地变量 clients 记录当前连接的客户端集合

```go
type client chan<- string

var (
	entering = make(chan client)
	leaveing = make(chan client)
	message  = make(chan string)
)

func broadcaster() {
	clients := make(map[client]bool)
	for {
		select {
		case cli := <-entering:
			clients[cli] = true
		case cli := <-leaveing:
			delete(clients, cli)
			close(cli)
		case msg := <-message:
			for cli := range clients {
				cli <- msg
			}
		}
	}

}
```

广播 goroutine 监听全局的进出 channel，当监听到这些事件时更新 clients 集合。当监听到 message 事件时，给每个客户端发送这条消息。

handleConn 方法创建一个消息 channel 通过 entering channel 通知广播器有新的连接进入。然后读取客户端发送的每一行文本并发送给广播器。
```go
func handleConn(conn net.Conn) {
	name := conn.RemoteAddr().String()

	ch := make(chan string)
	entering <- ch
	message <- fmt.Sprintf("%s join\n", name)

	scanner := bufio.NewScanner(conn)

	// 监听 ch 事件将广播的 message 输出给客户端
	go func() {
		for msg := range ch {
			fmt.Fprintln(conn, msg)
		}
	}()

	// 读取客户端文本信息
	for scanner.Scan() {
		str := scanner.Text()
		message <- fmt.Sprintf("%s: %s\n", name, str)
	}

	leaveing <- ch
	conn.Close()
```

运行
```shell
$ go build .
$ ./chat
```

![MxJWJf.png](https://s2.ax1x.com/2019/11/26/MxJWJf.png)