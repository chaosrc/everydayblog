---
title: Golang 基础数据类型（三）
date: 2019-10-17
---


## Golang 基础数据类型（三）



#### Strings
字符串是不可变的字节数列。Strings 可以包含任意的数据，包括值为 0 的字节，但是通常是包含人类可读的文本。文本字符串被解析为 UTF-8 编码的 Unicode 代码点（runes）

内置的 len 方法返回的是字符串的字节数为不是 runes 类型，下标操作 s[i] 检索的是 s 的第 i 个字节


```go
s := "hello,wold"
fmt.Println(len(s))     // 10
fmt.Println(s[0], s[7]) // 104 111

f := "hello,世界"
fmt.Println(len(f))     // 12
fmt.Println(f[0], f[7]) // 104 184
```

截取子字符串的操作 s[i:j] 产生一个 i 到 j 的新字符串，包含第 i 个字节，但是不包括第 j 个
```go
fmt.Println(s[0:5]) // hello
fmt.Println(s[:5])  //hello
fmt.Println(s[5:])  //,wold
```

使用加号可以连结两个字符串产生一个新的字符串

```go
fmt.Println("my" + s[5:]) // my,wold
```

字符串可以使用比如 == 和 < 等进行比较，这种比较是通过字节与字节进行比较




#### 字符串字面量

一个字符串的值可以通过字面量来写。因为 Go 的源码文件总是使用 UTF-8 ，Go 文本字符串解析为 UTF-8，我们能够在字符串中包含 Unicode 代码点

在双引号字符串字面量中，转义序列以反斜杠 \ 开始，能够插入任意字节的值，比如 `\a`, `\t`, `\n`。也可以包括十六进制和八进制转义

```go
fmt.Println("\a,\b,\f,\n,\r,\t,\v,\",\\")
fmt.Println("\xaf,\377")
```

原始字符串使用反引号 \`...\` 来书写。原始字符串中的内容不会被转义

```go
fmt.Println(`
	 1. abc
	 2. efg
	 3. hij
    `)
```
输出原始字符串
```
    1. abc
    2. efg
    3. hij
```


