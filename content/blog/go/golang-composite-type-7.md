---
title: Golang 复合类型（七）
date: 2019-10-27
---

## Golang 复合类型（七）



#### JSON


JSON 是传输结构化数据使用最广泛的形式。Go 标准库中的 encoding/json、encoding/xml、encoding/asn1等包，对 josn、xml、asn1 等格式的编码和解码都有非常好的支持，并且提供了相似的 APIs。

JSON 中的基本类型 number、boolean、string，对应 Go 中的基本类型。JSON 中的数组用来编码 Go 中的 array和 slice。JSON 中的 object 用来编码 Go 中的 map 和 struct。

下面是一个 movie 的数据类型以及它的一个列表值
```go
type Movie struct {
	Title  string
	Year   int  `json:"release"`
	Color  bool `json:"color,omitempty"`
	Actors []string
}
movies := []Movie{
	{
        Title: "Casablanca", Year: 1942, Color: false,
        Actors: []string{"Humphrey Bogart", "Ingrid Bergman"},
    },
    {
        Title: "Cool Hand Luke", Year: 1967, Color: true,
        Actors: []string{"Paul Newman"},
    },
    {
        Title: "Bullitt", Year: 1968, Color: true,
        Actors: []string{"Steve McQueen"},
    },
}
```
这种结构的数据非常适合与 JSON 格式之间的相互转换。在 Go 中将数据转换为 JSON 格式被称作 *marshaling*，通过 json.Matshal 方法实现：

```go
data, err := json.Marshal(movies)
if err != nil {
    fmt.Println(err)
}
fmt.Printf("%s\n",data)
```
输出
```json
[{"Title":"Casablanca","release":1942,"Actors":["Humphrey Bogart","Ingrid Bergman"]},{"Title":"Cool Hand Luke","release":1967,"color":true,"Actors":["Paul Newman"]},{"Title":"Bullitt","release":1968,"color":true,"Actors":["Steve McQueen"]}]
```

注意其中 Year 指定被转换成了release 输出，而 Color 转换成了 color。是因为这两个字段定义了标签：
```go
Year   int  `json:"release"`
Color  bool `json:"color,omitempty"`
```
一个字段标签是一个字符串元数据，在编译时和 struct 的字段进行关联。标签中的 json 关键词控制了 encoding/json 包的行为，josn 字段标签的第一部分为 Go 字段指定了一个替代的 JOSN 名称。Color 标签中有一个额外的选项 omitempty，表示如果字段为类型零值则不在 JSON 中输出。




相对于 marshaling 相反即解码 JSON 并输出 Go 数据结构的操作，被称作 unmarshaling，通过 json.Unmarshal 实现。通过定义合适的 Go 数据类型，能够选择哪一部分 JSON 需要解码那一部分不需要。比如下面定义一个只有 Title 的 struct，那么解码时只会填充 Title 信息，JSON 中的其他信息会被忽略

```go
type Title struct {
    Title string
}

var titles []Title
if err := json.Unmarshal(data, &titles); err != nil {
    fmt.Println(err)
}
fmt.Println(titles)
// [{Casablanca} {Cool Hand Luke} {Bullitt}]
```


