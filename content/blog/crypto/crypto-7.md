---
title: 现代密码学：完全的加密
date: 2020-01-07
---


## 现代密码学：完全的加密



#### 定义

在不限制对手计算能力情况下也能证明是安全的加密方案被称作完全的加密（perfectly secret）。密文不会披露任何低层的明文，因此攻击者拦截密文获取不到任何明文信息，即使攻击者有无限的计算能力。



#### 一次性密码本



让 a ⊕ b 表示二进制字符串 a 和 b 的按位异或操作，那么一次性密码本定义如下：

1. 固定一个整数 l > 0，明文空间 M、key 空间 K 和 密文空间 C 都属于 {0,1}<sup>l</sup>（所有长度为l的二进制字符串的集合）
2. key 生成算法 Gen 根据均匀分布从{0,1} <sup>l</sup> 中选择一个字符
3. 加密方法 Enc 为：给定一个 key k 和 明文 m，输出 c = k ⊕ m
4. 解密方法 Dec 为：给定一个 key k 和 密文 c， 输出 m = k  ⊕ c


一次性密码本是完全的加密，但是有几个缺点。最突出的是 key 的长度要求和明文长度一样，对于长文本发送不太适用。然后是一次性密码本的同一个 key 只能使用一次。最后一个是只对 ciphertext-only 的攻击类型是安全的。



#### 完全加密的限制性

任何完全的加密方案必须拥有至少和明文空间一样大的 key 空间。因此 key 长度过大的问题不仅仅局限于一次性密码本，而是任何完全加密方案固有的问题。



#### 香农定理（Shannon's Theorem）

Shannon 不仅在完全加密中有突破工作，而且提供了完全加密的特征化。这个特征是，假设 |k|=|M|=|C|，key 生成算法 Gen 必须从所有 key 中均匀的选择一个 key，对于每个明文和密文存在一个唯一的 key 映射明文为密文。

香农定理对于判断给定的方案是否为完全加密非常有用



#### 总结

完全的加密是可实现的，即使不限制攻击者的即使能力密文也不会披露任何明文信息。然而，这种加密方案限制于 key 的长度必须至少等于明文长度，因此，在实际中很少使用。

