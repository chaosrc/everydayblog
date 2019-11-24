---
title: Golang 并发（十一）
date: 2019-11-24
---

## Golang 并发（十一）



#### 并发目录遍历

下面我们创建一个程序，通过命令行指定目录，查询其使用情况，类似于 Linux 中的 du 命令。

下面是非并发版本
```go
// 读取 filepath 目录下的所有文件大小
func du(filepath string) int64 {
	files, err := ioutil.ReadDir(filepath)
	if err != nil {
        println(err)
        return 0
	}
	var size int64
	for _, file := range files {
		if file.IsDir() {
			size += du(path.Join(filepath, file.Name()))
		} else {
			size += file.Size()
		}

	}

	return size
}

func main() {
    // 获取命令行参数
	flag.Parse()
	roots := flag.Args()
	if len(roots) == 0 {
		roots = []string{"."}
	}
	for _, path := range roots {
		size := du(path)
		fmt.Printf("%s, %s\n", path, bytesize.New(float64(size)))
	}
}
```

```shell
$ go run . /etc /usr
/etc, 3.88MB
/usr, 3.37GB
```

下面是并发版本，使用 sync.WaitGroup 来统计正在运行的 du 方法，当计数为 0 时关闭 sizeChan。

```go
// 读取 filepath 目录下的所有文件大小
func du(filepath string, fileSize chan<- int64, n *sync.WaitGroup) {
	defer n.Done()
	for _, file := range readDir(filepath) {
		if file.IsDir() {
			n.Add(1)
			go du(path.Join(filepath, file.Name()), fileSize, n)
		} else {
			fileSize <- file.Size()
		}
	}
}

// 使用 buffered channel 限制并发读取文件数量
var sema = make(chan struct{}, 20)
func readDir(filepath string) []os.FileInfo {
	sema <- struct{}{}
	files, err := ioutil.ReadDir(filepath)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	<-sema
	return files
}

func main() {
    // 获取命令行参数
	flag.Parse()
	roots := flag.Args()
	if len(roots) == 0 {
		roots = []string{"."}
	}
	sizeChan := make(chan int64)
	var n sync.WaitGroup
	for _, root := range roots {
		n.Add(1)
		go du(root, sizeChan, &n)
	}
	go func() {
		n.Wait()
		close(sizeChan)
	}()

	var size, nfiles int64
	tick := time.Tick(500 * time.Millisecond)

	for {
		select {
		case <-tick:
			fmt.Printf("%d files, %s\n", nfiles, bytesize.New(float64(size)))

		case s, ok := <-sizeChan:
			if !ok {
				fmt.Printf("%d files, %s\n", nfiles, bytesize.New(float64(size)))
				return
			}
			size += s
			nfiles++
		}
	}
}
```
