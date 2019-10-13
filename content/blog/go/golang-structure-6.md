---
title: Go 程序结构（六）
date: 2019-10-12
---

## Go 程序结构（六）



#### 类型声明

一个变量或表达式定义了值的特征，比如它的大小、内部展现方式、能够对它进行的操作以及与之相关的一些方法

在任何程序中，都有一些变量有相同的展现形式，但是完全不同的含义，比如一个 int 变量可以是一个循环的索引、一个时间戳、一个文件大小的描述或者一个月份

一个类型（type）声明定义了一个新的命名类型，具有与现在 type 相同的类型。一个命名类型提供了一种方式分离和独立类型的使用

```go
// 类型声明
type name underlying-type
```
类型声明多出现在包（package）级别，这里定义的类型对于包内可见，如果被导出（以大写字母开头），则在其他包中也可以使用

下面是一个温度转换程序，在摄氏度和华氏度之间进行转换

```go
package tempconv


type Celsius float64
type Fahrenheit float64

const (
	AbsoluteZero Celsius = -273.15
	FreezingC    Celsius = 0
	BollingC     Celsius = 100
)

func CToF(c Celsius) Fahrenheit {
	return Fahrenheit(c * 9 / 5 + 32)
}
func FToC(f Fahrenheit) Celsius {
	return Celsius((f - 32) * 5 / 9 )
}
```

上面的 package 中定义了两个类型 Celsius 和 Fahrenheit,分别表示摄氏度和华氏度，尽管两个的基础类型都是 float64，但是它们不是同一个类型，所以它们之间不能比较或用算术表达式组合。从 float64 转换需要指明转换类型比如 Fahrenheit(t) 或 Celsius(t)。Fahrenheit(t) 或 Celsius(t)是类型转换而不是方法调用

对于每一个类型 T，都有一个相应的转换操作 T(x) 将 x 转换为 T 类型。如果两个类型的原始类型相同那么它们之间可以相互转换。


命名类型也使得给类型的值定义新的行为成为可能。这些行为表示为一组与类型相关的函数，称为类型的方法

为 Celsius 类型定义 String 方法

```go
func (c Celsius) String() string {
	return fmt.Sprintf("%g°C", c)
}
```
很多类型都通过这种方式定义 String 方法，因为，它决定了在使用 fmt 包打印字符串时值的显示

```go
var f Celsius = 100
fmt.Printf("%s\n", f) // 输出；100°C
```



#### 包（package）和文件

包在 Go 中达到了在其他语言中库和模块相同的目的，支持模块化、封装、单独编译和复用。一个包的源码存在于一个或多个 .go 文件中，通常是在导入路径结尾名字的文件夹中，比如包 github.com/hello 的文件存放在 $GOPATH/src/github.com/hello 目录下

每个包都为其声明了一个独立的命名空间。包允许我们通过控制哪些名称是在包外面可见或导出来隐藏信息。在 Go 中使用一个简单的规则来管理那个标识符被导出：被导出的标识符使用大写字母开头













