---
title: 数据检索（二）
date: 2019-08-27
# description:　使用 SELECT 语句进行数据检索
---


## 数据检索（二）




#### 检索所有列

除了检索所需要的列， SELECT 语句还可以通过 * 通配符检索所有的列

输入
```sql
SELECT * FROM Products;
```

分析

> 如果使用通配符 * ， 则返回表中的所有列
> 列的顺序一般是列在表中出现物理顺序
> 尽量少使用通配符 * ，因为检索不需要的列通常会降低检索和应用程序的性能


输出
```sql
BR01|BRS01|8 inch teddy bear|5.99|8 inch teddy bear, comes with cap and jacket
BR02|BRS01|12 inch teddy bear|8.99|12 inch teddy bear, comes with cap and jacket
BR03|BRS01|18 inch teddy bear|11.99|18 inch teddy bear, comes with cap and jacket
...
```



#### 检索不同的值
SELECT 语句会返回所有匹配的信息，但是有的时候并不希望每个值每次都出现。比如想检索 products 表中所有产品供应商的 ID

输入

```sql
SELECT vend_id FROM Products;
```

输出
```sql
BRS01
BRS01
BRS01
DLL01
DLL01
DLL01
DLL01
FNG01
FNG01
```

上面的 SELECT 语句检索出了 9 条数据，但是有部分重复的值，实际产品供应商只有三个。如果要去掉重复的值，每个供应商只保留一条数据，那么可以使用 DISDINCT 关键词

输入
```sql
SELECT DISTINCT vend_id FROM Products;
```

分析

使用 DISTINCT vend_id 告诉数据库只返回具有唯一性的 vend_id

输出

```sql
BRS01
DLL01
FNG01
```

> DISTINCT 关键词会作用于所有列，比如 SELECT DISTINCT vend_id, prod_price, 因为指定的两列不完全一样所以所有行都会检索出来

不使用 DISTINCT 
```sql
SELECT vend_id, prod_price FROM Products;
BRS01|5.99
BRS01|8.99
BRS01|11.99
DLL01|3.49
DLL01|3.49
DLL01|3.49
DLL01|4.99
FNG01|9.49
FNG01|9.49
```
使用 DISTINCT
```sql
SELECT DISTINCT vend_id, prod_price FROM Products;
BRS01|5.99
BRS01|8.99
BRS01|11.99
DLL01|3.49
DLL01|4.99
FNG01|9.49
```

使用了 DISTINCT 关键词会去掉 vend_id 和 prod_price 完全相同的行





