---
title: Golang 底层编程（二）
date: 2019-12-14
---

## Golang 底层编程（二）



#### unsafe.Pointer

大部分指针类型写做 `*T`，意思是 T 类型变量的一个指针，unsafe.Pointer 类型是一种特殊种类的指针，能够保存任意变量的地址。当然我们不能对 unsafe.Pointer 使用 `*p`，因为我们不知道表达式的类型。和普通的指针一样 unsafe.Pointer 是可比较的，可以是 nil。

一个普通的 `*T` 指针可以转换为 unsafe.Pointer，一个 unsafe.Pointer 也可以转换为普通的指针。

```go
func Float64bits(f float64)uint64 {
	return *(*uint64)(unsafe.Pointer(&f))
}
fmt.Printf("%#016x\n", Float64bits(1.0))
// 输出: 0x3ff0000000000000
```

unsafe.Pointer 也可以转换为 uintptr 保存指针的数值，使我们可以对指针进行数值运算。

很多 unsafe.Pointer 值是转换普通指针为原始指针数值再转回来的中间值，比如下面的例子:

```go
var x struct {
    a bool
    b int16
    c []int
}

// 相当于 &x.b
pb := (*int16)(unsafe.Pointer(uintptr(unsafe.Pointer(&x)) + unsafe.Offsetof(x.b)) )
*pb = 42
fmt.Println(x.b)
```

虽然上面的语法繁琐，但是不要尝试使用临时变量保存 uintptr 类型。下面的写法是错误的

```go
// 错误写法
tmp := uintptr(unsafe.Pointer(&x)) + unsafe.Offsetof(x.b)
pb := (*int16)(unsafe.Pointer(tmp) )
*pb = 42
```
原因很微妙，一些垃圾回收器会移动内存中的变量来减少碎片化或者计数。当一个变量被移动，所有保存这个地址的指针必须更新为新的地址。unsafe.Pointer 是一个指针，因此当变量移动时也必须更新，但是 uintptr 只是一个数字所以不会改变。上面的第二个语句执行后，变量 x 可能会被移动，tmp 不再指向 &x.b ，第三个语句可能将 42 重写到一个任意的地址。


当前对 unsafe.Pointer 转换的 uintptr 的使用原则是：把 uintptr 值当作它是变量的前一个地址，最小化 unsafe.Pointer 和 uintptr 转换操作的数量以及 uintptr 的使用。






