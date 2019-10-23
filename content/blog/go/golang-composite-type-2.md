---
title: Golang 复合类型（二）
date: 2019-10-22
---

## Golang 复合类型（二）



#### Slice

Slice 是每个元素具有相同类型的可变长度序列，slice 写做 []T，其中 T 为元素类型，看上去和没有长度的数组很像

slice 由三部分组成：指针、长度和容量。指针指向 slice 能够接触到的第一个数组元素。长度是 slice 元素的数量，但是不能超过容量值。容量是 slice 底层数组的长度。内置的 cap 函数返回容量大小

多个 slice 可以用共享同一个底层数组。下面声明一个月份数组

```go
months := [...]string{1: "January", 2: "February",
		3: "March", 4: "April", 5: "May",
		6: "June", 7: "July", 8: "August",
		9: "September", 10: "October", 11: "November",
		12: "December"}
```

slice 操作 s[i:j] 创建一个新的 slice 指向 s 的 i 到 j-1 序列，其中 s 可以是一个数组变量、数组指针或者另一个 slice

对上面的月份数组进行 slice 操作

```go
Q2 := months[4:7]
summer := months[6:9]

fmt.Printf("%s len: %d, cap: %d\n", Q2, len(Q2), cap(Q2))
fmt.Printf("%s len: %d, cap: %d\n", summer, len(summer), cap(summer))

```
输出
```sh
[April May June] len: 3, cap: 9
[June July August] len: 3, cap: 7
```

![](https://s2.ax1x.com/2019/10/22/KGffqf.png)


slice 超出容量 cap(s) 会导致错误，但是 slice 超过长度 len(s) 则会扩展 slice

```go
fmt.Println(Q2[:5])
// [April May June July August]
```

因为 slice 包含数组元素的指针，因此将 slice 传人函数时允许函数修改底层的数组。下面的函数将一个数组反转

```go
func reverse(s []int) {
	l := len(s)
	for i := 0; i < l/2; i++ {
		s[i], s[l-1-i] = s[l-1-i], s[i]
	}
}

func main() {
	li := [...]int{1, 2, 3, 4, 5}
	reverse(li[:])
	fmt.Println(li) // [5 4 3 2 1]
}
```

与数组不同，slice 不能比较，因此不能使用 == 来比较两个 slice 是否具有相同的元素

slice 的零值为 nil。一个 nil 的 slice 没有底层的数组，它的长度和容量都为 0，但同时也存在 non-nil 的 slice 长度和容量也为 0 ，比如 []int{} 或 make([]int, 3)[3:]

如果要测试一个 slice 是否为空，使用 len(s) == 0 而不是 s == nil，其他情况下 nil slice 的表现和长度为 0 的 slice 一样


内置的 make 方法可以创建一个指定类型、长度和容量的 slice，容量参数可以省略，省略时容量和长度相等

```go
make([]int, 3, 5)
make([]int, 3)
```

