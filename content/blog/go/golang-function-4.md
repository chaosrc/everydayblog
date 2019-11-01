---
title: Golang 函数（四）
date: 2019-10-31
---


## Golang 函数（四）



#### 可变参数函数

一个可变参数函数可以使用不同数量的参数调用函数。对最后一个参数类型使用省略号 "..." 来声明可变参数。

```go
func sum(numbers ...int) int {
	var s int
	for _, num := range numbers {
		s += num
	}
	return s
}
fmt.Println(sum())             // 0
fmt.Println(sum(1))            // 1
fmt.Println(sum(1,2))          // 3
fmt.Println(sum(1, 2, 3, 4))   // 10
```
调用者会隐式的创建一个数组，拷贝参数至数组，将整个数组的slice 传人函数。如果参数已经是 slice 可以在参数后面加省略号传人

```go
nums := []int{1,2,3,4}
fmt.Println(sum(nums...))
```



#### defer 函数调用

下面的函数获取一个 HTML 文档并打印标题，如果 content-type 不是 HTML 者返回错误

```go
func title(url string) error {
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	contentType := res.Header.Get("Content-Type")
	if !strings.Contains(contentType, "text/html") {
		res.Body.Close()
		return fmt.Errorf("Not HTML")
	}

	doc, err := html.Parse(res.Body)
	res.Body.Close()
	if err != nil {
		return fmt.Errorf("HTML parse failed")
	}

	visitNode := func(node *html.Node) {
		if node.Type == html.ElementNode && node.Data == "title" && node.FirstChild != nil {
			fmt.Println(node.FirstChild.Data)
		}
	}

	forEachNode(doc, visitNode, nil)

	return nil

}

func forEachNode(node *html.Node, pre func(*html.Node), post func(*html.Node)) {
	if pre != nil {
		pre(node)
	}
	for n := node.FirstChild; n != nil; n = n.NextSibling {
		forEachNode(n, pre, post)
	}
	if post != nil {
		post(node)
	}
}

func main() {
	err := title(os.Args[1])
	if err != nil {
		fmt.Println(err)
	}
}
```

```sh
$ go build -o title .
$ ./title https://www.github.com
The world’s leading software development platform · GitHub
```

可以看到 res.Body.Close() 有重复调用，用来保证所有执行路径下包括失败，都能正确关闭网络连接。当函数变得更加复杂，需要处理更多错误情况时，那么这种清理逻辑的维护可能会成为一个问题。使用 Go 的 `defer` 机制使这种处理变得很简单

一个 defer 语句是一个普通的函数或者方法调用前加上一个 defer 关键词。这个函数和参数表达式在语句执行时求值，但是实际调用是在包含这个 defer 语句的函数结束后。可以有任意多个 defer 调用，它们以声明顺序相反的顺序执行


上面的 title 函数使用 defer 关闭请求连接

```go
func title(url string) error {
	res, err := http.Get(url)
	if err != nil {
		return err
    }
    
    // 使用 defer 关闭请求
    defer res.Body.Close()

	contentType := res.Header.Get("Content-Type")
	if !strings.Contains(contentType, "text/html") {
		// res.Body.Close()
		return fmt.Errorf("Not HTML")
	}

	doc, err := html.Parse(res.Body)
	// res.Body.Close()
	if err != nil {
		return fmt.Errorf("HTML parse failed")
	}
    // 处理逻辑
    ....

	return nil

}
```

使用多个 defer 调用

```go
func mdefer() {
	fmt.Println(1)
	defer fmt.Println("defer 1")
	fmt.Println(2)
	defer fmt.Println("defer 2")
	fmt.Println(3)
}
```
```sh
1
2
3
defer 2
defer 1
```








