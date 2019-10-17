---
title: Golang 基础数据类型（二）
date: 2019-10-16
---


## Golang 基础数据类型（二）



#### 浮点数

Go 提供了两种大小的浮点数 float32 和 float64。float32 提供了大约 6 位小数精度，而 float64 提供了 15 位精度。大多数情况下应该首选 float64，因为 float32 计算如果不是特别小心很容易累计精度错误

浮点数可以使用十进制字面量表示，小数点前面或后面可以省略

```go
a := 1.2345
b := 1.
c := .2345
fmt.Println(a,b,c) // 输出: 1.2345 1 0.2345
```

大的数据可以使用科学计数法（e 或 E ）

```go
a := 2.234e10
b := 3.456e-10
fmt.Println(a,b)
```

浮点数在 Printf 中使用 %g 可以打印适当精度的结果，但是对于表格数据使用 %e 或者 %f 更加合适

```go
for i := 0; i < 4; i++ {
    fmt.Printf("i = %8.3f\n", math.Exp(float64(i)))
}
```
输出
```sh
i =    1.000
i =    2.718
i =    7.389
i =   20.086
```



#### 复数

Go 提供了种个大小的复数 complex64 和 complex128。内置的 complex 方法用于创建复数，real 和 imag 方法分别用来获取实部和虚部

```go
var a complex128 = complex(1, 3)
var b complex128 = complex(3, 5)
fmt.Println(a * b)     // 输出：(-12+14i)
fmt.Println(real(a))   // 输出：1
fmt.Println(imag(a))   // 输出： 3
```




#### 布尔类型（bool）

bool 类型只有两个可能的值 true 和 false。if 和 for 语句中的条件为 bool 值，比较操作比如 == 或 < 产生一个 bool 结果。

bool 值可以与逻辑操作符 &&、|| 组合使用，比如

```go
var s string
if (s != "" && s[0] != 'x') {
    fmt.Println(s)
}
```
在 Go 中不会隐式的将 bool 类型转换为数值类型比如 0 或 1

