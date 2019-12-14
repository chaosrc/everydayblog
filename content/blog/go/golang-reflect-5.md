---
title: Golang 反射（五）
date: 2019-12-12
---


## Golang 反射（五）



#### 解码 S 表达式


词法分析使用 text/scanner 包的 Scanner，将输入流分割成 token 序列。Scanner 的 Scan 方法推进扫描器并且获取下一个 rune 类型的 token。

```go
package main

import (
	"text/scanner"
)

type lexer struct {
	scanner scanner.Scanner
	token   rune
}
func (lex *lexer) next() {
	lex.token = lex.scanner.Scan()
}
func (lex *lexer) text() string {
	return lex.scanner.TokenText()
}
```

```go

func read(lex *lexer, v reflect.Value) {
	switch lex.token {
	case scanner.Ident:
		if lex.text() == "nil" {
			v.Set(reflect.Zero(v.Type()))
			lex.next()
			return
		}
	case scanner.String:
		s, _ := strconv.Unquote(lex.text())
		v.SetString(s)
		lex.next()
		return
	case scanner.Int:
		i, _ := strconv.Atoi(lex.text())
		v.SetInt(int64(i))
		lex.next()
        return
    case '(':
		lex.next()
		readList(lex, v)
        lex.next()
        return
	}
	panic(fmt.Sprintf("unkown token %s", lex.text()))
}
```
在 read 方法中 Ident 类型用来处理 struct 字段名和指针的 nil 值。当遇到 nil 值时，使用 reflect.Zero 方法设置 v 的值为其类型的零值。

'(' 表示列表的开始，下面的 readList 方法将 list 解码为复合类型（map、struct、slice）

```go
func readList(lex *lexer, v reflect.Value) {
	switch v.Kind() {
	case reflect.Array:
		for i := 0; endList(lex); i++ {
			read(lex, v.Index(i))
		}
	case reflect.Slice:
		for !endList(lex) {
			item := reflect.New(v.Type().Elem()).Elem()
			read(lex, item)
			v.Set(reflect.Append(v, item))
		}
	case reflect.Struct:
		for !endList(lex) {
			lex.consume('(')

			field := lex.text()
			lex.next()
			read(lex, v.FieldByName(field))

			lex.consume(')')
		}
	case reflect.Map:
		v.Set(reflect.MakeMap(v.Type()))
		for !endList(lex) {
			lex.consume('(')

			key := reflect.New(v.Type().Elem()).Elem()
			read(lex, key)

			value := reflect.New(v.Type().Elem()).Elem()
			read(lex, value)

			v.SetMapIndex(key, value)
			lex.consume(')')
		}
	default:
		// panic(fmt.Sprintf("decode list fail %v", v))
		fmt.Printf("decode list fail %v", v)
	}

}

func endList(lex *lexer) bool {
	if lex.token == scanner.EOF {
		panic("end of file")
	}
	if lex.token == ')' {
		return true
	}
	return false
}
```

```go
func Unmarchal(data []byte, out interface{}) error {
	lex := &lexer{scanner: scanner.Scanner{Mode: scanner.GoTokens}}

	lex.scanner.Init(bytes.NewReader(data))
	lex.next()
	read(lex, reflect.ValueOf(out).Elem())
	return nil
}
```


