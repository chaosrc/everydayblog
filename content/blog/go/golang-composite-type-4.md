---
title: Golang 复合类型（四）
date: 2019-10-24
---

## Golang 复合类型（四）



#### Maps

哈希表是最灵活和通用的数据结构之一。它是一个无序的 key/value 键值对集合，所有的 key 都是唯一的，对应的 value 可以通过 key 检索、更新、移除。

在 Go 中，一个 map 指向一个哈希表，map 的类型写作 map[K]V，其中 K 和 V 为键和值的类型。在同一个 map 中所有的 key 为同一类型，value 也为同一类型。key 的类型 K 必须能够使用 == 比较，这样 map 才能测试给定的 key 是否已经存在。value 的类型 V 没有限制条件。


使用内置的 make 方法创建一个 map
```go
m := make(map[string]string)
```
使用 map 字面量创建 map，并添加一些初始化的键值对
```go
m2 := map[string]string{
    "name":    "foo",
    "address": "shanghai",
}
```
更新和检索 value

```go
m2["name"] = "bar"
m2["phone"] = "12345678"
fmt.Println(m2["name"], m2["phone"])
// 输出：bar 12345678
```

使用内置的 delete 函数删除键值对

```go
delete(m2, "name")
fmt.Printf("%q, %q\n",m2["name"], m2["phone"])
// 输出："", "12345678"
```

即使元素不在 map 中所有的这些操作也都是合法的，查找一个不在 map 中的 key 返回值类型的空值


使用基于 range 的 for 循环遍历 map

```go
for k, v := range m2 {
    fmt.Println(k, v)
}
```

使用 len 函数获取 key 数量

```go
fmt.Printf("%d\n", len(m2)) // 3
```

map 的空值为 nil，不指向任何哈希表
```go
var ages map[string]int
fmt.Println(ages == nil, len(ages)) // true, 0
```
大部分操作包括检索、删除、len 和 range for 循环对于 nil map 是安全的，其表现和空的 map 一致，但是对 nil 的 map存储值会报错

```go
var ages map[string]int
ages["foo"] = 20 //panic: assignment to entry in nil map
```
在存值之前需要先分配一个 map

