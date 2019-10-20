---
title: Golang 基础数据类型（六）
date:  2019-10-20
---


## Golang 基础数据类型（六）



#### Strings 和 Numbers 之间转换

整数转换为字符串有两种方式: fmt.Sprintf 和 strconv.Itoa

```go
i := 10
s1 := fmt.Sprintf("%d", 10)
s2 := strconv.Itoa(i)

fmt.Println(s1, s2)   // 10, 10
```

FormatInt 转换不同进制的整数

```go
fmt.Println(strconv.FormatInt(10, 2))  // 1010
fmt.Println(strconv.FormatInt(63, 16)) //3f
```

字符串转整数类型

```go
x, err := strconv.Atoi("123")
y, err := strconv.ParseInt("123", 10, 64)
```



#### 常量

常量是在编译时就知道值的表达式，它计算是在编译时而不是运行时。常量的基础类型是：boolean, string 或 number 类型

```go
const pi = 3.1415
```

常量的声明可以省略类型，类型由右边的表达式推断

```go
const delay time.Duration = 100
const timeout = time.Minute * 5

fmt.Printf("%T, %[1]v\n", delay)  // time.Duration, 100ns
fmt.Printf("%T, %[1]v\n", timeout) // time.Duration, 5m0s
```

当一个连续的常量声明做为一个组时，如果除了第一个以外其他的省略右边的表达式，隐含后面的常量使用前面的表达式

```go
const (
	a = 1
	b 
	d = 2
	e 
)

fmt.Println(a,b,d,e) // 1 1 2 2
```



#### 常量生成器 iota

常量的声明可以使用常量生成器 iota，用来生成一系列相关的值。在常量声明中，iota 的值从 0 开始每次增加 1。比如定义工作日

```go
const (
	Sunday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
) 
```

Sunday 的值为 0，Saturday 的值为 6。这种方式的常量类似于其他语言中的枚举值

iota 用于表达式

```go
const (
	a = 10 * iota
	b
	c
	d
)
fmt.Println(a, b, c, d)
```


