---
title: Go 程序结构（七）
date: 2019-10-13
---

## Go 程序结构（七）



#### import


在一个 Go 程序中，每个 package 都定义了一个唯一的字符串叫做导入路径（`import path`）。语言本身并没有定义这些字符串的来源及含义，而是处决于工具如何解析它们。当使用 Go 工具（go tool）时 `import path` 表示一个文件夹，里面包含一个或多个 Go 源码文件，这些文件一起组成一个包。每个包都有一个包名出现在包的声明中。为了方便，一般包名和导入路径的最后一个部分匹配，比如 "example.com/hello/tempconv" 的包名为 tempconv

下面在另一个包中使用之前定义的包 example.com/hello/tempconv


```go
package main 

import (
	"example.com/hello/tempconv"
	"os"
	"strconv"
	"fmt"
)

func main() {
	for _, arg := range os.Args[1:] {
		t, err := strconv.ParseFloat(arg, 64)
		if err != nil {
			fmt.Fprintf(os.Stderr, "cf: %v\n", err)
			os.Exit(1)
		}
		c := tempconv.Celsius(t)
		f := tempconv.Fahrenheit(t)

		fmt.Printf("%s = %s, %s = %s \n", 
			c, tempconv.CToF(c), f, tempconv.FToC(f))

	}
}
```

上面的 import 语句导入包 example.com/hello/tempconv，在整个文件中都可以使用 tempconv 来引用包中的内容

运行上面的程序
```sh
$ go build .
$ ls
cf      cf.go
$ ./cf 100
100°C = 212°F, 100°F = 37.77777777777778°C 
$ ./cf 0
0°C = 32°F, 0°F = -17.77777777777778°C 
```



#### 包初始化（Package Initialization）

包的初始化开始于包级别变量的初始化，按照它们声明的顺序，但是依赖会先解析

```go
var a = b + c    // 第三个初始化
var b = f()      // 第二个初始化
var c = 1        // 最先初始化
func f() int {
	return c + 1
}
```
如果一个包有多个 .go 文件，它们初始化的顺序是文件给编译器的顺序，Go 工具在编译之前会对文件通过文件名进行排序

任何 .go 文件可以包含任意数量的初始化（init）方法

```go
func init() {

}
```

init 方法除了不能被调用或者引用外，其他的与正常函数一样。每个文件中的 init 方法会在程序启动时按照声明顺序自动运行

每个包初始化一次，按照导入顺序，先执行依赖。如果某个包 a 引入了包 b，那么可以确定的是在 a 初始化之前 b 已经完全初始化





















