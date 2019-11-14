---
title: Golang 接口（六）
date: 2019-11-11
---


## Golang 接口（六）



#### 类型断言

类型断言是对接口值的操作，它的语法为 `x.(T)` 其中 x 是接口类型表达式，T 为断言类型。类型断言检查操作对象的动态类型是否与断言类型匹配。

有两种情况的断言，第一，如果断言类型是一个具体类型，那么断言操作检查 x 的动态类型是否与 T 相同，如果是，那么断言结果为 x 的动态类型，它的类型为 T，也就是说，对一个具体类型的断言提取出了操作对象的具体值；如果检查失败，则抛出 panic

```go
var a io.Writer
a = os.Stdout

b := a.(*os.File)
fmt.Println(b == a) // ture

c := a.(*bytes.Buffer)  // panic: interface conversion: io.Writer is *os.File, not *bytes.Buffer
```

第二种，如果 T 是接口类型，那么类型断言检查 x 的动态类型是否满足 T ，如果是，动态值不被提取，其结果仍然是一个接口值，但是接口的类型为 T，也就是说，对一个接口的类型断言改变了表达式的类型，而且拥有不同的方法集合


```go
var w io.Writer
w = os.Stdout

rw := w.(io.ReadWriter)  // os.Stdout 满足 ReadWriter

w = new(ByteCounter)  // ByteCounter 只满足 Writer

rw = w.(io.ReadWriter) // panic: interface conversion: *main.ByteCounter is not io.ReadWriter: missing method Read

```

不管是哪一种类型的断言，如果操作对象是 nil ，那么断言失败
```go
var w io.Writer
r := w.(io.Writer)
// panic: interface conversion: interface is nil, not io.Writer
```

通常我们不确定接口值的动态类型，我们想要去测试它是哪一个具体类型。如果类型断言中接受两个赋值结果，那么断言失败不会抛出 panic，而是返回一个额外的布尔值来指示断言是否成功，如下：
```go
var w io.Writer

w = os.Stdout
rw := w.(io.ReadWriter)

w, ok := rw.(*bytes.Buffer)
if ok {
    fmt.Println("ok")
} else {
    fmt.Println("fail")
}

// 输出 fail
```

