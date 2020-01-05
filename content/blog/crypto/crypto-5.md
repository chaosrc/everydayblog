---
title: 现代密码学：古典密码及其分析（三）
date: 2020-01-04
---


## 现代密码学：古典密码及其分析（三）



#### Vigen`ere 密码（多表置换密码）

在单字母替换密码中之所以能够实施统计频率攻击是因为每个字母的映射是固定的。如果能够将不同位置上相同的明文字符映射为不同的加密字符就能阻止这种攻击。这种加密能够将输出的密文字符的可能分布更加“平滑”。因此计算字符的分布不会得到太多映射信息。


Vigen`ere 密码是按顺序执行多个位移密码。首先选择一个私密的单词做为 key，然后明文通过添加每个明文字符下面的 key 字符（做为位移密码）加密。比如，使用 cafe 做为 key 加密文本“tellhimaboutme”：

```
Plaintext:     tellhimaboutme
Key:           cafecafecafeca
Ciphertext:    WFRQKJSFEPAYPF
```
第 1、5、9 个字符使用相同的加密，位移加密 key = 3，同样 2、6、10 和 3、7、11 也分别使用相同的 位移加密 key = 1 和 k = 5。使用不同的 key 重复进行位移加密。上面的例子中 l 被映射为 R 或者 Q，而加密文本中的 F 有时是从 a 加密而来，有时从 e 加密而来。因此加密文本的字符频率被“抹平”了。

如果 key 是一个足够大的随机字符串，那么破解这种加密是很困难的。尽管这种加密是在 16 世纪发明的，对它系统性的攻击在几百年之后才发明。


#### 破解 Vigen`ere 密码

对于 Vigen`ere 密码，如果 知道 key 的长度，那么破解将会变得很容易。如果 key 的长度为 t，那么可以将密文按照 t 长度分割，每个部分可以看作是一个位移密码，因此我们仍然能够使用统计频率攻击方式。

那么如果找出 key 的长度？一个方式是使用 Kasiski’s 方法，首先定位 2 个或 3 个加密字符的重复的部分，因为在英语中 2 个或 3 个字母的单词出现频率较高，比如单词 the 经常出现。单词 the 可能会映射为不同的加密字符，但是如果它在相同的相对位置出现，则会映射为相同的密文字符。

```
Plaintext:  the man and the woman retrieved the letter from the post office
Key:        bea dsb ead sbe adsbe adsbeadsb ean sdeads bead sbe adsb eadbea
Ciphertext: VMF QTP FOH MJJ XSFCS SIMTNFZXF YIS EIYUIK HWPQ MJJ QSLV TGJKGF
```

上面的 the 两次被映射为 MJJ。Kasiski 方法就是通过多次重复出现的文本之间的距离来计算加密周期大小，也就是 key 的长度。