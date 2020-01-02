---
title: 现代密码学：古典密码及其分析（一）
date: 2020-01-02
---



## 古典密码及其分析（一）



#### 凯撒密码

凯撒密码是最古老的密码之一。凯撒密码通过将字母表中的字母旋转 3 个位置来加密，用 D 替代 a，E 替代 b，依次类推，在字母表的结尾字母环绕，所以 A 替代 x，B 替代 y，C 替代 z。



### 位移密码和充分的 key 空间原则

凯撒密码面临的问题是，加密总是以相同的方法进行，而且没有私密 key。位移密码和凯撒密码相似，但是使用一个私密的 key。位移加密使用一个 0 到 25 的数字 k 做为 key，字母位移 k 个位置。用加密语法来描述为：算法 Gen 生成一个 {0,...,25} 的随机数字；Enc 算法使用 k 和原始文本，将文本每个字母向前位移 k 个位置；Dec 算法使用 k 和加密文本，对加密文本向后移动 k 个位置。

使用更数学一点的描述为：使用 k 和 字符 m<sub>i</sub> 生成加密字符[(c<sub>i</sub>+k) mod 26]，解密一个被加密的文本字符定义为 [(c<sub>i</sub>-k) mod 26]。



位移加密并不安全，因为一共只有 26 种可能的 key，很容易的通过尝试所有 key 来进行破解。这种攻击也被称作暴力攻击或者穷举搜索。这给我们带来的一个重要的原则“充分的 key 空间原则”（sufficient key space principle）:

> 任何安全的加密方案必须有一个不能被轻易穷举的 key 空间

现在一个安全的 key 空间数量至少为 2<sup>60</sup> 或者 2<sup>70</sup> 




简单的代码实现：

```go
package main

import (
	"unicode"
)

type Caesar struct {
	k int
}

func (c *Caesar) Enc(str string) string {
	var re []rune
	var a = 'a'
	for _, s := range str {
		if unicode.IsLetter(s) {
			s = a + (s-a+rune(c.k))%26
		}
		re = append(re, s)
	}
	return string(re)
}

func (c *Caesar) Dec(str string) string {
	var re []rune
	var a = 'a'
	for _, s := range str {
		if unicode.IsLetter(s) {
			s = a + (s-a-rune(c.k)+26)%26
		}
		re = append(re, s)
	}
	return string(re)
}

func NewCaesar(k int) Caesar {
	return Caesar{k}
}

func main() {
	caesar := NewCaesar(3)
	text := "hello world"
	en := caesar.Enc(text)

	fmt.Println("plaintext:  ", text)
	fmt.Println("key:        ", caesar.k)
	fmt.Println("ciphertext: ", en)
	fmt.Println("decrypt:    ", caesar.Dec(en))
}
```

输出
```shell
$ go run .
plaintext:   hello world
key:         3
ciphertext:  khoor zruog
decrypt:     hello world
```
