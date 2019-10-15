---
title: Golang 基础数据类型（一）
date: 2019-10-15
---


## Golang 基础数据类型（一）



#### 整数

Go 提供了有符号和无符号两种整数运算。有 4 种不同大小的有符号整数——8，16，32，64 位，分别用 int8，int16，int32，int64 类型表示，相应的无符号类型为 uint8，uint16，uint32，uint64

还有两种类型叫做 int 和 unit 是在特定平台上最自然和最有效的有符号和无符号类型，int 是到目前为止使用最广泛的数字类型，这两种类型的大小要么是 32 位要么是 64 位，但是不要做任何假设，不同的编译器即使在同一个硬件上也可能会做出不同的选择


`rune` 类型是 int32 的同义词，方便用来指示 Unicode 代码点，这两种类型可以交换使用。同样 `byte` 类型是 uint8 的同义词


最后还有一种无符号整数类型 `uintptr`，它的宽带不指定但是能够满足指针值的存储


Go 中 +、-、* 和 / 可以使用在 整数、浮点数 和 复数上面，但是取余操作符 % 只能作用于整数。在 Go 中有符号的取余操作的结果符号与被除数一致，比如 -5 % 2，结果是 -3，-5 % -2 结果也是 -3

不管是有符号只是无符号的运算，如果溢出，高阶位会被舍弃

```go
var u uint8 = 255
fmt.Println(u, u+1, u*u) // 输出：255 0 1

var i int8 = 127

fmt.Println(i) // 输出：127
```



Go 也提供了以下的按位运算

- &   按位 AND
- |   按位 OR
- ^   按位 XOR
- &^  位清除（bit clear） AND NOT
- <<  左移位
- \>\>  右移位

下面的代码展示了按位运算，并使用 Printf 格式化输出二进制结果

```go
var x uint8 = 1<<1 | 1<<5
var y uint8 = 1<<1 | 1<<2

fmt.Printf("%08b\n", x)
fmt.Printf("%08b\n", y)

fmt.Printf("%08b\n", x&y)
fmt.Printf("%08b\n", x|y)
fmt.Printf("%08b\n", x^y)
fmt.Printf("%08b\n", x&^y)
```

输出
```sh
00100010
00000110
00000010
00100110
00100100
00100000
```

不同类型之间的转换需要明确指定，算术和逻辑运算对象必须是同一类型

```go
var apple int64 = 1
var orange int32 = 2

var mix int = int(apple)  + int(orange)

var mix2 int = apple + orange // error: invalid operation: mismatched

```

