---
title: Golang 测试（一）
date: 2019-12-02
---

## Golang 测试（一）



#### go test 工具

go test 子命令是 Go 包的一个测试驱动。在一个包目录中，以 _test.go 结尾的文件不是 go build 构建的包的一部分，而是 go test 构建的包的一部分。

在 *_test.go 文件中， 有三种特殊的函数： tests、benchmarks 和 examples。测试函数是名称以 Test 开头的函数，测试程序逻辑是否正确。go test 调用测试函数并报告成功或失败的结果。benchmarks 函数是以名称 Benchark 开头的函数，用来测量某些操作的性能，go test 报告操作的平均执行时间。example 函数，以 Example 开头，提供机器检查的文档。

go test 工具扫描 *_test.go 文件的这些特殊方法，生成一个临时的 main 包，编译运行，报告结果，然后再把它们清理掉。



#### Test 函数

每个测试文件必须导入 testing 包，测试函数具有以下签名：
```go
func TestName(t *testing.T) {
    //...
}
```

测试函数名以 Test 开头，后缀 *Name* 必须以大写字母开头：
```go
func TestSin(t *testing.T){}
func TestCos(t *testing.T){}
func TestLog(t *testing.T){}
```

参数 t 提供了报告测试失败和打印额外信息的函数。下面是一个 word 包，包含一个方法 IsPalindrome ：检查一个字符串是否向前和向后读是一样的。

```go
// 文件：word.go
package word

func IsPalindome(s string) bool {
	lastIndex := len(s) - 1
	for i := 0; i < lastIndex/2; i++ {
		if s[i] != s[lastIndex-i] {
			return false
		}
	}
	return true
}
```
```go
// 文件: word_test.go
package word

import (
	"testing"
)

func TestPalindrome(t *testing.T) {
	if !IsPalindome("detartrated") {
		t.Error(`IsPalindome("detartrated") = false`)
	}

	if !IsPalindome("kayak") {
		t.Error(`IsPalindome("kayak") = false`)
	}
}

func TestNonPalindrome(t *testing.T) {
	if IsPalindome("palindrome") {
		t.Error(`IsPalindome("palindrome") = true`)
	}
}
```

运行
```shell
$ go test
PASS
ok      example.com/hello/test/word     0.004s
```

使用 -v 参数打印每个测试的名字和执行时间
```shell
$ go test -v
=== RUN   TestPalindrome
--- PASS: TestPalindrome (0.00s)
=== RUN   TestNonPalindrome
--- PASS: TestNonPalindrome (0.00s)
PASS
ok      example.com/hello/test/word     0.004s
```
-run 参数使用正则表达式来匹配需要运行的测试

```shell
$ go test -run="Non|Franch" -v
=== RUN   TestNonPalindrome
--- PASS: TestNonPalindrome (0.00s)
=== RUN   TestFranchPalindrome
--- FAIL: TestFranchPalindrome (0.00s)
    word_test.go:25: IsPalindome("été") = false
FAIL
exit status 1
FAIL    example.com/hello/test/word     0.004s
```




