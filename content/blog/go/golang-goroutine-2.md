---
title: Golang 并发（二）
date: 2019-11-15
---


## Golang 并发（二）



#### 示例：并发时钟服务

网络是使用并发的常见领域，因为服务器通常一次处理多个客户端请求，每个客服端本质上相互独立。下面的例子中使用 net 包来建立网络服务。

首先创建一个顺序时钟服务，每秒钟将当前时间发送给客户端

```go
func clockServer() {
	server, err := net.Listen("tcp", ":8090")
	if err != nil {
		log.Fatalln("create server error")
	}

	for {
		conn, err := server.Accept()
		if err != nil {
			log.Panicln(err)
			continue
		}
		go handleConn(conn)
	}
}

func handleConn(conn net.Conn) {
	defer conn.Close()
	for {
		conn.Write([]byte(time.Now().Format("15:04:05\n")))
		time.Sleep(time.Second * 1)
	}
}
```

Listen 方法创建一个 net.Listener, 监听网络端口的请求连接，这个例子中监听 8090 TCP 端口。监听器的 Accept 方法会阻塞，直到有请求连接，然后返回一个 net.Conn 对象。在 handleConn 中每隔一秒向 conn 写入一次当前时间，发送给客户端。

因为服务是顺序执行，每次只能处理一个客户端，所以两个客户端连接时第二个必须等第一个结束才会有响应。

![MwpA3j.gif](https://s2.ax1x.com/2019/11/15/MwpA3j.gif)

只需要做一点小的改变就能使服务并发：在 handleConn 前面添加关键词 go ，使每一次 handleConn 调用都在自己的 goroutine 上

```go
...
for {
    conn, err := server.Accept()
    if err != nil {
        log.Panicln(err)
        continue
    }
    go handleConn(conn)
}
...
```

![MdzeRs.gif](https://s2.ax1x.com/2019/11/15/MdzeRs.gif)






