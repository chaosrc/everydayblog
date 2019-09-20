---
title: 组合查询（二）
date: 2019-09-18
---


## 组合查询（二）



#### UNION 规则

UNION 使用起来很简单，但是需要注意以下规则

 - UNION 必须由两条或两条以上的 SELECT 语句组成，语句之间使用关键字 UNION 分隔，比如有4条 SELECT，则需要3个 UNION 关键字 
 - UNION 中的每个查询必须包含相同的列、表达式或聚集函数
 - 列的数据类型必须兼容，类型不必完全相同，但必须是数据库可以隐含转换的类型



#### 包含或取消重复的行

UNION 从查询结果集中自动去除了重复的行，如果需要返回所有匹配的行可以使用 UNION ALL


使用 UNION

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


使用 UNION ALL

输入
```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION ALL
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All';
```

输出
```sql
Village Toys|John Smith|sales@villagetoys.com
Fun4All|Jim Jones|jjones@fun4all.com
The Toy Store|Kim Howard|
Fun4All|Jim Jones|jjones@fun4all.com
Fun4All|Denise L. Stephens|dstephens@fun4all.com
```

可以看到在使用 UNION ALL 时 `Fun4All|Jim Jones|jjones@fun4all.com` 行出现了两次



#### 对组合结果排序

在使用 UNION 组合查询时，如果要进行排序，只能使用一条 ORDER BY 语句，并且必须位于最后一条 SELECT 语句之后


输入
```sql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION 
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All'
ORDER BY cust_name, cust_contact;
```

输出
```sql
Fun4All|Denise L. Stephens|dstephens@fun4all.com
Fun4All|Jim Jones|jjones@fun4all.com
The Toy Store|Kim Howard|
Village Toys|John Smith|sales@villagetoys.com
```

上面的 SQL 语句中在 UNION 的最后一条 SELECT 语句使用了 ORDER BY 子句，虽然只是写在了最后一条 SELECT 语句中，但是是对所有结果的排序


