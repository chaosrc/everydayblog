---
title: 集聚函数（一）
date: 2019-09-08
---


## 集聚函数（一）



很多时候我们需要汇总数据而不是检索数据，SQL 语句中提供了一些专门的函数来进行数据汇总

常见的数据汇总的案例：
- 确定表中的行数
- 获得某些行的和
- 找出表列的最大值、最小值、平均值等


上面的案例都是汇总数据，而不需要检索数据，如果返回实际表中的数据就浪费时间和资源


常用的集聚函数

|函数|说明|
|------|------|
| AVG()  | 返回列的平均值|
| COUNT() | 返回行数|
| MAX()  | 返回列的最大只能 |
| MIN()  | 返回列的最小值|
| SUM()  | 返回列的和 |



#### AVG 函数

AVG() 函数通过对表中行数计数并计算列之和，求该列的平均值。使用 AVG() 函数可以返回所有列或特定列的平均值

输入

```sql
SELECT AVG(prod_price) AS avg_price
FROM Products;
```

输出

```sql
6.82333333333333
```

上面的 SELECT 语句返回值 avg_price 是 Products 表中所有产品的平均价格

AVG() 函数也可以返回特定列或行的平均值

输入

```sql
SELECT AVG(prod_price) AS avg_price
FROM Products
WHERE vend_id = 'DLL01';
```
输出

```sql
3.865
```
这条 SQL 语句中使用 WHERE 子句过滤出了 vend_id 为 DLL01 的产品，因此 AVG() 函数计算出来的结果也只是所有 vend_id 为 DLL01 的产品的平均值



#### COUNT() 函数

使用 COUNT() 函数可以计算表中的行数或者符号特定条件的行数

输入
```sql
 SELECT COUNT(*) AS num
 FROM Customers;
```
输出
```sql
5
```

上面的 SQL 使用 COUNT(*) 对所有行进行计数，返回结果为 5，一共有 5 条数据


下面对特定的行进行计数

输入

```sql
SELECT COUNT(cust_email) AS num
FROM Customers;
```

输出

```sql
3
```

上面的 SQL 语句中使用 COUNT(cust_email) 进行计数，只对 cust_email 有值的列进行计算，有 cust_email 值的行数为 3