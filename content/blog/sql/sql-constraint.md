---
title: 使用约束 
date: 2019-09-29
---

## 使用约束 



####  约束



关系数据库存储分解为多个表的数据，每个表存储相应的数据，利用键来建立一个表到另一个表的引用。

正确地进行关系数据库设计，需要一种方法保证只在表中插入合法数据。

数据库通过在表上施加约束来实施引用完整性。大多数约束是在表定义中定义的



#### 主键

主键是一种特殊的约束，用来保证一列或者一组列中的值是唯一的而且用不改动，表中的一列的值唯一表示表中的每一行。如果没有主键，要安全的 UPDATE 或 DELETE 特定行而不影响其他行会非常困难

做为主键的列需要满足以下条件：
- 任意两行的主键值都不一样
- 每行都具有一个主键值（即列中不允许 NULL 值）
- 包含主键值的列从不修改或更新
- 主键值不能重用，如果在表中删除某一行，其主键值不分配给新行

创建主键
```sql
CREATE TABLE Vendors (
    vend_id    CHAR(10) NOT NULL PRIMARY KEY,
    vend_name  CHAR(50) NOT NULL
);
```
上面的语句中创建了表 Vendors ，并给 vend_id 添加了关键词 PRIMARY KEY，使其成为主键



#### 外键

外键是表中的一列，其值必须是另一张表的主键。外键是保证引用完整性极其重要的部分

定义外键

```sql
CREATE TABLE Orders
(
    order_num    INTEGER   NOT NULL PRIMARY KEY,
    order_date   DATETIME  NOT NULL,
    cust_id      CHAR(10)  NOT NULL REFERENCES Customers(cust_id)
);
```

上面的表定义中使用了 REFERENCES 关键词来定义 cust_id 中的任何值都必须是 Customers 表 cust_id 中的值

外键的另一个作用是在定义外键后，不允许删除在另一个表中具有关联的行



#### 唯一约束

唯一约束用来保证一列（或一组列）中的数据是唯一的，它们类似与主键，但是有以下重要的区别

- 表可包含多个唯一约束，但是只允许一个主键
- 唯一约束列可以包含 NULL 值
- 唯一约束列可以修改或更新
- 唯一约束列的值可以重复使用
- 唯一约束列不能用来定义外键

唯一约束使用 UNIQUE 关键词定义

```sql
CREATE TABLE Employee (
    id     CHAR(10)   NOT NULL  PRIMARY KEY,
    name   CHAR(50)   NOT NULL,
    phone  CHAR(11)   UNIQUE
);
```
上面的表中使用 UNIQUE 关键词将 phone 定义为唯一约束字段



#### 检查约束

检查约束用来保证一列（或一组列）中的数据满足一组指定的条件。检查约束的用途有以下几点：
- 检查最大值或最小值，比如防止 0 个物品的订单
- 指定范围，比如保证发货日期大于等于今天的日期
- 只允许·特定的值，比如性别字段只允许 M 或 F

输入
```sql
CREATE TABLE OrderItems
(
    order_num     INTEGER    NOT NULL,
    order_item    INTEGER    NOT NULL,
    quantity      INTEGER    NOT NULL CHECK(quantity > 0)
);
```
使用 CHECK 约束，在插入或更新任何行时都会进行检查，保证 quantity 大于 0

```sql
mysql> INSERT INTO OrderItems(order_num, order_item, quantity) VALUES('2231414', 2, 0);                                                                   
ERROR 3819 (HY000): Check constraint 'OrderItems_chk_1' is violated.
mysql> INSERT INTO OrderItems(order_num, order_item, quantity) VALUES('2231414', 2, 1);
Query OK, 1 row affected (0.01 sec)
```