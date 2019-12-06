---
title: Golang 测试（二）
date: 2019-12-03
---

##  Golang 测试（二）



#### 测试命令

go test 工具对于测试库包很有用，但是我们也可以用它来测试命令。一个命名为 main 的包产生一个可执行程序，但是也能做为一个库导入。

下面是一个 echo 命令程序：
```go
package main

import (
	"flag"
	"fmt"
	"os"
	"io"
	"strings"
)

var (
	n = flag.Bool("n", false, "省略换行符")
	s = flag.String("s", " ", "分割符")
)

var out io.Writer = os.Stdout

func main() {
	flag.Parse()
	if err := echo(*n, *s, flag.Args()); err != nil {
		fmt.Fprintf(os.Stderr, "echo: %v\n", err)
	}
}

func echo(n bool, s string, arg []string) error {
	fmt.Fprint(out, strings.Join(arg, s))
	if !n {
		fmt.Fprintln(out)
	}

	return nil
}
```
在测试中，我们可以使用多种参数和 flag 设置来检查每一种情况是否打印正确的结果。通过改变全局变量 out ，将结果输出到一个替代的 writer，而不是标准输出 stdout。

```go
package main

import (
	"bytes"
	"fmt"
	"testing"
)

func TestEcho(t *testing.T) {
	var tests = []struct {
		newline bool
		sep     string
		args    []string
		want    string
	}{
		{true, "", []string{}, "\n"},
		{false, "", []string{}, ""},
		{true, "\t", []string{"1", "2"}, "1\t2\n"},
		{true, ",", []string{"a", "b", "c"}, "a,b,c\n"},
		{false, ":", []string{"1", "2", "3"}, "1:2:3"},
	}

	for _, test := range tests {
		desc := fmt.Sprintf("echo(%v, %q, %q)", test.newline, test.sep, test.args)

		out = new(bytes.Buffer)
		if err := echo(!test.newline, test.sep, test.args); err != nil {
			t.Errorf("%s faild: %v", desc, err)
			continue
		}
		got := out.(*bytes.Buffer).String()

		if got != test.want {
			t.Errorf("%s = %s, want: %s", desc, got, test.want)
		}

	}
}

```

测试是包中的 main 函数不会被调用，而是像库一样暴露 TestEcho 方法给测试驱动

