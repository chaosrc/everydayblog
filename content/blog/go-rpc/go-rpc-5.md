---
title: Go RPC (五)
dae: 2019-12-24
---


## Go RPC (五)



#### gRPC 简介
 
gRPC 是 Google 基于 Protobul 开发的跨语言 RPC 框架。gRPC 基于 HTTP/2 协议设计，可基于一个 HTTP/2 连接提供多个服务，对移动设备更加友好。



#### gRPC 技术栈

![](https://chai2010.cn/advanced-go-programming-book/images/ch4-1-grpc-go-stack.png)



#### gRPC 入门

创建 hello.proto 文件，定义 HelloService 接口

```go
syntax = "proto3";

message String {
    string value = 1;
}

service HelloService {
    rpc Hello (String) returns (String);
}
```

使用 propc-gen-go 的 gRPC 插件生成 gRPC 代码

```shell
$ protoc --go_out=plugins=grpc:. hello.proto 
```
生成一个 hello.pb.go 文件，里面包含了客户端和服务端接口
```go
type HelloServiceClient interface {
	Hello(ctx context.Context, in *String, opts ...grpc.CallOption) (*String, error)
}
type HelloServiceServer interface {
	Hello(context.Context, *String) (*String, error)
}
```



#### 服务端实现

```go
type HelloServiceImp struct{}

func (service *HelloServiceImp) Hello(ctx context.Context, request *String) (*String, error) {
	value := "hello" + request.GetValue()

	return &String{Value: value}, nil
}
```
启动服务端

```go
func main() {
	serv := grpc.NewServer()

	RegisterHelloServiceServer(serv, new(HelloServiceImp))

	listener, err := net.Listen("tcp", ":8003")
	if err != nil {
		log.Fatal(err)
	}

	err = serv.Serve(listener)
	if err != nil {
		log.Fatal(err)
	}
}
```



#### 客户端连接 gRPC

```go
func main() {
	conn, err := grpc.Dial("localhost:8003", grpc.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	client := NewHelloServiceClient(conn)

	reply, err := client.Hello(context.Background(), &String{Value: "world"})
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(reply.GetValue())
}
```