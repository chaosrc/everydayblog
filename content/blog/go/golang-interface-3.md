---
title: Golang 接口（三）
date: 2019-11-08
---


## Golang 接口（三）



#### 接口值

从概念上讲，一个接口类型的值由两个部分组成：具体类型和此类型的值，它们被称为接口的动态类型和动态值。

对于像 Go 这样的静态类型的语言，类型是编译时概念，因此类型不是一个值。在 Go 的概念模型中，一组称为类型描述符的值，提供每个类型的信息，比如名字和方法。接口值中，类型由适当的类型描述符表示

下面的变量 w 有三种不同类型的值
```go
var w io.Writer
w = os.Stdout
w = new(bytes.Buffer)
w = nil
```

接口为零值时它的类型和值都为 nil，因此在 w 声明语句中 w 的接口值为：

![MePOsK.png](https://s2.ax1x.com/2019/11/08/MePOsK.png)

第二个语句赋值了一个 *os.File 类型的值：

![MePLM6.png](https://s2.ax1x.com/2019/11/08/MePLM6.png)

第三个语句赋值了一个 *bytes.Buffer 类型的值：
![MePHR1.png](https://s2.ax1x.com/2019/11/08/MePHR1.png)



一个接口值可以容纳任意大的动态值，比如 time.Time:
```go
var x interface{} = time.Now()
```
其结果可能是这样：

![MeiYo4.png](https://s2.ax1x.com/2019/11/08/MeiYo4.png)


接口值可以使用 == 和 = 比较，如果两个接口值都为 nil 那么它们相等，或者它们的动态类型相同且它们的动态值使用 == 比较相等，那么它们相等。因为接口值可以比较，所以可以用于 map 的 key，或者 switch 语句。

然而如果两个相同动态类型的接口值比较，但是类型是不可比较的（slice等），则比较失败并且发生 panic

```go
var b interface{} = []int{1, 2, 4}
var c interface{} = []int{3, 4, 5}
fmt.Println(b == c) //panic: runtime error: comparing uncomparable type []int
```



