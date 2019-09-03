---
title: 数据过滤（三）
date: 2019-09-02
---

## 数据过滤（三）



#### IN 操作符

IN 操作符用来指定特定的条件范围，范围中的每个条件都可以进行匹配。IN 取一组由逗号分隔，括在圆括号中的合法值。

输入

![](https://s2.ax1x.com/2019/09/02/niOam8.jpg)


输出

![SmartSelect_20190902-082604_Termux](https://s2.ax1x.com/2019/09/02/niOBkQ.jpg)


上面的 SELECT 语句检索由供应商 DLL01 和 BRS01 制造的所有产品。IN 操作符中的值用逗号分隔且必须在圆括号内。


其实使用 OR 操作符也能到达相同的效果

输入
![](https://s2.ax1x.com/2019/09/02/niOJSI.jpg)

输出
![](https://s2.ax1x.com/2019/09/02/niOt6P.jpg)

使用 IN 操作符的优点：

- 在有很多选项时 IN 操作符更加清楚直观
- 在与其他 AND 和 OR 组合使用 IN 时求值顺序更容易管理
- IN 操作符一般比一组 OR 操作符执行得更快
- IN 语句中还可以包含其他的 SELECT 语句，能够更动态 
的建立 WHERE 子句




#### NOT 操作符

WHERE 子句中的 NOT 操作符有且只有一个功能，那就是否定它后面所跟的任何条件。

输入

![](https://s2.ax1x.com/2019/09/02/niOd0S.jpg)

输出

![](https://s2.ax1x.com/2019/09/02/niODYj.jpg)


上面的 SQL 语句中 NOT 否定了它后面的条件，检索出所有 vend_id 不是 DLL01 的所有产品



上面的语句也可以使用 != 来实现

输入

![](https://s2.ax1x.com/2019/09/02/niO8fA.jpg)

输出

![](https://s2.ax1x.com/2019/09/02/niOwTg.jpg)



虽然 != 在这个语句中也同样能满足需求，但是在更加复杂的语句中 NOT 是非常有用的，比如 NOT 与 IN 组合，可以非常简单的找出与 IN 中条件列表不匹配的行

输入

![](https://s2.ax1x.com/2019/09/02/niOYlt.jpg)

输出

![](https://s2.ax1x.com/2019/09/02/niONOf.jpg)
