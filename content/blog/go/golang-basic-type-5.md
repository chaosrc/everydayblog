---
title: Golang 基础数据类型（五）
date:  2019-10-19
---


## Golang 基础数据类型（五）



#### Strings 和 Byte 操作

操作字符串最重要的四个包：bytes、strings、strconv 和 unicode。strings 包提供了很多对字符串比如搜索、替换、比较、分隔的方法

bytes 包有操作字节数组的类似方法，和 strings 共享一些属性。因为 strings 类型是不可变类型，随着 strings 构建的增加可能会导致大量的内存分配和拷贝，这种情况下使用 bytes.Buffer 类型更加高效

strconv 提供了布尔类型、整数类型以及浮点类型值与字符串的相互转换的方法

unicode 包提供了分类 rune 类型的方法比如 IsDigit, IsLetter, IsUpper, IsLower

下面的例子，将一个整数的字符串每隔三个位置插入一个逗号分隔符，比如 "12345"，转换为 "12,345"
```go
func main() {
	fmt.Println(format("12345"))
}

func format(s string) string {
	l := len(s)
	if l < 3 {
		return s
	}
	return format(s[:l-3]) + "," + s[l-3:]
}
```

strings 和 byte 之间相互转换

```go

func conv() {
	s := "hello"
	b := []byte(s)
	s2 := string(b)

	fmt.Println(b, s2) //输出：[104 101 108 108 111] hello
}
```
[]byte(s) 和 string(b) 的转换都会复制一份新的字节数组


bytes 包中提供了 Buffer 类型能够高效的操作 byte 数据

```go
func intsToString(values []int) string {
	buf := bytes.Buffer{}

	buf.WriteString("[")
	for i, value := range values {
		if i > 0 {
			buf.WriteString(", ")
		}
		
		buf.WriteString(fmt.Sprintf("%d", value))
	}
	buf.WriteString("]")

	return buf.String()
}
fmt.Println(intsToString([]int{1,2,3,4,5}))
// 输出：[1, 2, 3, 4, 5]
```


