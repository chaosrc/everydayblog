---
title: Golang 测试（五）
date: 2019-12-06
---

## Golang 测试（五）



#### Benchmark（基准） 函数

基准测试是在固定工作负载下测量程序性能的实践。在 Go 中基准测试函数测试函数类似，但是以Benchmark前缀开头，提供一个 *testing.B 参数，同时暴露一个整数 N 指定被测量操作的执行次数。

下面是 IsPalindrome 在循环中调用 N 次的基准测试

```go
func BenchmarkPalindrome(b *testing.B) {
	for i := 0; i < b.N ; i++ {
		IsPalindome("A man, a plan, a cannal: panama")
	}
}
```
```go
func IsPalindome(s string) bool {
	var letters []rune

	for _, r := range s {
		if unicode.IsLetter(r) {
			letters = append(letters, unicode.ToLower(r))
		}
	}
	
	for i := range letters {
		if letters[i] != letters[len(letters)-1-i] {
			return false
		}
	}
	return true
}

```

运行基准测试
```shell
$ go test -bench=.
ssccess
1
BenchmarkPalindrome-4            4436701               280 ns/op
PASS
ok      example.com/hello/test/word     1.522s
```
基准测试函数名字后面的数字（这里是 4）表示 GOMAXPROCS，它对于并发基准测试很重要

上面的测试结果告诉我们 IsPalindrome 运行 4436701 次的平均执行时间为 280 纳秒



对 IsPalindrome 进行优化，首先想到的优化是在第二个循环的在中点停止循环，避免二次比较

```diff 
-       for i := range letters {
+       n := len(letters)/2
+       for i := 0; i < n; i++ {
                if letters[i] != letters[len(letters)-1-i] {
                        return false
```

运行基准测试
```shell
$ go test -bench=. -benchmem
ssccess
1
BenchmarkPalindrome-4            4523386               274 ns/op            
PASS
ok      example.com/hello/test/word     1.518s
```
但是通常一个明显的优化并不是总会带来预期的结果，这里只有 2% 左右的性能提升



下面进行另一个优化，通过给 letters 预分配一个足够大的数组，而不是通过 append 函数来扩展它来优化性能
```diff
 func IsPalindome(s string) bool {
-       var letters []rune
+       letters := make([]rune, 0, len(s))
 
        for _, r := range s {
                if unicode.IsLetter(r) {
```

运行
```shell
$ go test -bench=. -benchmem
ssccess
1
BenchmarkPalindrome-4            9143310               140 ns/op            
PASS
ok      example.com/hello/test/word     1.415s
```
可以看到这次性能有近 50% 的提升

这个例子说明了最快的程序通常是内存分配次数最少的程序。



使用 `-benchmem` 参数可以展示内存分配统计数据，下面值优化之前和之后的比较

```shell
$ go test -bench=. -benchmem
ssccess
1
BenchmarkPalindrome-4            4523386               274 ns/op             248 B/op          5 allocs/op
PASS
ok      example.com/hello/test/word     1.518s
```

```shell
$ go test -bench=. -benchmem
ssccess
1
BenchmarkPalindrome-4            9143310               140 ns/op             128 B/op          1 allocs/op
PASS
ok      example.com/hello/test/word     1.415s
```

可以看到单次调用减少了 80% 的内存分配




