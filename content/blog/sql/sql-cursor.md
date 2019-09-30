---
title: 使用游标
date: 2019-09-28
---

## 使用游标



#### 游标

SQL 检索操作返回一组被称为结果集的行，这些行都是与 SQL 语句相匹配的行。简单地使用 SELECT 语句，无法得到第一行、下一行或前十行

使用游标可以在检索出来的行中前进后退一行或多行。游标是一个存储在数据库服务器上的数据库查询，是 SELECT 语句检索的结果集，存储了游标后，可以根据需要滚动或浏览其中的数据


游标的一些特性
- 能够标记为只读，使数据能读取但不能更新和删除
- 能控制可以执行的定向操作（向前、向后、绝对位置、相对位置等）
- 能够标记某些列为可编辑，某些为不可编辑
- 规定范围，控制特定的请求或所有请求可以访问
- 指示数据库对检索的数据进行复制，使游标在打开和访问期间数据不会变化



#### 使用游标

使用游标的步骤

- 在使用游标前，必须声明它，这时还没有检索数据，只是定义要使用的 SELECT 语句和游标选项
- 一旦声明就必要打开游标以供使用，这个过程使用前面定义的 SELECT 语句将数据检索出来

- 对于填有数据的游标，根据需要取出各行
- 在结束游标使用时，必须关闭游标

游标声明后可以根据需要频繁地打开和关闭游标



#### 创建游标


使用 DECLARE 语句创建游标，这条语句在不同的数据库中有所不同。DECLARE 命名游标，并定义相应的 SELECT 语句，根据需要带WHERE 子句或其他子句


下面创建一个游标来检索没有电子邮件地址的所有顾客

```sql
DECLARE CustCursor CURSOR
FOR 
SELECT cust_name FROM Customers
WHERE cust_email IS NULL;

```
使用 DECLARE 定义了一个游标 CustCursor。接下来就可以使用它了



#### 使用游标

使用 OPEN CURSOR 语句打开游标

```sql
OPEN CustCursor;
```

使用 FETCH 语句访问数据，FETCH 指出要检索哪些行，从何处检索以及存放在何处

```sql
FETCH cust_name INTO custName;
```

FETCH 语句检索一行数据并保持在 变量 custName 中


#### 关闭游标

```sql
CLOSE CustCursor;
```



#### 完整的示例


创建存储过程
```sql
DELIMITER $$
CREATE PROCEDURE execCursor( INOUT name varchar(100) )
BEGIN
-- 定义游标
DECLARE custName varchar(100) DEFAULT "";
DECLARE CustCursor CURSOR
FOR 
SELECT cust_name FROM Customers
WHERE cust_email IS NULL;
-- 打开游标
OPEN CustCursor;
-- 使用游标
FETCH CustCursor INTO custName;
SET name = custName;
-- 关闭游标
CLOSE CustCursor;

END$$
```

使用游标

```sql
SET @name = "";
CALL execCursor(@name);
SELECT @name;
```

输出结果

```sql
mysql> SET @name = "";
Query OK, 0 rows affected (0.00 sec)

mysql> CALL execCursor(@name);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @name;
+------------+
| @name      |
+------------+
| Kids Place |
+------------+
1 row in set (0.00 sec)

mysql> 
```
