---
title: 现代密码学：对称私钥加密（二）
date: 2020-01-09
---


## 现代密码学：对称私钥加密（二）



#### 有效的算法

前面我们已经将有效的计算定义为概率的多项式计算时间（probabilistic polynomial time）。对于算法 A，如果存在一个多项式 p 对于每一个输入 x ∈ {0,1}<sup>*</sup>，A(x) 的计算最多在 P(||x||) 步（||x|| 表示字符串 x 的长度）内结束，那么称 A 在多项式时间内运行。概率算法具有"抛硬币"的能力，这是对一个算法能获取随机资源的比喻。当考虑一个运行时间为 p 和输入长度为 n 的概率多项时间算法时，一个长度为 p(n) 的随机字符串就足够了，因为该算法只能在指定时间内使用 p(n) 个随机位。

任何对于概率多项式时间安全的攻击，一定对确定式多项式也是安全的



#### 产生随机数

只有当随机性可用时，密码学才有可能。基于这个事实，我们的疑问是，计算机上真实的“抛硬币”以及概率计算是否可能达到。

有几种方式来获取实际中的“随机比特”，一个方案是使用**硬件随机生成器**，基于像热/电噪音或放射性衰变生成随机的比特流。另一种方案是使用软件随机生成器，基于不确定的行为，比如按键输入之间的时间、鼠标的移动、硬盘的访问时间等，来生成随机的比特流。一些现代操作系统提供来这类功能。

必须注意随机比特是如何选择的，使用不合适的随机数生成器通常会造成一个好的加密系统轻易受到攻击。比如当前时间（甚至达到毫秒）也不是非常随机，不能作为密钥的基础。



#### 可忽略的成功率

现代密码学允许以很小概率破解的方案仍然被认为是“安全的”。同时认为多项式运算是可行的，逆多项式概率也至关重要。如果一个方案对于一些多项式 p 能够以 1/p(n) 的概率进行破解，那么这个方案不安全。然而，如果一个方案对于每个多项式 p 被破解的可能性都小于 1/p(n)，那么是安全的。

定义：

> 如果对于每个多项式 p(·)，存在一个 N 对于任意整数 n > N，满足 f(n) < 1/p(n)，那么称这个函数破解的成功率为可忽略的（negligible）


一个技术上的优势是对于可忽略成功率函数的组合成的函数也是可忽略成功率的函数。比如，如果 negl1 和 negl2 是可忽略函数，那么 negl3 = negl1 + negl2 也是可忽略的

> 可忽略概率发生的事件不太可能会发生，在实际中是可忽略的。因此对于可忽略发生概率的加密方案进行破解不能算作破解
