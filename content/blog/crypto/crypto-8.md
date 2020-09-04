---
title: 现代密码学：对称私钥加密（一）
date: 2020-01-09
---


## 现代密码学：对称私钥加密（一）



#### 密码学的计算方法

前面所说的完全的加密是信息理论安全。与信息理论安全做为对比的是计算安全，而计算安全是大多数现代密码结构的目标。

限制在私有加密的情况下，现代加密方案有一个属性是：在足够长的时间和计算能力下是能够被破解的。尽管如此，在一定的假设下，破解这些加密方案即使使用最快的计算机需要的时间也是几十至几百年。实际上，这种安全级别已经足够了。



#### 计算安全的基本理念

> 一个密码即使不在数学上也要在实际中是难以破解的

完全的加密不是必须的，反而使用一个在"合理的时间"和“合理的成功概率”下不能破解的方案就足够了。 也就是说，使用一个加密方案，理论上能够被破解，但是使用最快的计算机 200 年内被破解的概率小于 2<sup>-30</sup>

相对于信息安全，计算安全对两个方面进行放开：
1. 安全仅仅是针对高效的攻击者
2. 攻击者有潜在的非常小的成功性（小到不用担心真的会发生）



具体的方法

量化给定加密方案安全性的具体方法是，通过限定任何攻击者在最大的特定时间内的最大成功概率。

以 t=2<sup>60</sup> 为数量级的计算在今天几乎是不可能的，在一个 1GHz 的计算机上，2<sup>60</sup> 个 CPU 周期需要 2<sup>60</sup>/2<sup>9</sup> 秒，也就是大约 35 年。

通常一个 key 值的长度 n 为 128 位。2<sup>60</sup> 和 2<sup>128</sup>的差值为 2<sup>68</sup>，大约包含 21 位数值。感受一下它有多大，根据物理学家的估计自从宇宙大爆炸以来的秒数大约为 2<sup>58</sup> 秒



渐进的方法

这种方法基于复杂的理论，将攻击者的运行时间和成功率做为函数参数，而不是具体的数字。具体来说是加密方案将会包含一个安全参数 n，n 为整数。攻击者的运行时间和成功概率都被视为函数的 n 参数。

1. 将“有效算法”的概念等同于在 n 上多项式运算时间的算法
2. 将“小概率成功”的概念等同于比任何 n 的逆多项式更小的成功概率