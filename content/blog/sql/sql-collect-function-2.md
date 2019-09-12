---
title: 集聚函数（二）
date: 2019-09-09
---


## 集聚函数（二）



#### MAX() 函数

MAX() 函数返回指定列中的最大值。MAX() 要求指定列名

输入

```sql
SELECT MAX(prod_price) AS max_price
FROM Products;
```

输出

```sql
11.99
```

上面的 SQL 语句中方 MAX(prod_price) 返回表中物品的最大价格

> MAX() 函数会忽略值为 NULL 的行



#### MIN() 函数

MIN() 函数与 MAX() 函数功能相反，返回指定列的最小值

输入

```sql
SELECT MIN(prod_price) AS min_price
FROM Products;
```

输出

```sql
3.49
```

> MIN() 函数会忽略值为 NULL 的行



#### SUM() 函数

SUM() 函数计算指定列值的总和

输入

```sql
SELECT SUM(quantity) AS sum_quantity
FROM OrderItems
WHERE order_num = 20005;
```

输出

```sql
200
```

上面的 SQL 语句 SUM(quantity) 计算订单中所有数量之和，并且使用 WHERE 子句限定订单号


SUM() 函数也可以对计算值求和

输入

```sql
SELECT SUM(item_price * quantity) AS total_price
FROM OrderItems
WHERE order_num = 20005;
```

输出

```sqj
1648.0
```

函数 SUM(item_price * quantity) 计算数量与单价的乘积 返回订单中所有物品价钱之和

> SUM() 函数忽略值为 NULL 的行

