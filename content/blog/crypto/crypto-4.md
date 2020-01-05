---
title: 现代密码学：古典密码及其分析（二）
date: 2020-01-03
---


## 现代密码学：古典密码及其分析（二）



#### 单字母替换

位移密码将每个明文字符映射成不同的的密文字符，但是每个字符都是做相同的位移。单字母替换的想法是对每个明文字符做不同的映射，为了能够解密必须对每个字符做一对一的映射。key 空间的组成是字母表的所有排列方式，因此 key 空间的大小是 26!(接近 2<sup>88</sup>)

对这种加密的 key 空间进行暴力破解，即使使用现在最强的计算机也需要发费大于几十年的时间。但是也不意味着这个密码是安全的，

假设英文文本被加密，那么就有可能利用英文的统计原则攻击单字母替换。在对这个密码的攻击中下面两个属性：
1. 在本算法中每个字符的映射是固定的，所以如果 e 映射为 D，那么明文中每一个出现 e 的地方在密文中都为 D。
2. 在英语中每个独立字母的分布是已知的。因此不同的文本中每个字母的平均统计频率是不变的，文本越长平均统计频率越接近。

通过列出密文的可能分布，比较英文文本字母的可能分布来进行攻击。首先对加密文本的每个字母出现频率进行统计，然后基于统计频率定义的 key 映射做一个初始猜测。除非加密文本很长，否则有些猜测可能是错误。但是，即使对很短的加密文本，这种猜测也足够快速解密。

英语中字母的平均出现频率

![ldG8SS.png](https://s2.ax1x.com/2020/01/04/ldG8SS.png)


通过统计频率对下面的密文进行解密
```
JGRMQOYGHMVBJWRWQFPWHGFFDQGFPFZRKBEEBJIZQQOCIBZKLFAFGQVFZFWWE OGWOPFGFHWOLPHLRLOLFDMFGQWBLWBWQOLKFWBYLBLYLFSFLJGRMQBOLWJVFP FWQVHQWFFPQOQVFPQOCFPOGFWFJIGFQVHLHLROQVFGWJVFPFOLFHGQVQVFILE OGQILHQFQGIQVVOSFAFGBWQVHQWIJVWJVFPFWHGFIWIHZZRQGBABHZQOCGFHX
```

```go
package main

import (
	"unicode"
)

func letterCounter(text string) map[rune]int {
	count := make(map[rune]int)

	for _, c := range text {
		if unicode.IsLetter(c) {
			count[c]++
		}
	}

	return count
}

func main() {
	text := `
	JGRMQOYGHMVBJWRWQFPWHGFFDQGFPFZRKBEEBJIZQQOCIBZKLFAFGQVFZFWWE 
	OGWOPFGFHWOLPHLRLOLFDMFGQWBLWBWQOLKFWBYLBLYLFSFLJGRMQBOLWJVFP 
	FWQVHQWFFPQOQVFPQOCFPOGFWFJIGFQVHLHLROQVFGWJVFPFOLFHGQVQVFILE 
	OGQILHQFQGIQVVOSFAFGBWQVHQWIJVWJVFPFWHGFIWIHZZRQGBABHZQOCGFHX`

	counter := letterCounter(text)


	for c, v := range counter {
		fmt.Printf("%c, %d\n", c,v)
	}
}
```

输出统计结果

```shell
go run . | sort -k 2 -n -r
F, 37
Q, 26
W, 21
G, 19
L, 17
O, 16
V, 15
H, 14
B, 12
P, 10
J, 9
I, 9
Z, 7
R, 7
M, 4
E, 4
Y, 3
K, 3
C, 3
A, 3
S, 2
D, 2
X, 1
```



