---
title: Golang 接口（二） 
date: 2019-11-07
---


## Golang 接口（二）



#### 接口类型

接口类型指定一组方法，具体的类型必须拥这些方法才能被视为该接口的实例。

io.Writer 类型是使用最广泛的接口之一，它提供了所有能够写入字节的类型的抽象，包括文件、内存缓冲、网络连接、压缩器等。一个 Reader 表示任何能够读取字节的类型，一个 Closer 是能够关闭的任何值。

```go
type Reader interface {
	Read([] byte) (int, error)
}
type Closer interface {
	Close() error
}
```

多个接口进行组合 

```go
type ReadWriter interface {
	Reader
	Writer
}
type ReadWriteCloser interface {
	ReadWriter
	Closer
}
```

同时进行组合和方法声明

```go
type ReadWriter interface {
	Reader
	Write([] byte) (int, error)
}
```



#### 接口满足

一个类型如果拥有接口的所有方法则满足这个接口。Go 语言中如果一个具体类型是（is a）一个特定的接口类型，那么这个具体类型满足这个接口，比如 *os.File 是一个 io.ReadWriter.

接口的赋值规则很简单：只有在其类型满足接口时，表达式才可以赋值给接口

```go
var w io.Writer

w = os.Stdout         // Stdout 中有 Write 方法
w = new(bytes.Buffer) //Buffer 中有 Write 方法
```

具体类型赋值给接口类型后，只有接口中声明的方法才能被调用。

```go
os.Stdout.Write([]byte("hello"))
os.Stdout.Close()

var w Writer
w = os.Stdout
w.Write([]byte("abc"))
w.Close() //error： w.Close undefined (type Writer has no field or method Close)
```

os.Stdout 中有 Write 和 Close 方法，但是赋值给 Writer 接口类型的 w 后，w 不能调用 Close 方法 


空的接口类型为 `interface{}`。因为空的接口对满足它的类型没有要求， 所以任何值都能赋值给它

```go
var a interface{}
a = 1
a = true
a = "abc"
a = os.Stdout
```
