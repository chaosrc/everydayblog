---
title: 联结表（三）
date: 2019-09-16
---

## 联结表（三）



#### 自然联结

无论何时对表进行联结，应该至少有一列不止出现在一个表中（被联结的列）。标准的联结返回所有的数据，相同的列可能出现多次。而自热联结排除多次出现，使每一列只返回一次




#### 外联结

许多联结将一个表中的行与另一个表的行相关联，但是有时候需要包含没有关联的行。比如要对每个顾客的订单进行计数，并且包括那些没有下单的顾客，那么需要在订单表中关联表中没有的顾客，这种联结称为**外联结**。


首先使用内联结，检索所有顾客及其订单

输出

```sql
SELECT C.cust_id, O.order_num
FROM Customers AS C INNER JOIN Orders AS O
ON O.cust_id = C.cust_id;
```

输入

```sql
1000000001|20005
1000000003|20006
1000000004|20007
1000000005|20008
1000000001|20009
```

再使用外联结，检索包括没有下单的顾客在内的所有顾客

输入

```sql
SELECT C.cust_id, O.order_num
FROM Customers AS C LEFT OUTER JOIN Orders AS O
ON C.cust_id = O.cust_id;
```

输出

```sql
1000000001|20005
1000000001|20009
1000000002|
1000000003|20006
1000000004|20007
1000000005|20008
```
与内联结语法类似，使用 OUTER JOIN 来指定联结类型，与内联结不同的是，外联结还包括没有关联的行。在使用 OUTER JOIN 是必须使用 RIGHT 或 LEFT关键词指定包括所有行的表（RIGHT指 OUTER JOIN 右边的表，LEFT 指 OUTER JOIN 左边的表），下图展示了内联结和外联结的关系

![](https://docs.trifacta.com/download/attachments/123830435/JoinVennDiagram.png?version=1&modificationDate=1532989599340&api=v2)


外联结还有一种全外联结（FULL OUTER JOIN）如上图所示，它检索关联的行以及两个表中所有为关联的行，部分数据库并不支持这种全外联结

> 有些数据库中 LEFT OUTER JOIN 和 RIGHT OUTER JOIN，也可以写做 LEFT JOIN 和 RIGHT JOIN



#### 使用带有聚集函数的联结

在联结表中也可以使用聚集函数，比如检索所有顾客以其订单数

输入

```sql
SELECT C.cust_id, COUNT(O.order_num) AS num
FROM Customers AS C INNER JOIN Orders AS O
ON C.cust_id = O.cust_id
GROUP BY C.cust_id;
```

输出

```sql
1000000001|2
1000000003|1
1000000004|1
1000000005|1
```

使用 INNER JOIN 联结 Customers 和 Orders 表，对 cust_id 进行分组，聚集函数 COUNT() 计算每个顾客的订单数


使用外联结进行计算

输入

```sql
 SELECT C.cust_id, COUNT(O.order_num) AS num
 FROM Customers AS C LEFT OUTER JOIN Orders AS O
 ON C.cust_id = O.cust_id
 GROUP BY C.cust_id;

```

输出

```sql
1000000001|2
1000000002|0
1000000003|1
1000000004|1
1000000005|1
```

使用左外部联结包含了没有下单的顾客，其订单数为 0




