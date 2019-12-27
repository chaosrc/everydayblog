---
title: Go RCP (七)
date: 2019-12-26
---

## Go RCP (七)



#### 发布和订阅模式

在发布和订阅模式中，由调用者发起的发布行为类似于一个普通的函数调用，而被动的订阅者者类似于 gRPC 中客服端单向流的接收者。下面我们基于 gRPC 的流特性构造一个发布订阅系统。



首先定义 Protobuf 接口

```
syntax = "proto3";

message String() {
     string Value = 1;
}

service PubsubService {
    rpc Publish (String) returns (String);
    rpc Subsribe (String) returns (stream String);
}
```



使用 gRPC 插件生成接口代码

```go
type PubsubServiceClient interface {
	Publish(ctx context.Context, in *String, opts ...grpc.CallOption) (*String, error)
	Subsribe(ctx context.Context, in *String, opts ...grpc.CallOption) (PubsubService_SubsribeClient, error)
}
type PubsubService_SubsribeClient interface {
	Recv() (*String, error)
	grpc.ClientStream
}
type PubsubServiceServer interface {
	Publish(context.Context, *String) (*String, error)
	Subsribe(*String, PubsubService_SubsribeServer) error
}
```



服务端实现

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"strings"
	"time"

	"github.com/moby/moby/pkg/pubsub"

	"example.com/hello/rpc/pubsub/sub"
	"google.golang.org/grpc"
)

type PublishServiceImp struct {
	sub *pubsub.Publisher
}

func (p *PublishServiceImp) Publish(ctx context.Context, arg *sub.String) (*sub.String, error) {
	p.sub.Publish(arg.GetValue())
	return &sub.String{}, nil
}
func (p *PublishServiceImp) Subsribe(arg *sub.String, stream sub.PubsubService_SubsribeServer) error {
	ch := p.sub.SubscribeTopic(func(v interface{}) bool {
		if key, ok := v.(string); ok {
			if strings.HasPrefix(key, arg.GetValue()) {
				return true
			}
		}
		return false
	})
	for v := range ch {
		if err := stream.Send(&sub.String{Value: v.(string)}); err != nil {
			fmt.Println(err)
		}
	}
	return nil
}

func main() {
	serv := grpc.NewServer()
	sub.RegisterPubsubServiceServer(serv, &PublishServiceImp{pubsub.NewPublisher(time.Millisecond*100, 10)})

	lis, err := net.Listen("tcp", ":8004")
	if err != nil {
		log.Fatal(err)
	}

	err = serv.Serve(lis)
	if err != nil {
		log.Fatal(err)
	}
}
```



客户端向服务端发布信息

```go
func main() {
	conn, err := grpc.Dial(":8004", grpc.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	client := sub.NewPubsubServiceClient(conn)

	_, err = client.Publish(context.Background(), &sub.String{Value: "golang: hello Go"})
	if err != nil {
		log.Fatal(err)
	}

	_, err = client.Publish(context.Background(), &sub.String{Value: "docker: hello Docker"})
	if err != nil {
		log.Fatal(err)
	}
}
```
客户端向服务端订阅信息

```go
func main() {
	conn, err := grpc.Dial(":8004", grpc.WithInsecure())
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	client := sub.NewPubsubServiceClient(conn)
	stream, err := client.Subsribe(context.Background(), &sub.String{Value: "golang:"})
	if err != nil {
		log.Fatal(err)
	}
	for {
		reply, err := stream.Recv()
		if err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println(err)
			continue
		}
		fmt.Println(reply.GetValue())
		time.Sleep(time.Second * 1)
	}
}
```

