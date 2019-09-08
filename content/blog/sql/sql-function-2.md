---
title: 使用函数处理数据（二）
date: 2019-07-07
---


## 使用函数处理数据（二）



#### 时间和日历处理函数

每个数据库在表中存储日期和时间类型的数据都有自己的特殊形式，日期和时间值以特殊的格式储存，以便能够快速有效的排序和过滤，并且可以节省物理存储空间

以下的 SQL 是在 SQL Server 中检索 Orders 表中 2012 年所有的订单

输入

```sql
SELECT order_num 
FROM Orders
WHERE DATEPART(yy, order_date) = 2002
```

输出

```sql
20005
20006
20007
20008
20009
```

上面的 SQL 语句使用了 DATEPART() 函数返回日期的某一部分。DATEPART() 函数有两个参数，它们分别是日期值中返回的部分和日期值。上面 SQL 中 DATEPART() 返回 order_date 中的年份,然后与 2012 进行比较，从而过滤出 2012 年的所有行。


同样的功能在 PostgreSQL 是使用 DATE_PAERT 函数
```sql
SELECT order_name
FROM Orders
WHERE DATA_PART('year', order_date = 2012
```

在 MySQL 和 MarialDN 中使用 YEAR() 函数提取日期中的年份

```sql
SELECT order_num 
FROM Orders
WHERE YAER(order_date) = 2002
```

在 SQLite 中使用 strftime(),获取年份

输入

```sql
SELECT 0rder_name
FROM Orders
WHERE strftime('%Y', order_date) = '2012'
```



#### 数值处理函数

数值处理函数一般用来计算数值的代数，三角或几何运算。数值处理函数在大部分数据库是相同的，是最统一最一致的

常用的数值处理函数

|函数|说明|
|------|------|
|ABS()  | 返回绝对值|
|COS()  | 返回余玄值|
|EXP()  | 返回指数值|
|PI()   | 返回圆周率|
|SIN()  | 返回正玄值|
|SQRT() | 返回平方根|
|TAN()  | 返回正切值|


> 数值处理函数的使用方式，和前面的一样



#### 总结

数据处理函数在数据过滤中非常有用，但是各个数据库的实现可能不一致