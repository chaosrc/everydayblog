---
title: 联结表（一）
date: 2019-09-14
---


## 联结表（一）


联结（join）表是 SQL 中最强大的功能之一，很好的理解联结表及其语法是学习 SQL 极为重要的部分。



#### 关系表

关系表的设计就是把信息分解成多个表，一类数据一个表，各个表通过某些共同值互相关联，可以更有效、方便的处理数据



#### 联结

使用关系表将数据存储在多个表中后，如何使用一条 SELECT 语句就能检索出数据？答案是使用联结，联结是一种机制，用来在一条 SELECT 语句中关联表



#### 创建联结


创建联结表只需要指定需要联结的所有表以及它们的关联方式

输入

```sql
 SELECT vend_name, prod_name, prod_price
FROM Vendors, Products
WHERE Vendors.vend_id = Products.vend_id;
```

输出

```sql
Bears R Us|8 inch teddy bear|5.99
Bears R Us|12 inch teddy bear|8.99
Bears R Us|18 inch teddy bear|11.99
Doll House Inc.|Fish bean bag toy|3.49
Doll House Inc.|Bird bean bag toy|3.49
Doll House Inc.|Rabbit bean bag toy|3.49
Doll House Inc.|Raggedy Ann|4.99
Fun and Games|King doll|9.49
Fun and Games|Queen doll|9.49
```

上面的 SQL 语句中 FROM 子句列出了两个表： Vendors 和 Products，这是 SELECT 语句联结的两个表名，在 SELECT 语句中有三个列，vend_name 在 Vendors 表中，prod_name 和 prod_price 在 Products 表中，通过 WHERE 子句将两个表通过 vend_id 正确的联结	



#### WHERE 子句的重要性

上面的联结是通过 WHERE 子句进行过滤条件，只包含那些满足联结条件的行。没有 WHERE 子句的联结返回的结果为笛卡尔积，即第一个表中的每一行都会与第二个表中的每一行匹配

在使用联结是需要保证在所有的联结中都有 WHERE 子句，同时要保证 WHERE 子句的正确性



#### 内联结

前面使用的联结称为等值联结，它是基于两个表之间的相等测试，这种联结也称为内联结。对于这种联结也可以使用另一个语法，明确指定联结的类型

输入

```sql
SELECT vend_name, prod_name, prod_price
FROM Vendors INNER JOIN Products
ON Vendors.vend_id = Products.vend_id;
```

输出

```sql
Bears R Us|8 inch teddy bear|5.99
Bears R Us|12 inch teddy bear|8.99
Bears R Us|18 inch teddy bear|11.99
Doll House Inc.|Fish bean bag toy|3.49
Doll House Inc.|Bird bean bag toy|3.49
Doll House Inc.|Rabbit bean bag toy|3.49
Doll House Inc.|Raggedy Ann|4.99
Fun and Games|King doll|9.49
Fun and Games|Queen doll|9.49
```

上面的 SELECT 语句的 FROM 子句中明确指定了联结的类型为 INNER JOIN，与前面的 SQL 语句是等同的，同时联结条件使用 ON 子句而不是 WHERE 子句，ON 子句的条件与 WHERE 子句相同


#### 联结多个表

SQL 语句中不限制一条 SELECT 语句中联结表的数目。创建多个联结表的规则与两个表相同

输入

```sql
SELECT prod_name, vend_name, prod_price, quantity
FROM Products, vendors, OrderItems
WHERE Products.vend_id = Vendors.vend_id
AND Products.prod_id = OrderItems.prod_id
AND order_num = 20005
```

输出

```sql
8 inch teddy bear|Bears R Us|5.99|100
18 inch teddy bear|Bears R Us|11.99|100
```

上面的 SQL 语句检索了订单号为 20005 的物品。在 OrderItems 表中存储了订单信息，通过产品 id（prod_id），在 Products 表中关联到对应的产品，通过 Products 中的供应商 id（vend_id）在 Vendors 表中关联到供应商的记录。第三个关联条件 AND order_num = 20005 过滤订单号为 20005 的物品







SELECT cust_name, cust_contact
FROM Customers INNER JOIN Orders INNER JOIN OrderItems
ON Customers.cust_id = Orders.cust_id
AND Orders.order_num = OrderItems.order_num
AND OrderItems.prod_id = 'RGAN01';

