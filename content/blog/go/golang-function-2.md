---
title: Golang 函数（二）
date: 2019-10-29
---

## Golang 函数（二）



#### Errors

错误是包 API 或者应用程序用户界面的重要组成部分，失败只是可预期的行为之一，这就是 Go 处理错误的方式

对于一个方法如果失败是一个可预期的行为则返回一个额外的结果，通常是最后一个。比如查找一个 key，key 值可能不存在

```go
value, ok := cached.lookup(key)
if !ok {
    // 处理 key 不存在的逻辑
}
```

通常，特别是 I/O，失败可能有很多种解释，这种情况下返回一个 error 做为额外的结果
```go
file, err := os.Open("./a.txt")
if err != nil {
    // 处理文件打开失败
}
```

内置的 error 类型是一个 interface，error 可能是 nil 或者 非 nil 的，nil 表示成功而非 nil 表示失败，非 nil 时返回一个 error 值包含一个 Error 方法，调用 Error 方法返回错误信息




#### 错误处理策略

当函数返回一个错误，它的调用者有责任来检查它并且采取适当的行动。根据不同的情况可能会有很多种可能性，下面是其中的五中方式

第一种，也是最常见的，即 *传送*（propagate）错误，将错误抛给上一层调用者
```go
res, err := http.Get(url)
if err != nil {
    return nil, err
}
```

第二种，对于短暂或者不定出现的错误问题，重试失败的操作可能是有意义的，可以是延迟一段时间重试，并且限制一个重试的数量或者重试花费的时间

```go
func waitForServer(url string) (io.Reader, error) {
    // 设置超时时间
	timeout := time.Minute * 1
	deadline := time.Now().Add(timeout)

	for retry := 0; time.Now().Before(deadline); retry++ {
		res, err := http.Get(url)
		if err == nil && res.StatusCode == http.StatusOK {
			return res.Body, nil
		}
		fmt.Println(err, retry)
		time.Sleep(time.Second << uint(retry))
	}
	return nil, fmt.Errorf("Failed %s timeout %s", url, timeout)
}
```

第三种，如果程序无法继续，调用者可以打印错误信息并停止程序，但是这种行为一般在程序的入口 main 包中执行

```go
func main() {
	res, err := waitForServer("https://www.google.com")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	io.Copy(os.Stdout, res)
}
```

第四种，某些情况下，仅仅需要打印错误信息，然后程序继续执行，可能会减少某些功能的的执行

打印错误信息
```go
if err := start(); err != nil {
    fmt.Println(err)
}
```
将错误信息打印到标准错误输出
```go
if err := start(); err != nil {
    fmt.Fprintf(os.Stderr, "%v", err)
}
```

最后一种，在极少情况下可以安全的忽略掉某个错误

```go
dir, err := ioutil.TempDir("", "")
if err != nil {
    return fmt.Errorf("%v", err)
}
// 使用临时文件夹 dir
...
// 移除临时文件夹
os.RemoveAll(dir)
```

调用 os.RemoveAll 可能会失败，但是程序可以忽略，因为操作系统会定时的清理临时文件




