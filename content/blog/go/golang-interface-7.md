---
title: Golang 接口（七）
date: 2019-11-12
---

## Golang 接口（七）



#### 使用类型断言鉴别错误

os 包中的文件操作会返回一个错误集。I/O 操作可能会因为任意原因失败，但是通常有三种错误必须不同的处理：文件已经存在（对于创建操作）、文件不存在（对于读取操作）、权限不够。

os 包提供了帮助方法，通过给定的错误来区分这三种失败

```go
package os

func IsExist(err error) bool
func IsNotExist(err error) bool
func IsPermission(err error) bool
```

区分错误的可靠方法是使用特定的类型来展示错误值。比如 os 包中定义了一个 PathError 类型来描述操作文件路径的错误：

```go
package os

type PathError struct {
    Op string
    Path string
    Err error
}
func (e *PathError) Error() string {
    return e.Op + " " + e.Path + " " + e.Err.Error()
}
```

客服端可以通过类型断言来检查具体的错误类型，从而区分不同的错误，下面是 IsNotExist 的实现

```go
var ErrNotExist = errors.new("file not exist")

func IsNoteExist(err error) bool {
    if pe, ok := err.(*PathError); ok {
        err = err.Err
    }
    return err == ErrNotExist
}
```



#### 使用类型断言来请求行为

下面是在 web 服务中写入 HTTP 相应头的部分逻辑：

```go 
func writeHeader(w io.Writer, contentType string) error {
	if _, err := w.Write([]byte("Content-Type: ")); err != nil {
		return err
	}
	if _, err := w.Write([]byte(contentType)); err != nil {
		return err
	}
    ...
} 
```
因为 Write 方法需要 []byte 类型的数据，所以将字符串转换为 []byte 类型后再传人。这种转换需要分配内存和复制数据，而且复制的数据会马上被舍弃。如果这是系统的核心逻辑，这种内存分配可能会拖慢系统。

查看 net/http 包可以发现 w 的动态类型 http.ResponseWriter 有一个 WriteString 方法可以高效的写入字符串，避免分配临时的拷贝。

我们不能假定每个 io.Writer 都有 WriteString 方法，但是可以定义一个只有 WriteString 方法的接口，然后通过类型断言来测试动态类型是否满足这个新的接口

```go

func writeString(w io.Writer, str string) (int, error) {
    // 定义一个新的类型
	type WriteString interface {
		WriteString(string) (int, error)
    }
    // 断言 w 的类型是否满足上面定义的新类型
	if w, ok := w.(WriteString); ok {
		return w.WriteString(str)
	}
	return w.Write([]byte(str))
}

func writeHeader(w http.ResponseWriter, contentType string) error {
    // 改为调用 writeString 方法
	if _, err := writeString(w, "Content-Type"); err != nil {
		return err
	}
	if _, err := writeString(w, contentType); err != nil {
		return err
	}

	//....

	return nil
}
```
在 writeString 方法中判断如果 w 有 WriteString 方法则调用，否则仍然使用 Write 方法。
