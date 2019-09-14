---
title: 使用子查询
date: 2019-09-13
---


## 使用子查询 


在 SQL 语句中允许在查询语句中嵌套其他的查询语句，即子查询（subquery）



#### 利用子查询进行过滤

现在存在三个表，Orders 表储存订单编号、客户 ID、订单日期，OrderItems 表储存订单物品的相关信息，Customer 表中储存客户信息。如果要列出订购物品 RGAN01 的所有顾客，需要进行以下步骤：

- 检索包含 RGAN01 的所有订单
- 根据上一步订单编号检索所有的顾客 ID
- 根据顾客 ID 检索所有顾客信息

每一条都可以是一个 SQL 语句，将上一条的结果应用与下一条 SQL 语句



第一步在 OrderItems 表中检索产品为 RGAN01 的订单

输入

```sql
SELECT order_num
FROM OrderItems
WHERE prod_id = 'RGAN01';
```
输出

```sql
20007
20008
```



第二步根据订单号在 Orders 表中检索检索顾客 ID

输入

```sql
SELECT cust_id
FROM Orders
WHERE order_num IN (20007, 20008);
```

输出

```sql
1000000004
1000000005
```



第三步根据顾客 ID 在 Customers 表中检索顾客信息

输入

```sql
SELECT cust_name, cust_contact
FROM Customers
WHERE cust_id IN (1000000004, 1000000005);
```
输出

```sql
Fun4All|Denise L. Stephens
The Toy Store|Kim Howard
```



通过子查询将三个 SQL 语句合成一个

输入
```sql
SELECT cust_name, cust_contact
FROM Customers
WHERE cust_id IN ( SELECT cust_id
                   FROM Orders
                   WHERE order_num IN ( SELECT order_num
                                        FROM OrderItems
                                        WHERE prod_id = 'RGAN01'));
```
输出

```sql
Fun4All|Denise L. Stephens
The Toy Store|Kim Howard
```

上面的 SQL 语句有两条子查询依次从内向外执行，效果等同于前面的三条 SQL 语句


> 子查询只能查询单个列，检索多个列会报错
