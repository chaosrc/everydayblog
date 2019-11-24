---
title: Golang 并发（九）
date: 2019-11-22
---


## Golang 并发（九）



#### 并发爬虫

首先定义一个 crawl 方法，获取某个页面的所有链接
```go
func crawl(url string) []string {
	fmt.Println(url)
	list, err := extract(url)
	if err != nil {
		fmt.Println(err)
	}
	return list
}
// 获取url页面， 并提取链接
func extract(url string) ([]string, error) {
	res, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	doc, err := html.Parse(res.Body)
	if err != nil {
		return nil, err
	}
	links := []string{}
	findLinks(doc, &links)
	return links, nil
}

// 找出html中的链接
func findLinks(node *html.Node, links *[]string) {
	if node == nil {
		return
	}
	if node.Type == html.ElementNode && node.Data == "a" {
		for _, attr := range node.Attr {
			if attr.Key == "href" {
				*links = append(*links, attr.Val)
			}
		}
	}
	for child := node.FirstChild; child != nil; child = child.NextSibling {
		findLinks(child, links)
	}
}
```

主函数类似于广度优先遍历，使用 workList 来记录需要爬取的 URL，每一个 crawl 方法都在一个独立的 goroutine 中执行并且将其爬取的链接发送至 workList

```go
func main() {
	url := []string{"https://baidu.com"}

	workList := make(chan []string)

	go func() {
		workList <- url
	}()

	seen := make(map[string]bool)
	for list := range workList {
		for _, link := range list {
			if !seen[link] {
				seen[link] = true
				go func(link string) {
					workList <- crawl(link)
				}(link)
			}
		}
	}

}
```

上面程序的问题在于太过于并发，会导致 cpu、内存、网络等资源迅速消耗。我们可以使用容量为 n 的缓冲 channel 来限制并行数。

修改 crawl 函数
```go
// 使用 tokens 计数，限制并发请求数量为 20
var tokens = make(chan struct{}, 20)
func crawl(url string) []string {
	tokens <- struct{}{}
	fmt.Println(url)
	list, err := extract(url)
	if err != nil {
		fmt.Println(err)
	}
	<- tokens // 释放 token
	return list
}
```
