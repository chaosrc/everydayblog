---
title: Go 接口（五）
date: 2019-11-10
---



## Go 接口（五）



#### http.Handler 接口

net/http 包可以用来实现 web 客户端和服务端，服务端的基本接口为 http.Handler:

```go
package http

type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}

func ListenAndServe(addr string, handler Handler) error 
```

ListenAndServe 方法需要一个服务器地址(比如“localhost:8000")和一个 Handler 接口的实例，所有请求都会被发送到这个 handler。

下面实现一个简单的 web 服务，模拟展示数据库中物品的销售价格。

```go
// 定义价格类型
type price float64

func (p price) String() string {
	return fmt.Sprintf("%.2f¥", p)
}

// 使用 map 模拟数据库
type database map[string]float64

// 定义 http.Handler 接口
func (db database) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	for key, val := range db {
		fmt.Fprintf(w, "%s：%s\n", key, price(val))
	}
}
```

```go
func main() {
	db := database{
		"shoe":  100,
		"socks": 5,
	}
	log.Fatalln(http.ListenAndServe("localhost:8001", db))
}
```

访问 localhost:8001
```sh
$ curl localhost:8001
shoe：100.00¥
socks：5.00¥
```

给服务添加不同的 URL 来触发不同的行为，`/list` 和现在一样返回所有的商品和价格， `/price` 通过 item 参数返回单个商品的价格

```go
// 定义 http.Handler 接口
func (db database) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	switch path {
	case "/list":
		for key, val := range db {
			fmt.Fprintf(w, "%s：%s\n", key, price(val))
		}
	case "/price":
		// 获取 URL 参数 item
		item := r.URL.Query().Get("item")
		// 在 db 中查询数据，如果不存在返回错误
		if value, ok := db[item]; ok {
			fmt.Fprintf(w, "%s\n", price(value))
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "no such item: %s\n", item)
		}
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "no such page: %s\n", path)
	}
}
```

访问服务
```sh
$ curl localhost:8001
no such page: /
$ curl localhost:8001/list
shoe：100.00¥
socks：5.00¥
$ curl localhost:8001/price?item=shoe
100.00¥
$ curl localhost:8001/price?item=hat
no such item: hat
```


随着 URL 情况的增加以及逻辑越来越复杂，在实际的应用中将每一种情况的逻辑分别定义在不同的方法中是非常有必要的。net/http 包中提供了的 ServeMux（多路器）来简化 URL  与 handler 之间的关系。

```go

func main() {
	db := database{
		"shoe":  100,
		"socks": 5,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/list", db.list)
	mux.HandleFunc("/price", db.price)

    log.Fatalln(http.ListenAndServe("localhost:8001", db))
}

// 使用 map 模拟数据库
type database map[string]float64

func (db database) list(w http.ResponseWriter, r *http.Request) {
	for key, val := range db {
		fmt.Fprintf(w, "%s：%s\n", key, price(val))
	}
}

func (db database) price(w http.ResponseWriter, r *http.Request) {
	// 获取 URL 参数 item
	item := r.URL.Query().Get("item")
	// 在 db 中查询数据，如果不存在返回错误
	if value, ok := db[item]; ok {
		fmt.Fprintf(w, "%s\n", price(value))
	} else {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "no such item: %s\n", item)
	}
}

```