---
title: Go 程序结构（八）
date: 2019-10-13
---

## Go 程序结构（八）



#### 作用域（Scope）

一个声明的作用域指这个声明在程序可以使用的部分。与生命周期不同，一个声明的作用域是一个程序文本的范围，是编译时属性，而变量的生命周期是程序执行时的时间范围，是运行是属性

当一个声明的名字同时存在在外部作用域和内部作用域时，会先找到内部的声明

```go
func f() {}

var g = "g"

func main() {
	f := "f"
	fmt.Println(f)  //输出：f；main 函数中的 f
	fmt.Println(g)  //输出：g；包级别的变量 g 
}
```

在一个方法中，语法块可以被任意嵌套深度，内部变量覆盖外部变量

```go
func blocks() {
	x := "hello"
	for i := 0; i < len(x); i++ {
		var x = x[i]
		if x != '!' {
			var x = x + 'A' - 'a'
			fmt.Printf("%c", x)
		}
	}
	fmt.Println()
}
```
上面的代码中 `x[i]` 和 `x + 'A' - 'a'` 都是引用外部语法块的变量，然后分别声明了变量 x 覆盖外部变量


像 for 循环一样，if 和 switch 除了创建主体语法块外也可以创建隐含的语法块

```go
func ifBlock() {
	if x := f(); x == 0 {
		fmt.Println(x)
	} else if y := h(x); x == y {
		fmt.Println(x, y)
	} else {
		fmt.Println(x, y)
	}

	fmt.Println(x, y) // error: undeclared name
}
```
在 if-else 语句内可以引用到 x、y，但是在if-else 外面无法引用到 x、y

短变量声明会生成一个本地变量

```go
var l = 1

func local() {
	l, j := 2, 3
	fmt.Println(j) // 输出：l declared and not used
}
func local2() {
	var j int
	l, j = 2, 3
	fmt.Println(j)
}
```
上面的 l，因为在 local 方法中重新声明了，如果没有使用则会报错，而在 local2 中是赋值给包级别的变量 l，因此不会报错























