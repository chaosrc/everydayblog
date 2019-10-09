---
title: Go 程序结构（二）
date: 2019-10-08
---

## Go 程序结构（二）



#### 短变量声明

在一个方法中，可以使用短变量声明方式用来声明和初始化局部变量。它的形式是`name := expression `, name 的类型由表达式决定

```go
func foo() {
	a := "hello"
	b := false
	c := 1.23
}
```

因为它的简洁和灵活性，短变量声明已经成为了局部变量声明和使用的主要方式。使用 `var` 声明更倾向于保留下来用于明确指定与初始化值不同的类型，或者当一个变量需要先声明后面再赋值时使用

```go
func foo() {
	a := 100               // int 类型
	var b float32 = 100    //  float32 类型

	var names []string     // 先声明后面在赋值

	names = []string{"a", "b"}
}
```

与 `var` 声明一样，短变量声明也支持多个变量同时声明和初始化

```go
func multiStort() {
	i, s := 100, "hello" 
	fmt.Println(i, s)
}
```

同样短变量声明也可以用于方法调用，比如 `os.Open` 返回两个值使用短变量声明

```go
func fnCall() error {
	file, err := os.Open("./vars/bar.go")

	if err != nil {
		return err
	}
    // 使用 file
	file.Close()
	// ...
}
```

一个非常微妙但是非常重要的点是：短变量声明不需要声明等号左边所有的变量。如果有些变量已经在在当前作用域声明过，短变量声明相当于对这些变量进行赋值

```go
func fnCall() error {
	file, err := os.Open("./vars/bar.go")

	if err != nil {
		return err
    }
    
    info, err :=file.Stat() // err变量已经声明过，在这里相当于赋值
    
	fmt.Println(info)
	file.Close()
}
```

同时短变量声明必须至少有一个新的变量声明，比如下面的代码将会报错

```go
func short() {
	file, err := os.Open("./vars/bar.go")

	file, err := os.Create("./hello.go") //error: no new variables on left side of

	fmt.Println(file, err)
}
```

在这种情况下应该使用赋值语句

```go
func short() {
	file, err := os.Open("./vars/bar.go")

	file, err = os.Create("./hello.go") 

	fmt.Println(file, err)
}
```

