---
title: Golang 并发（三）
date: 2019-11-16
---

## Golang 并发（三）



#### 示例：并发 echo 服务

前面的时钟服务中每个连接使用一个 goroutine 。下面的 echo 服务中我们在每个连接中使用多个 goroutine。大多数 echo 服务仅仅是写入读到的内容，只需要对 handleConn 做如下修改：
```go
func handleConn(conn net.Conn) {
	defer conn.Close()
	io.Copy(conn, conn)
}
```

一个更有意思的 echo 服务是模拟真实的回音，首先大声回应（"HELLO"），然后是中等的("Hello")，最后是小声的（“hello”）。

```go
func echo() {
	server, err := net.Listen("tcp", ":8091")

	if err != nil {
		log.Fatal(err)
	}

	for {
		conn, err := server.Accept()
		if err != nil {
			log.Panicln(err)
			continue
		}
		go handleEchoConn(conn)
	}
}


func handleEchoConn(c net.Conn) {
	scanner := bufio.NewScanner(c)
	for scanner.Scan() {
		handleEcho(c, scanner.Text())
	}
	c.Close()
}

func handleEcho(c net.Conn, out string) {
	fmt.Fprintln(c, "\t", strings.ToUpper(out))
	time.Sleep(time.Second * 1)

	fmt.Fprintln(c, "\t", out)
	time.Sleep(time.Second * 1)

	fmt.Fprintln(c, "\t", strings.ToLower(out))
	time.Sleep(time.Second * 1)
}
```

运行
```shell
$ nc localhost 8091
Hello?
	 HELLO?
	 Hello?
	 hello?
Is there anybody there?
	 IS THERE ANYBODY THERE?
Yooo-hooo!
	 Is there anybody there?
	 is there anybody there?
	 YOOO-HOOO!
	 Yooo-hooo!
	 yooo-hooo!
```

注意第三个 echo 输出需要等到第二个结束。真实的回音应该是是相互独立的，为了模拟这种情况，我们需要使用更多的 goroutine。我们在 handleEcho 方法调用前加 go 关键词，使每个 handleEchoe 运行在自己的 goroutine 上：

```go
func handleEchoConn(c net.Conn) {
	scanner := bufio.NewScanner(c)
	for scanner.Scan() {
		go handleEcho(c, scanner.Text())
	}
	c.Close()
}
```

再次运行
 ```shell
$ nc localhost 8091
Hello?
	 HELLO?
	 Hello?
	 hello?
Is there anybody there?
	 IS THERE ANYBODY THERE?
Yooo-hooo!
	 YOOO-HOOO!
	 Is there anybody there?
	 Yooo-hooo!
	 is there anybody there?
	 yooo-hooo!
 ```

 要服务端使用并发（不仅仅是处理多个客户端连接甚至在单个连接中），只需要插入关键词 go。但是使用并发时我们需要仔细考虑并发调用的的安全性。