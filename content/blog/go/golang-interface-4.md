---
title: Golang 接口（四）
date: 2019-11-09
---


## Golang 接口（四）



#### 排序接口 sort.Interface

和字符串格式化一样，排序在很多编程语言中也是一个非常频繁的操作。

Go 中的 sort 包提供了根据排序函数对任何序列进行就地(in-place)排序的能力。在很多语言中，排序算法与序列的数据类型相关，排序函数与元素类型相关。相反，Go 的 sort.Sort 方法对序列和元素的类型没有任何假设，而是使用 sort.Interface 来指定通用排序算法和每个数据类型之间的契约。这个接口的实现同时决定了序列的具体表现形式（通常是 slice）和元素的期望排序

实现就地排序需要三个东西：序列的长度、比较两个元素的方法以及两个元素的交换方式

```go
package sort

type Interface interface {
    Len() int
    Less(i, j int) bool // i,j 为序列元素的下标
    Swap(i, j int)
}
```

对任何序列进行排序，需要定义一个类型实现这三个方法，然后将这个类型的实例传人 sort.Sort 方法。

下面实现一个 string 排序

```go
type StringList []string


func (s StringList) Len() int {
	return len(s)
}

func (s StringList) Less(i, j int) bool {
	return s[i] < s[j]
}

func (s StringList) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
```

```go
func main() {
	a := []string{"Java", "C", "Python", "Javascript", "Kotlin"}

	sort.Sort(StringList(a)) // 将 []string 转换为 StringList 进行排序
    fmt.Printf("%q\n",a) 
    // ["C" "Java" "Javascript" "Kotlin" "Python"]
}
```

StringList(a) 将 []string 转换为 StringList 类型，生成了一个具有相同长度、容量和底层数组的 slice 值，同时也具有了排序需要的三个方法。


对复杂类型也可以进行排序。下面定义一个 Track 类型，然后对它进行排序

```go
type Track struct {
	Title  string
	Artist string
	Album  string
	Year   int
	Length time.Duration
}

type byArtist []Track

func (b byArtist) Len() int           { return len(b) }
func (b byArtist) Less(i, j int) bool { return b[i].Artist < b[j].Artist }
func (b byArtist) Swap(i, j int)      { b[i], b[j] = b[j], b[i] }
```

```go
func main() {
    tracks := []Track{
        {"Go", "Delilah", "From the Roots Up", 2012, time.Minute * 3},
        {"Go", "Moby", "Moby", 1992, time.Minute * 2},
        {"Go Ahead", "Alicia Keys", "As I Am", 2007, time.Minute * 5},
        {"Ready 2 Go", "Martin Solveig", "Smash", 2011, time.Minute * 4},
	}

	sort.Sort(byArtist(tracks))

	fmt.Println(tracks)
}
```

上面定义了一个 byArtist 类型，使用 Artist 字段进行排序。如果要对其他字段进行排序，我们必须定义一个新的类型，比如对Year字段排序定义一个 byYear 类型。但是使用其他字段排序时 Len 方法和 Swap 方法是一样的，只有比较函数 Less 不一样。这时可以定义一个 struct 类型组合一个 slice 和方法，使得定义新的排序时只需要定义比较函数，如下：

```go
type customSort struct {
	tracks []*Track
	comp   func(a, b *Track) bool
}

func (c customSort) Len() int {
	return len(c.tracks)
}
func (c customSort) Less(i, j int) bool {
	return c.comp(c.tracks[i], c.tracks[j])
}
func (c customSort) Swap(i, j int) {
	c.tracks[i], c.tracks[j] = c.tracks[j], c.tracks[i]
}
```

使用 customSort 进行排序

```go
sort.Sort(customSort{tracks, func(a, b *Track) bool {
    if a.Title != b.Title {
        return a.Title < b.Title
    }
    if a.Year != b.Year {
        return a.Year < b.Year
    }

    return a.Length < b.Length
}})
```

结果
```sh
{Go Moby Moby 1992 2m0s}
{Go Delilah From the Roots Up 2012 3m0s}
{Go Ahead Alicia Keys As I Am 2007 5m0s}
{Ready 2 Go Martin Solveig Smash 2011 4m0s}
```



