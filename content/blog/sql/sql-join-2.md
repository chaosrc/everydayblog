---
title: 联结表（二）
date: 2019-09-15
---


## 联结表（二）

联结类型除了内联结或等值联结外，还有三种联结方式：自联结（self-join）、自然联结（natural join）和外联结（outer join）



#### 使用表别名

SQL 语句中除了可以给列名和计算字段取别名外，还可以对表名取别名。给表取别名主要原因有：

- 缩短 SQL 语句
- 允许在一条 SELECT 语句中多次使用相同的表


在 SQL 语句中对表使用别名

```sql
SELECT cust_name, cust_contact
FROM Customers AS C, Orders AS O, OrderItems AS OI
WHERE C.cust_id = O.cust_id
AND O.order_num = OI.order_num
AND OI.prod_id = 'RGAN01'
```

上面的 SQL 语句分别对三个表使用了别名




#### 自联结（self-join）

现在有一个 Customers 表存储了客户信息，假如要给与 Jim Jones 为同一公司的所有顾客发送信息，那么首先要查出 Jim Jones 所在的公司，然后找出在此公司工作的所有顾客。



先使用子查询语句实现

输入

```sql
SELECT cust_id, cust_name, cust_contact
FROM Customers
WHERE cust_name = (SELECT cust_name
                   FROM Customers
                   WHERE cust_contact = 'Jim Jones');
```

输出

```sql
1000000003|Fun4All|Jim Jones
1000000004|Fun4All|Denise L. Stephens
```

上面的 SQL 使用了子查询，检索出 Jim Jones 所在的公司 cust_name，然后外部擦洗通过 WHERE 子句过滤出在此公司的所有顾客




下面使用联结来实现同样的功能

输入

```sql
SELECT C1.cust_id, C1.cust_name, C1.cust_contact
FROM Customers AS C1, Customers C2
WHERE C1.cust_name = C2.cust_name
AND C2.cust_contact = 'Jim Jones';
```

输出

```sql
1000000003|Fun4All|Jim Jones
1000000004|Fun4All|Denise L. Stephens
```

上面的查询语句使用了两个相同的表 Customers ，为了避免歧义对表使用了别名，分别为 C1，C2，SELECT 语句中必须使用 有 C1 前缀的全名。WHERE 子句中先使用 cust_name 进行联结，然后对 cust_contact 进行过滤
