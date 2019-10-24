---
title: Golang 复合类型（三）
date: 2019-10-23
---

 ## Golang 复合类型（三）



#### append 函数

内置的 append 函数将元素添加到 slice 上

```go
var s []rune

for _, item := range "hello 世界" {
    s = append(s, item)
}
fmt.Printf("%q\n", s) // ['h' 'e' 'l' 'l' 'o' ' ' '世' '界']
```

理解 slice 对于 append 函数十分重要。下面是 appendInt 函数用来追加 int 类型的 slice

```go
func appendInt(src []int, val int) []int {
	var dist []int

	zlen := len(src) + 1

	if zlen <= cap(src) {
		// 有增长空间，则扩展 slice
		dist = src[:zlen]
	} else {
		// 空间不足，创建新的数组，容量扩大一倍
		zcap := 2 * len(src)
		dist = make([]int, zlen, zcap)
		copy(dist, src)
	}
	dist[zlen-1] = val
	return dist
}
```

每次 appendInt 方法调用时都会检查是否有足够的容量来储存新的元素。如果有则扩展原有的 slice ，追加新的元素 y，输入的 src 和 返回的 dist 共享同一个底层数组。

如果空间不够，则创建一个新的足够大的数组，将原有的值拷贝至新的数组，然后追加新的元素 y，输入的 src 和 返回的 dist 引用不同的底层数组

内置的 append 函数可能使用类似的，但是更加复杂的增长策略。通常我们无法确定调用 append 函数是否会导致重新分配，因此也不能假定原来的 slice 和 返回的 slice 是否引用同一个底层数组

append 函数也可以同时追加多个元素

```go
s := []int{1}
s = append(s, 2, 3)
s = append(s, 4, 5, 6)
fmt.Println(s) // [1 2 3 4 5 6]
```



#### In-Place Slice 

就地修改 slice 元素。给定一个字符串列表，noempty 方法返回非空的字符串列表

```go
func noempty(str []string) []string {
	var i int

	for _, s := range str {
		if s != "" {
			str[i] = s
			i++
		}
	}
	return str[:i]
}
```
输入和输出的 slice 共享了同一个底层数组，避免了重新分配数组，但同时也修改了输入的数组

```go
data := []string{"one", "", "three"}
data2 := noempty(data)

fmt.Println(data)   // [one three three]
fmt.Println(data2)  // [one three]
```

使用 append 函数来重写 noempty 函数

```go
func noempty2(str []string) []string {
	var r []string // 长度为 0 的 slice

	for _, s := range str {
		if s != "" {
			r = append(r, s)
		}
	}
	return r
}
```
每次 noempty2 调用会创建一个长度为 0 的新数组，然后将非空元素追加至新的数组。返回值 r 和输入值 str 不再引用同一个底层数组




