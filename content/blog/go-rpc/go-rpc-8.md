---
title: Go RCP (八)
date: 2019-12-27
---

## Go RCP (八)



#### Token 认证

gRPC 为每个 gRPC 方法的调用提供了认证支持，可以基于用户 Token 对不同的方法访问进行权限控制。

要实现对每个 gRPC 方法的认证，需要实现 grpc.PerRPCCredentials 接口：

```go
type PerRPCCredentials interface {
	GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error)
	RequireTransportSecurity() bool
}
```
GetRequestMetadata 方法返回当前请求的认证信息。RequireTransportSecurity 方法表示是否要求底层使用安全协议

创建一个 Authentication 类型，用于实现用户名和秘密验证：

```go
type Authentication struct {
	User     string
	Password string
}

func (auth *Authentication) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	return map[string]string{"user": auth.User, "password": auth.Password}, nil
}

func (auth *Authentication) RequireTransportSecurity() bool {
	return false
}
```



客户端每次请求时将 Token 信息做为参数选项传人：
```go
auth := Authentication{
	User:     "foo",
	Password: "123456",
}

conn, err := grpc.Dial("localhost:8003", grpc.WithInsecure(), grpc.WithPerRPCCredentials(&auth))
```



服务端每个方法中通过 Authentication 中的 Auth 方法进行身份认证

```go
func (service *HelloServiceImp) Hello(ctx context.Context, request *hello.String) (*hello.String, error) {
	if err := service.auth.Auth(ctx); err != nil {
		return nil, err
	}

	value := "Hello " + request.GetValue()

	return &hello.String{Value: value}, nil
}

func (auth *Authentication) Auth(ctx context.Context) error {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return fmt.Errorf("missing credentials")
	}

	var appkey string
	var appid string

	if val, ok := md["user"]; ok {
		appid = val[0]
	}
	if val, ok := md["password"]; ok {
		appkey = val[0]
	}

	if appid != auth.User || appkey != auth.Password {
		return grpc.Errorf(codes.Unauthenticated, "invalid token")
	}

	return nil
}
```

详细的认证方法在 Auth 方法中完成。metadata.FromIncomingContext 方法可以获取到上下文中的元信息。
