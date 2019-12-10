---
title: Golang 测试（四）
date: 2019-12-05
---

##  Golang 测试（四）



#### 覆盖率（Coverage）

从本质上来讲，测试永远不会完整。没有一个测试数量可以来证明一个包没有 bug，它们最多能增加我们对这个包在一些重要的场景范围内正常工作的信心。

测试集对测试包的执行程度叫做测试覆盖率。覆盖率不能直接量化，但是有一些直观的方法可以帮助我们将测试工作引导到更有用的地方。

语句覆盖（statement coverage）是最简单和最广泛使用的方式。一个测试集的语句覆盖率是在测试期间至少执行一次的源码语句所占的比例。下面我们使用整合了 go test 的 Go cover 工具来测量语句覆盖率以及帮助识别测试中的明显缺陷。

```go
package eval

import (
	"math"
	"testing"
	"fmt"
)

func TestCover(t *testing.T) {
	var tests = []struct {
		input string
		env   Env
		want  string
	}{
		{"x % 2", nil, "unexpected '%'"},
		{"!true", nil, "unexpected '!'"},
		{"log(10)", nil, `unknown function "log"`},
		{"sqrt(1, 2)", nil, "call to sqrt has 2 args, want 1"},
		{"sqrt(A / pi)", Env{"A": 87616, "pi": math.Pi}, "167"},
		{"pow(x, 3) + pow(y, 3)", Env{"x": 9, "y": 10}, "1729"},
		{"5 / 9 * (F - 32)", Env{"F": -40}, "-40"},
	}

	for _, test := range tests {
		expr, err := Parse(test.input)
		if err == nil {
			err = expr.Check(map[Var]bool{})
		}
		if err != nil {
			if err.Error() != test.want {
				t.Errorf("%s: got %q, want %q", test.input, err, test.want)
			}
			continue
		}

		got := fmt.Sprintf("%.6g", expr.Eval(test.env))
		if got != test.want {
			t.Errorf("%s: %v, want %s", test.input, got, test.want)
		}
	}
}
```

先检查测试是否通过

```shell
 go test -v  -run=Cover .
=== RUN   TestCover
--- PASS: TestCover (0.00s)
PASS
ok      _/Users/chao/workspace/go/gopl.io/ch7/eval      0.006s
```

下面的命令可以查看如何使用 coverage 工具

```go
$ go tool cover
Usage of 'go tool cover':
Given a coverage profile produced by 'go test':
        go test -coverprofile=c.out

Open a web browser displaying annotated source code:
        go tool cover -html=c.out
...
```

使用 -coverprofile 参数运行测试

```shell
$ go test -run=Cover -coverprofile=c.out .
ok      _/Users/chao/workspace/go/gopl.io/ch7/eval      0.006s  coverage: 63.8% of statements
```

使用 go tool cover 生成 HTML 报告
```go
$ go tool cover -html=c.out
```
![QGoKxS.png](https://s2.ax1x.com/2019/12/06/QGoKxS.png)




