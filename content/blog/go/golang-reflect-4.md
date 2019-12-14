---
title: Golang 反射（四）
date: 2019-12-11
---


## Golang 反射（四）



#### 使用 reflect.Value 设置变量

Go 表达像 x、x.f[1] 和 *p 表示一个变量，但是其他的比如 x+1、f(2) 不是变量。变量是一个包含值的可寻址的存储位置，它的值可以通过这个地址更新。

reflect.Value 也有相似的差别，有些是可寻址的有些不是。
```go
x := 2                    // 值    类型    是否为变量
a := reflect.ValueOf(2)   // 2     int     否
b := reflect.ValueOf(x)   // 2     int     否
c := reflect.ValueOf(&x)  // &x    *int    否
d := c.Elem()             // 2     int     是（x）
```
a 和 b 中的值只是整数 2 的拷贝，不能寻址。c 是 指针 &x 的拷贝，也不能寻址。实际上 reflect.ValueOf(x) 返回的值都不能寻址。但是 d 通过对指针 c 取值，指向一个变量，因此是可以寻址的。我们可以使用 reflect.ValueOf(&x).Elem() 对任意的变量获取可寻址的值。

CanAddr 方法可以判断一个值是否可寻址

```go
list := []string{"12", "he"}
val := reflect.ValueOf(list)
// slice 中的元素指向一个指针因此是可寻址的
fmt.Println(val.Index(1).CanAddr())  // true
```

从一个可寻址的 reflect.Value 恢复为变量需要三步。首先，调用Addr() 返回一个值保持变量的指针，下一步调用这个值的 Interface() 方法返回包含指针的 inerface{} 值，最后如果我们知道变量的类型可以使用类型断言来恢复接口的内容为原本的指针。通过指针可以更新变量值：

```go
list := []string{"12", "he"}
val := reflect.ValueOf(list)
pt := val.Index(1).Addr().Interface().(*string)
*pt = "abc"
fmt.Println(list) // [12 abc]
```
也可以使用 Value.Set 方法直接更新可寻址的值:

```go
list := []string{"12", "he"}
val := reflect.ValueOf(list)
val.Index(1).Set(reflect.ValueOf("ABC"))
val.Index(0).SetString("456")
fmt.Println(list) // [456 ABC]
```

inerface{} 变量可以使用 Set 方法，但是不能使用 SetInt、SetString 等方法

```go
var f interface{}
f1 := reflect.ValueOf(&f).Elem()

f1.Set(reflect.ValueOf(1))
fmt.Println(f) // 1

f1.Set(reflect.ValueOf("hello"))
fmt.Println(f) // hello

f1.SetInt(2) //panic: reflect: call of reflect.Value.SetInt on interface Value
```

对于未导出的 struct 字段可以通过反射获取但是不能更新。

可以通过 CanSet 方法来判断一个可寻址的值是否可以更新