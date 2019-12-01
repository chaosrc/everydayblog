---
title: Golang 共享变量并发（五）
date: 2019-11-30
---

## Golang 共享变量并发（五）



#### 示例：并发非阻塞缓存

并发非阻塞缓存是一个抽象，它解决一个在实际并发编程中经常出现的问题：函数缓存（memoizing），它缓存函数的结果，这样函数只需要计算一次

下面使用 httpGetBody 方法做为需要缓存的函数。因为调用这个方法会发送一次 HTTP 请求然后读取 Body，相对开销比较大，所以我们想要避免不必要的重复调用

```go
func httpGetBody(url string) (interface{}, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	return ioutil.ReadAll(res.Body)
}
```

下面是第一版的缓存实现：

```go
type Memo struct {
	f     Func
	cache map[string]Result
}

type Func func(key string) (interface{}, error)
type Result struct {
	value interface{}
	err   error
}

func New(f Func) *Memo {
	return &Memo{f: f, cache: make(map[string]Result)}
}

func main() {
	memo := New(httpGetBody)
	var re interface{}
	for i := 0; i < 10; i++ {
		re, _ = memo.Get("https://baidu.com")

	}

	fmt.Println(string(re.([]byte)))
}

func (memo *Memo) Get(key string) (interface{}, error) {
	cache, ok := memo.cache[key]
	if !ok {
		cache.value, cache.err = memo.f(key)
		memo.cache[key] = cache
	}

	return cache.value, cache.err
}
```

同步方式使用 Memo 
```go
func main() {
	urls := []string{
		"https://baidu.com",
		"https://bing.com",
		"https://baidu.com",
		"https://tmall.com",
		"https://taobao.com",
		"https://jd.com",
		"https://tmall.com",
	}

	memo := New(httpGetBody)
	for _, u := range urls {
		now := time.Now()
		res, err := memo.Get(u)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s,  %s,  %s\n", u, time.Since(now), bytes.New(float64(len(res.([]byte)))))
	}
}
```
运行结果
```shell
$ go run .
https://baidu.com,  307.48433ms,  152.79KB
https://bing.com,  4.164982487s,  112.27KB
https://baidu.com,  257ns,  152.79KB
https://tmall.com,  898.855589ms,  222.36KB
https://taobao.com,  532.622306ms,  132.49KB
https://jd.com,  279.961501ms,  102.61KB
https://tmall.com,  720ns,  222.36KB
```
urls 中含有重复的 URL ，可以看到第二次调用重复的 URL 花费的时间很短


并发方式使用 Memo

```go
func main() {
	urls := []string{
		"https://baidu.com",
		"https://bing.com",
		"https://baidu.com",
		"https://tmall.com",
		"https://taobao.com",
		"https://jd.com",
		"https://tmall.com",
	}
	totalTime := time.Now()
	var wg sync.WaitGroup
	memo := New(httpGetBody)
	for _, u := range urls {
		wg.Add(1)
		go func(u string) {
			now := time.Now()
			res, err := memo.Get(u)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Printf("%s,  %s,  %s\n", u, time.Since(now), bytes.New(float64(len(res.([]byte)))))
			wg.Done()
		}(u)
	}
	wg.Wait()
	fmt.Println("Total time: ", time.Since(totalTime))
}
```
运行结果
```shell
$ go run .
https://taobao.com,  495.987367ms,  131.94KB
https://tmall.com,  574.481546ms,  222.36KB
https://jd.com,  717.00061ms,  102.39KB
https://baidu.com,  965.010644ms,  152.42KB
https://tmall.com,  1.131277028s,  222.36KB
https://baidu.com,  1.272043514s,  152.64KB
https://bing.com,  3.027638404s,  112.62KB
Total time:  3.027725597s
```
可以看到运行更快了，但是缓存并没有生效


下面版本的 Memo ，每个 map 元素都是一个 entry 指针，每个 entry 包含缓存结果和一个 channel。当 entry 的结果设置后，关闭 channel， 广播给其他 goroutine 去安全的获取缓存结果
```go
type Memo struct {
	f     Func
	cache map[string]*entry
	mu    sync.RWMutex
}

type Func func(key string) (interface{}, error)
type Result struct {
	value interface{}
	err   error
}

type entry struct {
	re    Result
	ready chan struct{}
}

func New(f Func) *Memo {
	return &Memo{f: f, cache: make(map[string]*entry)}
}

func (memo *Memo) Get(key string) (interface{}, error) {
	memo.mu.Lock()
	cache := memo.cache[key]
	if cache == nil {
		cache = &entry{ready: make(chan struct{}, 1)}
		memo.cache[key] = cache
		cache.ready <- struct{}{}
	}
	memo.mu.Unlock()

	if _, ok := <-cache.ready; ok {
		var result Result
		result.value, result.err = memo.f(key)
		cache.re = result
		close(cache.ready)
	}

	return cache.re.value, cache.re.err
}
```



