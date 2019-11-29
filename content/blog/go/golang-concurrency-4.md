---
title: Golang 共享变量并发（四）
date: 2019-11-29
---

## Golang 共享变量并发（四）



#### 延迟初始化：sync.Once

将初始化昂贵的步骤延迟到它需要的时候进行是一个很好的实践。预先加载初始化变量增加了程序启动的延迟，如果程序不总是执行到使用这个变量的部分，那么初始化是不必要的。

下面是图片延迟加载

```go
var icon map[string]image.Image

func loadIcons() {
	icons = map[string]image.Image{
		"spades.png":   loadIcon("spades.png"),
		"hearts.png":   loadIcon("hearts.png"),
		"diamonds.png": loadIcon("diamonds.png"),
		"clubs.png":    loadIcon("clubs.png"),
	}
}
// 注意：线程不安全
func Icon(name string) image.Image {

	if icons == nil {
		loadIcons()
	}
	return icon[name]
}
```

上面的模式仅仅使用单个 goroutine 获取变量是可以的，但是 Icon 方法并发调用并不安全。

最简单的正确方式是使用互斥锁同步来保证所有的 goroutine 观察到 loadIcons 的影响

```go
var mu sync.Mutex
func Icon(name string) image.Image {
	mu.Lock()
	defer mu.Unlock()
	if icons == nil {
		loadIcons()

	}
	return icon[name]
}
```

然而，强制互斥获取 icons 的代价是两个 goroutine 不能并发的获取变量，即使一旦变量被安全初始化之后也不会再修改。因此建议使用多读锁：

```go
var mu sync.RWMutex
func Icon(name string) image.Image {
	mu.RLock()
	if icons != nil {
		icon := icons[name]
		mu.RUnlock()
		return icon
	}
	mu.RUnlock()

	mu.Lock()
	defer mu.Unlock()
	if icons == nil {
		loadIcons()

	}
	return icon[name]
}
```

上面的模式有了更好的并发，但是比较复杂，容易出错。sync 包中对这类一次初始化问题提供了一个特定的方案：sync.Once。Once 由一个互斥锁和布尔变量组成，变量记录初始化是否发生过，互斥锁同时保护布尔变量和客户端数据结构。

```go
var muOnce sync.Once

func Icon(name string) image.Image {
	muOnce.Do(loadIcons)
	return icon[name]
}
```

sync.Once 中的 Do 方法接收初始化方法做为它的参数。第一次调用时变量为 false ，Do 方法调用 loadIcons 方法并且设置变量为 true；后面的调用什么都不做。





