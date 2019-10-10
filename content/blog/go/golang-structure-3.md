---
title: Go 程序结构（三）
date: 2019-10-09
---

## Go 程序结构（三）



#### 指针

一个变量是包含值的存储。声明时创建的变量通过名字来标示，比如 x，但是很多变量只能通过表达式来标示比如 x[i] 或者 x.f 。所有的这些表达式都读取了变量的值，除非它们出现在赋值语句的左边，这时是新的值赋值给这个变量。

一个指针（pointer）值是一个变量的地址，是存储值的位置。并不是所有的值都有一个地址，但是每个变量都有地址。使用指针我们能够间接的读取或者更新一个变量的值，而不必使用甚至不需要知道变量的名字。

如果声明一个变量 `var x int`，表达式 `&x` 产出了一个指针指向一个整数变量，即 `*int`。如果把这个指针称为 p，那么我们可以说 “p 指向 x”，或者 “p 包含 x 的地址”。p 指针指向的变量用 `*p` 表示，`*p` 表达式产出了这个变量的值，因为 `*p` 表示一个变量，所以也可以进行赋值。

```go
func pointer() {
	x := 10
	p := &x  // p 是 *int 类型，指向 x
	
	fmt.Println(*p) // 输出： 10

	*p = 20
	fmt.Println(x) // 输出：20
}
```

任何类型指针的零值都是 nil，如果指针 p 指向一个变量那么 p != nil 为 true

```go
var x, y int
var z *int
fmt.Println(x != nil, z) // 输出：true, nil
```

在方法中返回一个局部变量的指针是非常安全的

```go
func pf() *string {
	v := "hello"
	return &v
}
v := pf()
fmt.Println(*v) // 输出：hello
```

因为指针包含了变量的地址，将指针做为参数传人函数，那么函数可以间接的更新此变量

```go
func pointArgs() {
	args := func (val *string) {
		*val = "foo"
	}

	val := "bar"
	args(&val)

	fmt.Println(val) // 输出；foo
}
```

指针是 `flag` 包的关键，它使用程序的命令行参数在运行时去设置特定变量的值。比如，我们创建一个 echo 程序接受 -n， -s 参数，-n 使 echo 不换行，-s 指定输出的分隔符

```go
package echo

import (
	"flag"
	"fmt"
	"strings"
)

var n = flag.Bool("n", false, "不换行")
var s = flag.String("s", " ", "分隔符")

// Start echo
func Start() {
	flag.Parse()
	text := strings.Join(flag.Args(), *s)

	if *n == true {
		fmt.Printf(text)
	} else {
		fmt.Println(text)
	}
}

```

运行
```sh
$ ./echo ab cd ef
ab cd ef
$ ./echo -n ab cd ef
ab cd ef$ 
$ ./echo -s / ab cd ef
ab/cd/ef
$ ./echo -s - ab cd ef
ab-cd-ef
```












