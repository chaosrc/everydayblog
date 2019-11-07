---
title: Golang 接口（一）
date: 2019-11-06
---

## Golang 接口（一）




接口类型表达对其他类型的广义或者抽象行为。通过抽象，接口让我们编写更加灵活、可适配的函数，因为他们不和具体的实现细节绑定

很多面向对象的语言都有接口的概念，但是 Go 接口的独特之处在于*隐式满足*。也就是说，不需要声明给定具体类型所满足的所有接口，只需要拥有必要的方法




#### 接口约定

前面我们见到的都是具体类型，一个具体类型指定明确的值、暴露内在操作，比如数字的算术操作。一个具体类型也可以通过方法提供额外的行为。当你有一个具体类型时，你会明确的知道它是什么以及你能对它进行什么操作。

Go 中的另一种类型是接口类型，接口类型是抽象类型。它不公开其值的展现形式、内部结构，或它支持的基本操作集，仅仅暴露它的方法。当你有一个接口类型时，你不知道它是什么，仅仅知道它能做什么，或者它的方法所提供的行为。

常用两个字符串格式化方法：fmt.Printf 输出结果到标准输出（一个文件），fmt.Sprintf 返回一个字符串结果。如果因为对格式化结果使用的稍微不同而重复是非常不必要的。有了接口之后，这些方法通过包装另一个方法，fmt.Fprintf 来实现：

```go
package fmt
func Fprintf(w io.Writer, format string, args ...interface{}) (int, error)
func Printf(format string, args ...interface{}) (int, error) {
    return Fprintf(os.Stdout, format, args...)
}
func Sprintf(format string, args ...interface{}) string {
    var buf bytes.Buffer
    Fprintf(&buf, format, args...)
    return buf.String()
}
```
Fprintf 第一个参数为格式化输出结果的文件。在 Printf 中为 os.Stdout，是一个 *os.File。Sprintf 中的第一个参数不是一个文件，而是将结果写入 &buf 指针的缓冲区，然后转换成字符串。


Fprintf 中的参数 io.Writer 其实也不是一个文件，它是下面的接口类型：

```go
package io

type Writer interface {
    Write(p []byte) (n int, err error)
}
```
io.Writer 接口定义了 Fprintf 与它的调用者之间的约定。由于 Fprintf 仅仅依赖 io.Writer 约束的行为，我们能够传入任何满足 io.Writer 的具体类型


我们定义一个新的类型 ByteCounter ，它的 Write 方法仅仅用来计算写入的 byte 长度

```go
type ByteCounter int

func (b *ByteCounter) Write(bytes []byte)(int, error) {
	*b += ByteCounter(len(bytes))  // 转换类型
	return len(bytes), nil
}
```

因为 *ByteCounter 满足 io.Writer 的约定，所以能够传人 Fprintf 中，正确计算结果的长度

```go
var c ByteCounter
fmt.Fprintf(&c, "hello,%s", "world")
fmt.Println(c) // 12

c = 0
c.Write([]byte("abcd"))
fmt.Println(c)  // 4
```




