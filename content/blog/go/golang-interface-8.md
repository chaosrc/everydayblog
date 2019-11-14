---
title: Golang 接口（八）
date: 2019-11-13
---


## Golang 接口（八）



#### 类型 Switch

类型有两种不同的使用方式。第一种，像前面示例的 io.Writer、io.Reader、http.Handler，一个接口表达具体类型之间的相似性，具体类型满足接口但是隐藏实现细节。这时，重点是方法而不是具体类型
。

第二种，利用接口值的能力来持有多种具体类型的值，可以认为接口是这些类型的联合。类型断言通常用来区别这些动态类型，然后分别处理每种情况。这时，重点是满足接口的具体类型，而不是接口方法，没有信息隐藏。接口的这种使用方式叫做*区别联合*(discriminated unions)。

这两种方式也就是面向对象语言中的*子类型多态*和*即时多态*。

Go 中查询 SQL 数据库的 API，像其他语言一样，我们分离查询语句中固定的部分和变量部分，如下：

```go
import (
	"database/sql"
)

func listTrack(db sql.DB, artist string, minYear, maxYear int) {
	result, err := db.Exec("SELECT * FROM track WHERE artist = ? and year > ? and year < ? ",
		artist, minYear, maxYear)
}
```

Exec 方法将查询语句中的 '?' 替换为相应的参数值，有可能是布尔值、数字、字符串或者 nil。

Exec 的实现方式可能是这样的：
```go
func sqlQuote(x interface{}) string {
	if x == nil {
		return "NULL"
	} else if _, ok := x.(int); ok {
		return fmt.Sprintf("%d", x)
	} else if _, ok := x.(string); ok {
		return fmt.Sprintf("%s", x)
	} 
	...
	
}
```
通过 if-else 链执行一系列的断言测试。

type switch 语句能够简化 if-else 的链式断言操作：

```go
switch x := x.(type) {
case int, uint:
    return fmt.Sprintf("%d", x)
case string:
    return fmt.Sprintf("%s", x)
case bool: 
    //...
case nil:
    //...
default: 
    //...
}
```
x.(type) 中的 type 为关键词，每一个 case 可以有多个类型。如果 case 的条件只有一个类型，那么 x 的类型和 case 的类型相同，比如 case string 里面的 x 为 string 类型， case bool 里面的 x 为 bool 类型。其他情况的 case 条件下的 x 为 switch 操作对象的接口类型，这个例子里面为 interface{}。


