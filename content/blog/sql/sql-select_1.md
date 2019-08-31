---
title: 数据检索（一）
date: 2019-08-27
# description:　使用 SELECT 语句进行数据检索
---

## 数据检索（一）



使用 SELECT 语句检索一个或多个数据列



#### SELECT 语句

SQL 语句是由简单英语单词构成，这些单词被称为关键词，每一个 SQL 语句都是由一个或多个关键词构成。

SELECT 语句是 SQL 中最常用的语句它的作用是在一个或多个表中检索信息

使用 SELECT 检索数据必须至少给出两条信息：想选择什么以及从什么地方选择




#### 检索单个列

输入 SQL 语句

```sql
SELECT prod_name FROM Products;
```

分析 SQL 语句

上面使用 SELECT 语句从 Products 表中检索一个名为 prod_name 的列。SELECT 后面跟的是列名，FROM 后面是要检索的表名。

输出结果

```sql
prod_name
-------------------
Fish bean bag toy
Bird bean bag toy
Rabbit bean bag toy
8 inch teddy bear
12 inch teddy bear
```

注意：

> SQL 语句必须以分号（;）分隔。
> SQL 语句不区分大小写，因此 SELECT 和 select 是相同的，但是一般习惯于 SQL 关键词使用大写，而对列名小写
> SQL 语句执行时所有的空格都会被忽略，所以 SQL 　语句写成单行和多行是一样的。
>
> SELECT prod_name FROM Products;
>
> SELECT
> prod_name
> FROM
> Products;
>
> 上面的两种写法是一样的



#### 检索多个列

检索多个列时，任然使用相同的 SELECT 语句，不同的时在 SELECT 关键词后面给出多个列名，列名之间用逗号分隔

输入

```sql
SELECT prod_id, prod_name, prod_price
FROM Products
```

分析

使用 SELECT 的语句从表 Products 中选择数据，指定了三个列名并用逗号分隔

输出

```sql
prod_id prod_name prod_price
--------- -------------------- ----------
BNBG01 Fish bean bag toy 3.4900
BNBG02 Bird bean bag toy 3.4900
BNBG03 Rabbit bean bag toy 3.4900
BR01 8 inch teddy bear 5.9900
```

