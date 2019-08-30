---
title: 数据检索（三）
date: 2019-08-29
---

## 数据检索（三）



#### 限制检索结果

SELECT 语句返回指定表中所有匹配的行，如果只想返回第一行或者一定数量的行，在不同数据库中这一 SQL 实现并不相同

如果使用 SQL Server 和 Access，可以通过 TOP 关键字来限制最多返回多少行

```sql
SELECT TOP 5 prod_name
FROM Products;
```

上面的代码使用 SELECT TOP 5 语句限制只检索前 5 行数据

如果使用 Oracle，需要基于 ROWNUM（行计数器）来计算行，比如
```sql
SELECT prod_name 
FROM Products
WHERE ROWNUM <= 5;
```

如果使用 MySQL、PostgreSQL 或者 SQLite，需要使用 LIMIT 字句

```sql
SELECT prod_name
FROM  Products
LIMIT 5;
```

上面的代码使用 SELECT 语句来检索单独的一列数据。LIMIT 5 表示返回的数据不超过 5 行。

如果要指定从哪儿开始检索可以使用 OFFSET

输入
```sql
SELECT prod_name
FROM Products
LIMIT 5 OFFSET 5;
```
输出

```sql
Rabbit bean bag toy
Raggedy Ann
King doll
Queen doll
```

LIMIT 5 OFFSET 5 表示检索从第 5 行开始的 5 行数据。LIMIT 指定返回的行数，OFFSET 指定从哪儿开始。



####  使用注释

行内注释

```sql
SELECT prod_name -- 这是注释
FROM Products;
```
使用 -- 嵌入行内，-- 之后的文本都是注释


多行注释

```sql
/* SELECT prod_name, vend_id
FROM Products; */
SELECT prod_name 
FROM Products;
```
注释从 /* 开始，到 */ 结束，/* 和 */ 之间的任何内容都是注释。这种方式长用于给代码加注释。

上面的代码第一个不会执行因为它已经被注释







