---
title: Golang 反射（一）
date: 2019-12-08
---

## Golang 反射（一）

Go 提供了一个机制在运行时对变量更新、检查它的值、调用它的方法以及运行固有的操作，而不需要在编译时知道它的类型。这种机制称为反射。反射使得我们可以把类型本身当作第一类值。



#### 为什么使用反射
有时候我们需要写一个的函数能够一致的处理类型值，但是这些类型不满足一个通用的接口，没有一个已知的呈现，或在设计这个函数时类型还不存在。

一个熟悉的例子是 fmt.Fprintf 中的格式逻辑，能够很有效的打印任意类型的任意值，甚至是用户定义的类型。下面我们通过现有的知识来尝试实现这个函数。

```go
func Sprint(x interface{}) string{
	type  Stringer interface {
		String() string
	}
	switch x := x.(type) {
	case Stringer:
		return x.String()
	case string:
		return x
	case int:
		return strconv.Itoa(x)
	case float64:
		return strconv.FormatFloat(x, 'b', 6, 64)
	case bool:
		if x {
			return "true"
		} else {
			return false
		}
	default:
		return ""
	}
}
```
对于 `[]float`、`map[string][]string` 类型我们该如何处理？如果没有一个方式来检查未知值的类型，那么我们很快将会卡住，这时我们需要反射



#### reflect.Type 和 relectj.Value

反射通过 reflect 包提供，它定义了两个重要的类型，Type 和 Value。Type 表示一个 Go 类型，它是一个接口有很多方法来识别类型以及检查它们的组件，比如 struct 的字段、函数的参数。reflect.Type 的本质实现是类型描述，和接口值动态类型的实体相同。

reflect.Typeof 方法接收任何 interface{} 返回一个动态类型 reflect.Type 
```go
t := reflect.TypeOf(3)
fmt.Println(t.String()) // int
```

因为 reflect.Typeof 返回接口值的动态类型，因此它总是返回一个具体类型。

```go
var w io.Writer = os.Stdout
fmt.Println(t.String()) // *os.File
```

reflect 包中另一个重要的类型是 Value，reflect.Value 可以保存任何类型的值。reflect.ValueOf 方法接收任何类型的 interface{}，返回包含接口动态值的 reflect.Value，同样  reflect.ValueOf 返回的结果也总是具体的 

```go
v := reflect.ValueOf(1)
fmt.Println(v)          //  1
fmt.Println(v.String()) //  <int Value>
```
调用 Value 上的 Type 方法返回类型的 reflect.Type 

```go
fmt.Println(v.Type()) // int
```

reflect.ValueOf 的相反操作是 reflect.Value.Interface 方法，它返回 relfect.Value 的具体类型保持的接口
```go
f := reflect.ValueOf(2)
i := f.Interface()  // interface{}
fmt.Println(i.(int)) // 2
```

