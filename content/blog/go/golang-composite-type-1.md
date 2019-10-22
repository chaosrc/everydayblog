---
title: Golang 复合类型（一）
date: 2019-10-21
---


## Golang 复合类型（一）



##### Arrays (数组)

数组是由零个或多个特定类型的元素组成的固定长度序列。因为数组是固定长度的，所以在 Go 中很少直接使用，而是使用更加灵活的 slice（切片），但是理解切片之前必须先理解数组

数组中通过下标获取单个元素，内置的 len 方法返回数组的长度
```go
var a [5]int
// 获取第一个元素
fmt.Println(a[0])
// 获取最后一个元素
fmt.Println(a[len(a) -1])

// 遍历每个元素
for k, v := range a {
    fmt.Println(k, v)
}
```

新创建的数组变量的初始值默认为对应类型的零值，对于数值类型是 0 。

可以通过数组字面量来初始化数组

```go
var a [3]int = [3]int{1,2,3}
fmt.Println(a)  // [1 2 3]
var b [3]int = [3]int{1,2}
fmt.Println(b)  //[1 2 0]
```

在数组字面量中，如果省略号 `...` 出现在了长度位置，那么数组的长度由初始化的数量决定

```go
c := [...]int{1,2,3,4}
fmt.Printf("%T\n", c)   // [4]int
```

数组的大小也是类型的一部分，所以 [3]int 和 [4]int 是不同的类型。数组的大小必须是一个常量表达式，它的大小在编译时就能够被计算

```go
a := [3]int{1,2,3}
a = [4]int{1,2} //error: cannot use ([4]int literal) (value of type [4]int) as [3]int value in assignment

fmt.Println(a)
```

字面量语法对于 arrays、slice、maps 和 structs 都相似，对于数组来说可以指定索引和值对的列表

```go
s := [...]string{1: "a", 3: "c"}
fmt.Println(1, s[1])   // 1 a
fmt.Println(2, s[2])   // 2  
fmt.Println(3, s[3])   // 3 c
```
这种形式可以指定任意位置的值，可以省略某些值，未指定的值未类型的零值
```go
r := [...]int{10: -1}
fmt.Println(r)
// [0 0 0 0 0 0 0 0 0 0 -1]
```


如果数组中的元素是*可比较*的，那么其数组类型也是*可比较*的，所以可以使用 == 操作符直接比较两个这种类型的数组，比较的是数组中每个元素是否相等

```go
a := [2]int{1, 2}
b := [...]int{1, 2}
c := [...]int{1, 3}

fmt.Println(a == b, a == c) // true false
```

当一个函数被调用时，每个参数值都会拷贝一份赋值给相应的参数变量，所以函数接受的是一份拷贝值，对于大型的数组是非常低效的，这种行为和哪些隐式传递数组引用的语言是不一样的

当然我们可以明确的传人一个数组的指针给函数

```go

func arrayPointer(a *[8]int) {
	for i, v := range a {
		a[i] = v + 1
	}
}

func main() {
	var a [8]int
	arrayPointer(&a)
	fmt.Println(a) // [1 1 1 1 1 1 1 1]
}

```



