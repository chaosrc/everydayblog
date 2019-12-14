---
title: Golang 反射（三）
date: 2019-12-10
---

## Golang 反射（三）



#### 编码 S-表达式（s-express）

类似于 JSON、XM，S-表达式也是一种广泛使用的数据格式，是 Lisp 语言的语法。

下面我们将实现一个 S-表达式，支持下面几种结构：

```
   42         integer
   "hello"    string
   foo        symbol(不带引号的名称)
   (1 2 3)    list
```

对于数值和字符串转为对应的类型；对于 struct 每个字段转换为两个元素的 list，第一个元素为字段名称，第二个为字段的值；对于 map 类型也转换为 list 对，每一对为 map 的 key 和 value


```go
package main

import (
	"bytes"
	"fmt"
	"reflect"
)

func encode(buf *bytes.Buffer, v reflect.Value) error {
	switch v.Kind() {
	case reflect.Invalid:
		fmt.Fprintf(buf, "%s", "nil")
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		fmt.Fprintf(buf, "%d", v.Int())
	case reflect.String:
		fmt.Fprintf(buf, "%q", v.String())

	case reflect.Array, reflect.Slice:
		buf.WriteString("(")
		for i := 0; i < v.Len(); i++ {
			encode(buf, v.Index(i))
			if i != v.Len()-1 {
				buf.WriteByte(' ')
			}
		}
		buf.WriteString(")")
	case reflect.Struct:
		buf.WriteByte('(')
		for i := 0; i < v.NumField(); i++ {
			name := v.Type().Field(i).Name
			fmt.Fprintf(buf, "(%s ", name)
			encode(buf, v.Field(i))
			buf.WriteString(")")
			if i != v.NumField()-1 {
				buf.WriteByte(' ')
			}
		}
		buf.WriteByte(')')
	case reflect.Map:
		buf.WriteByte('(')
		for i, key := range v.MapKeys() {
			fmt.Fprintf(buf, "(%s ", key)
			encode(buf, v.MapIndex(key))
			buf.WriteByte(')')

			if i != len(v.MapKeys())-1 {
				buf.WriteByte(' ')
			}
		}
		buf.WriteByte(')')
	case reflect.Ptr:
		encode(buf, v.Elem())
	default:
		// 不支持的类型 Func chan interface 等
		return fmt.Errorf("unsupport type %s", v.Type())

	}

	return nil
}

func Marshal(v interface{}) ([]byte, error) {
	var buf bytes.Buffer
	err := encode(&buf, reflect.ValueOf(v))
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
```

使用 Marshal 方法
```go
foo := Foo{
	"bar",
	18,
	[]string{"123", "Hello", "good"},
	map[string]bool{"name": true, "get": false},
}

b, _ := Marshal(foo)
fmt.Println(string(b))

fmt.Println("---------------------------------")

s, _ := Marshal(os.Stderr)
fmt.Println(string(s))
```

输出
```shell
$ go run .
((foo "bar") (age 18) (list ("123" "Hello" "good")) (m ((name ) (get ))))
---------------------------------
((file ((pfd ((fdmu ((state ) (rsema ) (wsema ))) (Sysfd 2) (pd ((runtimeCtx ))) (iovecs nil) (csema ) (isBlocking ) (IsStream ) (ZeroReadIsEOF ) (isFile ))) (name "/dev/stderr") (dirinfo nil) (nonblock ) (stdoutOrErr ) (appendMode ))))
```