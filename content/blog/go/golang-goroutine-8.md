---
title: Golang 并发（八） 
date: 2019-11-21
---

## Golang 并发（八）



#### 并行循环

下面我们将探讨一些常见的执行并行循环的并发模式。考虑一个全尺寸图片生成缩略图的问题，下面的 ImageFile 方法可以缩放单个图片：

```go
func ImageFile(fileName string) (string, error) {
    //省略实现细节
    ...
}
```

下面的程序循环一个图片列表，生成每一张图片的缩略图

```go
func makeThumbnails(filenames []string) {
	for _, name := range filenames {
		if _, err := ImageFile(name); err != nil {
			log.Fatal(err)
		}
	}
}
```
很显然每个文件的执行顺序并不重要，每个缩放操作都相互独立。这样的问题完全由独立子问题组成，也被称作为 *embarrassingly parallel*。这类问题也最容易实现并发，并且享受与并行数量线性扩展的性能。

下面我们并行执行所有的缩放操作，使用多核 CPU 进行图片缩放计算。在 ImageFile 上使用 go 关键词

```go
func makeThumbnails(filenames []string) {
	for _, name := range filenames {
		 go ImageFile(name)
	}
}
```
但是这种情况下 makeThumbnails 会在图片缩放操作之前返回，对每一个文件都会开始一个 goroutine，但是没有等待它们结束。

没有一种直接的方式来等待 goroutine 结束，但是我们可以让里面的 goroutine 完成时通知外面的 goroutine，通过发送一个事件到共享的 channel。
```go
func makeThumbnails(filenames []string) {
	ch := make(chan struct{})
	for _, name := range filenames {
		go func(f string) {
			ImageFile(f)
			ch <- struct{}{}
		}(name)
	}

	// 等待 goroutine 完成
	for range ch {
		<-ch
	}
}
```

为了知道最后一个 goroutine 什么时候结束，我们需要一个计数器在每个 goroutine 开始前加 1，然后在每个 goroutine 结束时减 1。这种特殊的计数器需要安全的从多个 goroutine 操作，并且提供一种方式等待它变为 0。这种计数器类型就是 sync.WaitGruop.

```go
func makeThumbnails(filenames []string) {
	ch := make(chan struct{})
	var wg sync.WaitGroup
	for _, name := range filenames {
		wg.Add(1)
		go func(f string) {
			defer wg.Done()
			ImageFile(f)
			ch <- struct{}{}
		}(name)
	}
	go func() {
		wg.Wait()
		close(ch)
	}()

	// 等待 goroutine 完成
	for range ch {
		<-ch
	}
}
```

![MoYLUs.png](https://s2.ax1x.com/2019/11/22/MoYLUs.png)



