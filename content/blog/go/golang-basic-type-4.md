---
title: Golang 基础数据类型（四）
date: 2019-10-18
---

## Golang 基础数据类型（四）



#### UTF-8
UTF-8 是一个可变长度的 Unicode 编码，它使用 1 到4 个字节来呈现每一个符号（rune），只有 ASCII 字符是 1 个字节，其他通常是 2 到 3 个字节。第一个字节的高阶位指示后面有多少个字节，高阶位为 0 表示 7-bit ASCII，此时每个 rune 只有一个 byte。高阶位为 110 表示每个 rune 有两个字节，第二个 byte 以 10 开头，如下图

![](https://s2.ax1x.com/2019/10/18/Kefms1.png)

可变长度编码妨碍了直接通过下标获取字符串第 n 个字符，但是 UTF-8 有很多优秀的特性可以弥补这点不足，比如编码非常简洁、兼容 ASCII、自动同步

Go 的源码文件使用 UTF-8 编码。`unicode` 包提供了方法来操作单独的 rune，`unicode/utf8` 包提供来编码和解码 UTF-8 字节的方法。

很多 Unicode 字符很难通过键盘输入，甚至有些是不可见的。Go 字符串字面量转义的 Unicode 允许我们使用它们的数值代码点来表示，\uhhhh 表示 16-bit 的值，\Uhhhhhhhh 表示 32-bit 的值，其中每个 h 都是一个 16 进制的数值。下面的字符串字面量表示同样的 6-byte 字符串

```go
fmt.Println("世界")
fmt.Println("\xe4\xb8\x96\xe7\x95\x8c")
fmt.Println("\u4e16\u754c")
fmt.Println("\U00004e16\U0000754c")
```
输出
```sh
世界
世界
世界
世界
```
由于 UTF-8 的优良特性，很多字符串操作不需要解码，比如测试一个字符串是否是包含另一个做为前缀：

```go
func hasPrefix(s, prefix string) bool {
	return len(s) >= len(prefix) && s[:len(prefix)] == prefix
}
```

如果我们关注每一个独立的 Unicode 字符，可以使用 `unicode/utf8` 包中提供的方法。比如解码 UTF-8

```go
func decode(s string)  {
	for i := 0; i < len(s) ;{
		r, size := utf8.DecodeRuneInString(s[i:])
		fmt.Printf("%d\t%c\n", r, r)
		i += size
	}
}

func main() {
    decode("你好")
}
```

输出
```go
20320   你
22909   好
```

但是这种方法非常麻烦，Go range 循环默认执行 UTF-8 的解码

```go
func decodeRange(s string) {
	for i, r := range s {
		fmt.Printf("%d\t%c\t%d\n", r, r, i)
	}
}
func main() {
    decodeRange("世界")
}
```

输出
```go
19990   世      0
30028   界      3
```







