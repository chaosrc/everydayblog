---
title: 组合查询（一）
date: 2019-09-17
---

## 组合查询（一）



#### 组合查询

大多数 SQL 查询语句都是使用单条 SELECT 语句来查询数据，但是 SQL 中也支持执行多个查询即多条 SELECT 语句，并且将结果作为一个查询集合返回，这样的查询被称为组合查询（compound query）


需要使用组合查询的情况：

- 在一个查询中从不同的表返回数据
- 对一个表进行多次查询，安照一个查询结果返回



#### 创建组合查询

使用 UNION 操作符可以组合多条 SQL 语句，并且返回将它们的结果组合成一个结果集

下面要要查询多个地区的顾客报表，先使用单条 SELECT 语句

输入

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI');
```

输出

```sql
Village Toys|John Smith|sales@villagetoys.com
Fun4All|Jim Jones|jjones@fun4all.com
The Toy Store|Kim Howard|
```

输入

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All';
```

输出

```sql
Fun4All|Jim Jones|jjones@fun4all.com
Fun4All|Denise L. Stephens|dstephens@fun4all.com
```

第一个 SELECT 语句查询了 'IL'、'IN'、'MI' 地区的顾客信息，第二条 SELECT 语句查询顾客 'Fun4All' 的信息



使用 UNION 组合两条语句

输入

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All';
```

输出

```sql
Fun4All|Denise L. Stephens|dstephens@fun4all.com
Fun4All|Jim Jones|jjones@fun4all.com
The Toy Store|Kim Howard|
Village Toys|John Smith|sales@villagetoys.com
```

这条 SQL 语句由前面的两条 SELECT 语句组成，使用 UNION 关键字分隔，输出结果组合成一个查询集合

这里使用多个 WHERE 子句也可以实现，对于较为复杂或者多个表查询 UNION 可能会更简单

输入

```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI')
OR cust_name = 'Fun4All';
```
