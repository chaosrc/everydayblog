---
title: Golang 反射（二）
date: 2019-12-09
---

## Golang 反射（二）



#### 递归打印值
创建一个 Display 方法，对于任意的复杂结构，打印出值的完整结构，标记每一个元素的路径。

```go
package main

import (
	"fmt"
	"reflect"
	"strconv"
)

func Display(name string, x interface{}) {
	fmt.Printf("%s %T:\n", name, x)
	display(name, reflect.ValueOf(x))
}

func display(name string, v reflect.Value) {

	switch v.Kind() {
	case reflect.Invalid:
		fmt.Printf("%s=%q\n", name, "Invalid")
	case reflect.String:
		fmt.Printf("%s=%q\n", name, v.String())
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		i := strconv.FormatInt(v.Int(), 10)
		fmt.Printf("%s=%s\n", name, i)
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		i := strconv.FormatUint(v.Uint(), 10)
		fmt.Printf("%s=%s\n", name, i)
	case reflect.Bool:
		b := strconv.FormatBool(v.Bool())
		fmt.Printf("%s=%s\n", name, b)
	case reflect.Struct:
		for i := 0; i < v.NumField(); i++ {
			fieldName := v.Type().Field(i).Name
			display(fmt.Sprintf("%s.%s", name, fieldName), v.Field(i))
		}
	case reflect.Slice, reflect.Array:
		for i := 0; i < v.Len(); i++ {
			display(fmt.Sprintf("%s[%d]", name, i), v.Index(i))
		}
	case reflect.Map:
		for _, key := range v.MapKeys() {
			display(fmt.Sprintf("%s[%s]", name, key), v.MapIndex(key))
		}
	case reflect.Ptr:
		if v.IsNil() {
			fmt.Printf("%s=nil\n", name)
		} else {
			display(fmt.Sprintf("(*%s)", name), v.Elem())
		}
	case reflect.Interface:
		if v.IsNil() {
			fmt.Printf("%s=nil\n", name)
		} else {
			display(name, v.Elem())
		}
	case reflect.Func, reflect.Chan:
		fmt.Printf("%s=%s", name, strconv.FormatUint(uint64(v.Pointer()), 16))
	default:
		fmt.Printf("%s.type=%s\n", name, v.Type())
	}
}
```

Slice 和 Array：使用 Len 方法获取元素的数量，然后通过 Index(i) 方法遍历元素

Struct：NumField 方法返回 struct 字段的数量，Field(i) 返回第 i 个字段

Maps：MapKeys 方法获取 map 的所有 key ，MapIndex(key) 返回 key 对应的值

Pointer：Elem 方法返回指针所指向的变量，IsNil 方法判断指针是否为空

Interface：同样 IsNil 方法判断接口是否为空，Elem 方法获取接口的动态值



调用 Display 方法
```go
type Foo struct {
	foo  string
	age  int
	list []string
	m    map[string]bool
}

func main() {

	// Display("a", nil)
	Display("Foo", Foo{
		"bar",
		18,
		[]string{"123", "Hello", "good"},
		map[string]bool{"name": true, "get": false},
	})
	fmt.Println()

	Display("Stderr", os.Stderr)
}
```

```shell
$ go run .
Foo main.Foo:
Foo.foo="bar"
Foo.age=18
Foo.list[0]="123"
Foo.list[1]="Hello"
Foo.list[2]="good"
Foo.m[name]=true
Foo.m[get]=false

Stderr *os.File:
(*(*Stderr).file).pfd.fdmu.state=0
(*(*Stderr).file).pfd.fdmu.rsema=0
(*(*Stderr).file).pfd.fdmu.wsema=0
(*(*Stderr).file).pfd.Sysfd=2
(*(*Stderr).file).pfd.pd.runtimeCtx=0
(*(*Stderr).file).pfd.iovecs=nil
(*(*Stderr).file).pfd.csema=0
(*(*Stderr).file).pfd.isBlocking=1
(*(*Stderr).file).pfd.IsStream=true
(*(*Stderr).file).pfd.ZeroReadIsEOF=true
(*(*Stderr).file).pfd.isFile=true
(*(*Stderr).file).name="/dev/stderr"
(*(*Stderr).file).dirinfo=nil
(*(*Stderr).file).nonblock=false
(*(*Stderr).file).stdoutOrErr=true
(*(*Stderr).file).appendMode=false
```
