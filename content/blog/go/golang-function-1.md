---
title: Golang 函数（一）
date: 2019-10-28
---


## Golang 函数（一）



#### 函数声明

一个函数的声明包括函数名称、参数列表、可选的返回列表和函数主体：

```go
func name(parameter-list)(return-list) {
    body
}
```

参数列表指定了函数参数的名称和类型，返回列表指定了函数返回值的类型。下面定义了一个 hypot 函数：

```go
func hypot(x, y float64) float64 {
	return math.Sqrt(x*x + y*y)
}
```

函数可以有多个返回值
```go
func LenAndCap(list []int) (int, int) {
	return len(list), cap(list)
}


func main() {
    // 调用函数
	l, c := LenAndCap([]int{1, 2, 3})
	fmt.Println(l, c) // 0, 0
}
```

当有多个返回值时，调用者必须明确的将所有返回值赋值。如果要忽略某个返回值可以将它赋值给空白标志符

```go
a := LenAndCap([]int{1,2,3}) //cannot initialize 1 variables with 2 valuesLSP

// 忽略第二个返回值
b, _ := LenAndCap([]int{1,2,3})
```


和参数一样，返回值也可以命名，这时每一个返回值名称声明了一个本地变量并且初始化为零

```go
func namedReturn() (i int, s string) {
	s = "foo"
	return i, s
}

func main() {
	i, s := namedReturn()
	fmt.Println(i, s) // 0 foo
}
```


函数的参数通过值传递，因此函数接受的是每个参数的拷贝。对拷贝数据的修改不会影响调用者，然而如果参数包含引用类型比如指针、slice、map、function 或者 channel，那么函数对这些间接引用变量的任何修改都可能影响到调用者








