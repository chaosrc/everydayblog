---
title: Go RPC (六)
date: 2019-12-25
---


## Go RPC (六)



#### gRPC 流

RPC 是远程函数调用，每次调用的函数参数不能太大，否则会严重影响性能。因此传统的 RPC 方法调用并不适用于数据量大的场景。gRPC 框架针对服务端和客户端提供了流的特性。

在 HelloService 中增加一个支持双向流的方法 Channel
```
service HelloService {
    rpc Hello (String) returns (String);
    rpc Channel (stream String) returns (stream String);
}
```
上面的代码中使用 stream 关键字启动流特性。

重新生成代码后，服务端和客服端都增加了 Channel 方法
```go
type HelloServiceServer interface {
	Hello(context.Context, *String) (*String, error)
	Channel(HelloService_ChannelServer) error
}
type HelloServiceClient interface {
	Hello(ctx context.Context, in *String, opts ...grpc.CallOption) (*String, error)
	Channel(ctx context.Context, opts ...grpc.CallOption) (HelloService_ChannelClient, error)
}
```
HelloService_ChannelClient 和 HelloService_ChannelServer 接口用于流数据的双向通信
```go
type HelloService_ChannelClient interface {
	Send(*String) error
	Recv() (*String, error)
	grpc.ClientStream
}
type HelloService_ChannelServer interface {
	Send(*String) error
	Recv() (*String, error)
	grpc.ServerStream
}
```



服务端实现 Channel 方法

```go
func (service *HelloServiceImp) Channel(stream hello.HelloService_ChannelServer) error {
	for {
		req, err := stream.Recv()
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}
        err = stream.Send(&hello.String{Value: "Hello " + req.GetValue()})
        if err != nil {
            fmt.Println(err)
        }
	}
}
```



客户端首先调用 Channel 方法获取流
```go
channelClient, err := client.Channel(context.Background())
if err != nil {
    log.Fatal(err)
}
```

接收和发生操作分别在对立的 goroutine 里面进行
```go
// 发送操作
go func() {
    err := channelClient.Send(&hello.String{Value: "channel"})
    if err != nil {
        log.Fatal(err)
    }
}()
```

```go
// 接收操作
go func() {
    res, err := channelClient.Recv()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(res.GetValue())
}()
```
