---
title: Go RPC (三)
date: 2019-12-22
---

## Go RPC (三)



#### 基于 RPC 实现 Watch 功能

使用 RPC 框架实现一个基本的 Watch 功能，当系统满足某种条件时 Watch 方法返回监控结果。

基于 RPC 创建一个简单的基于内存的 KV 数据库，首先定义服务：

```go
type KVService struct {
	m      map[string]string
	filter map[string]func(string)
	mu     sync.Mutex
}

func NewKVService() *KVService {
	return &KVService{
		m:      make(map[string]string),
		filter: make(map[string]func(string)),
	}
}
```
其中 m 为 map 类型用来储存数据，filter 用来保存 Watch 中定义的函数调用列表，mu 为互斥锁保证线程安全。



Get 和 Set 方法

```go
func (s *KVService) Get(key string, repaly *string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if value, ok := s.m[key]; ok {
		*repaly = value
		return nil
	}

	return fmt.Errorf("%s Not Found\n", key)
}

func (s *KVService) Set(kv [2]string, replay *struct{}) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	key, value := kv[0], kv[1]

	if oldValue := s.m[key]; oldValue != value {
		for _, f := range s.filter {
			f(key)
		}
	}
	s.m[key] = value
	return nil

}
```



Watch 方法
```go
func (s *KVService) Watch(timeout int, keyChanged *string) error {
	id := fmt.Sprintf("watch-%s-%03d", time.Now(), rand.Int())
	ch := make(chan string, 10)

	s.mu.Lock()
	s.filter[id] = func(key string) { ch <- key }
	s.mu.Unlock()

	select {
	case <-time.After(time.Duration(timeout) * time.Second):
		return fmt.Errorf("timeout")
	case key := <-ch:
		*keyChanged = key
		return nil
	}

	return nil
}
```

客户端调用 Watch
```go
func main() {
	client, err := rpc.Dial("tcp", ":8001")
	if err != nil {
		log.Fatal(err)
	}
	doClientWork(client)
}

func doClientWork(client *rpc.Client) {
	go func() {
		var keyChanged string
		err := client.Call("KVService.Watch", 2, &keyChanged)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(keyChanged)
	}()

	err := client.Call("KVService.Set", [2]string{"name", "jack"}, new(struct{}))
	if err != nil {
		log.Fatal(err)
	}

	time.Sleep(3 * time.Second)
}
```