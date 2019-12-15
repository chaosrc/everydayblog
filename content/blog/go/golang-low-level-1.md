---
title: Golang 底层编程（一）
date: 2019-12-14
---

## Golang 底层编程（一）



Go 语言的设计保证一些安全性能，限制 Go 程序出错的方式。在编译时，类型检查检测大部分对类型的不当操作，比如，使用字符串减去另一个字符串。严格的类型转换规则阻止直接获取内置类型（比如 string，maps，slices，channel）的内部。

对于不能直接进行静态检查的错误，比如数组越界、nil 指针的解引用，动态检查保证在任何禁止操作发生时，程序立即终止。自动内存管理（垃圾回收）消除“清空后使用（use after free）”的 bug，以及大部分的内存泄露。

通过隐藏底层细节使得 Go 程序非常轻便。但是有时候我们也会选择牺牲这些安全的保证来达到最高性能，或与其他语言库进行交互，或去实现一个纯 Go 程序无法表达的函数。

Go 中的 unsafe 包使得我们可以走出常规的规则之外，可以使用 cgo 来创建 Go 和 C 库之间的绑定以及调用操作系统。



#### unsafe.Sizeof, Alignof, 和 Offsetof

unsafe.Sizeof 函数返回操作对象呈现的字节大小，可以是任何类型的表达式。Sizeof 调用是类型为 uintptr 的常量表达式，可以做为数组的大小使用，或计算其他常量。

```go
fmt.Println(unsafe.Sizeof(float64(0)))
//输出： 8
```

Sizeof 只会获取每个数据结构固定部分的大小，比如字符串的指针和长度，而不是字符串的内容。

下面使用 word 来表示类型的大小，1 word 表示 32 位系统的 4 个 bytes， 64 位系统上的 8 个 bytes。

Go 中非集合类型的大小

| 类型                       | 大小                  |
| -------------------------- | --------------------- |
| bool                       | 1 byte                |
| intN,uintN,floatN,complexN | N/8 bytes             |
| int,uint,uintptr           | 1 word                |
| \*T                        | 1 word                |
| string                     | 2 words (data,len)    |
| []T                        | 3 words (daa,len,cap) |
| map                        | 1 word                |
| func                       | 1 word                |
| chan                       | 1 word                |
| inerface                   | 2 words (type,value)  |

unsafe.Alignof 函数返回参数类型对齐的大小。和 Sizeof 一样，接收任何类型的表达，产生一个常量。

unsafe.Offsetof 函数的操作对象必须是一个字段选择器 x.f，计算 相对于 struct x 开始处的偏移量。

```go
var x struct {
    a bool
    b int16
    c []int
}
```

下图展示了 x 的内存分配情况

![QW3aCt.png](https://s2.ax1x.com/2019/12/14/QW3aCt.png)

```
// 32位系统
Sizeof(x)   = 16  Alignof(x)   = 4
Sizeof(x.a) = 1   Alignof(x.a) = 1  Offsetof(x.a) = 0
Sizeof(x.b) = 2   Alignof(x.b) = 2  Offsetof(x.b) = 2
Sizeof(x.c) = 12  Alignof(x.c) = 4  Offsetof(x.c) = 4
```

```
// 64 位系统
Sizeof(x)   = 32  Alignof(x)   = 8
Sizeof(x.a) = 1   Alignof(x.a) = 1 Offsetof(x.a) = 0
Sizeof(x.b) = 2   Alignof(x.b) = 2 Offsetof(x.b) = 2
Sizeof(x.c) = 24  Alignof(x.c) = 8 Offsetof(x.c) = 8
```
