---
title: 创建和操控表（一）
date: 2019-09-21 
---



## 创建和操控表（一）

SQL 不仅可以对表的数据进行操纵，还可以对数据库和表本身进行操作，包括表本身的创建和处理



#### 表创建基础

在 SQL 中可以使用 CREATE TABLE 来创建表。创建表是必须给出下列信息：

- 新表的名字，跟在 CREATE TABLE 之后
- 表列的名字和定义，用逗号分隔

下面创建 Products 表

输入

```sql
CREATE TABLE Products
(
    prod_id     CHAR(10)         NOT NULL,
    vend_id     CHAR(10)         NOT NULL,
    prod_name   CHAR(254)        NOT NULL,
    prod_price  DECIMAL(8,2)     NOT NULL,
    prod_desc   VARCHAR(1000)    NOT NULL
);
```

上面的 SQL 语句创建了一个 Products 表，表的所有列定义在圆括号内，列之间用逗号分隔，列名后面根列的数据类型




#### 使用 NULL 值

NULL 值就是没有值或者缺值，允许 NULL 值的列在插入数据时可以不给出该列的值，不允许 NULL 值的列在插入或者更新是该列必须有值

每个表要么是 NULL 列，要么是 NOT NULL 列，这种状态在创建表时定义

下面创建一个 Vendors 表

输入

```sql
CREATE TABLE Vendors
(
    ven_id        CHAR(10)     NOT NULL,
    vend_name     CHAR(50)     NOT NULL,
    vend_address  CHAR(50)             ,
    vend_city     CHAR(50)             ,
    vend_state    CHAR(5)              ,
    vend_zip      CHAR(10)             , 
    vend_country  CHAR(50)             
);
```

上面的语句创建了 Vendors 表，其中 ven_id 和 vend_name 是必须的，所以指定为 NOT NULL，其余的列 没有指定，默认为 NULL，可以为空值



#### 指定默认值

SQL 语句允许指定默认值，在插入行时如果没有给出值，则使用默认值，默认值在 CREATE TABLE 中用关键词 DEFAULT 指定

下面创建一个 OrderItem 表

输入
```sql
CREATE TABLE OrderItems
(
    order_num       INTEGER       NOT NULL,
    order_item      INTEGER       NOT NULL,
    prod_id         INTEGER       NOT NULL,
    quantity        INTEGER       NOT NULL    DEFAULT 1,
    item_price      DECIMAL(8,2)  NOT NULL   
);

```

上面的语句创建 OrderItems 表，其中 quantity 为订单中每个每个物品的数量，在这一列的描述中增加了 DEFAULT 1 来设置默认值为 1， 如果插入时没有给出值则数量为 1


默认值通常用于日期或时间戳，比如通过使用系统日期函数或变量将系统日期设置为默认日期，在不同的数据库中获取默认日期都有各自的方式，在 MySQL 中使用 CURRENT_DATE()， Oracle 中使用 SYSDATE，SQLite 中使用 date('now')

