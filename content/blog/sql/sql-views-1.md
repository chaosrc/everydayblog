---
title: 使用视图（一）
date: 2019-09-23
---

## 使用视图（一）



### 视图

视图是虚拟的表，与包含数据的表不一样，视图只包含使用时动态检索数据的查询

下面的 SQL 语句从三个表中检索数据

输入
```sql
SELECT cust_nam, cust_contact
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id 
AND OrderItems.order_num = Orders.order_num
AND prod_id = 'RGAN01';
```
上面的语句通过关联三个表检索购买某种产品的顾客。任何需要这个数据的人都需要理解表的结构及其关联关系，在检索其他产品或多个产品的相同数据时，必须修改 WHERE 子句

如果可以将整个查询包装成为一个名为 ProductCustomers 的虚拟表，那么就可以很容易检索出相同的数据

输入
```sql
SELECT cust_name, cust_contact
FROM ProductCustomers
WHERE prod_id = 'RGAN01';
```
这就是视图的作用，ProductCustomers 是一个视图，它不包含任何列或者行，包含的是一个查询




#### 为什么使用视图

使用视图的一些常用应用场景

- 重用 SQL 语句
- 简化 SQL 语句操作
- 使用表的一部分而不是所有整个表
- 保护数据，可以授予用户访问表时的特定权限，而不是整个表
- 更改数据格式和表示，视图可以返回与底层表格式不同的数据


创建视图后，可以用与表基本相同的方式使用，比如 SELECT，过滤、排序以及联结其他视图或表

视图仅仅是用来查看存储在别处表的数据，本身不包含数据，因此返回的数据是从其他表中检索出来的

> 如果使用多个联结和过滤创建复杂的视图或者嵌套视图，可能会对性能有很大的影响



#### 视图的规则和限制

以下是视图创建和使用的一些常见的规则和限制

- 视图必须唯一命名，不能与表相同
- 对于可创建的视图数目没有限制
- 视图可以嵌套，可以利用其他视图中检索出的数据来构造视图（嵌套视图可能会严重降低查询性能，在使用前最好做性能测试）
- 许多数据库禁止在视图查询中使用 ORDER BY 子句
- 有些数据库要对返回的所有列进行命名，如果是计算字段则需要使用别名
- 视图不能索引，也不能有关联的触发器或默认值
- 有些数据库把视图做为只读查询，不能将数据写回底层表

不同的数据库对视图有不同的规则，在使用前需要查看相应的文档



#### 创建视图

视图使用 CREATE VIEW 语句来创建，与 CREATE TABLE 一样， CREATE VIEW 只能创建不存在的视图

最常见的视图应用是隐藏复杂的 SQL，比如：

输入
```sql
CREATE VIEW ProductCustomers AS
SELECT cust_name, cust_contact, prod_id
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id 
AND OrderItems.order_num = Orders.order_num;
```

这条语句创建了一个 ProductCustomers 视图，联结了三个表。

通过这个视图来检索数据

输入
```sql
SELECT cust_name, cust_contact
FROM ProductCustomers
WHERE prod_id = 'RGAN01';
```

输出
```sql
cust_name   cust_contact      
----------  ------------------
Fun4All     Denise L. Stephens
The Toy St  Kim Howard
```

通过 WHERE 子句检索视图中的特定数据，可以看出视图极大的简化了复杂 SQL 语句的使用，可以一次性编写基础的 SQL，然后根据需要多次使用




