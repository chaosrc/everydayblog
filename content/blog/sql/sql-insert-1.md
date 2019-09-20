---
title: 数据插入 
date: 2019-09-19
---

## 数据插入


在 SQL 中使用 INSERT 将行插入或添加到数据库的表中，插入数据的几种方式：

- 插入完整的行
- 插入行的一部分
- 插入某些查询的结果



#### 插入完整的行

输入
```sql
INSERT INTO Customers 
VALUES ('100000006', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);
```

上面的 SQL 语句将一条新的顾客数据插入到了 Customers 表中，在 VALUE 中列出每一列的数据，而且必须每一列提供一个值，如果没有值应该输入 NULL 值。每一列必须以它们在表中定义的次序填充

使用这种方式语法很简单，但是高度依赖表中列的定义次序，不能保证每一次表结构改变后保持相同的次序，因此这种方式很不安全

下面使用更加安全的方式

输入
```sql
INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email)
VALUES ('100000007', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);
```
上面的语句与前一个 INSERT 语句的作用完全相同，但是在表名后面的括号里明确指出了列名，在插入行时将 VALUES 列表中的值填入对应的列中，列名的顺序不一定要是表中出现的顺序，即使表结构改变，INSERT 语句仍然能够正常工作



#### 插入部分行

在使用 INSERT 时指定列名的另一个好处是可以省略不需要插入值的列

输入
```sql
INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
VALUES ('100000008', 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA');
```

上面的 INSERT 语句中省略了 cust_contact 和 cust_email 两列

省略列需要满足以下条件之一：

- 该列定义为允许 NULL 值
- 在表定义中给出了默认值



#### 插入检索出的数据

INSERT 语句还存在另一种形式，可以利用它将 SELECT 语句的结果插入表中，即 INSERT SELECT，由一条 INSERT 语句和 SELECT 语句组成

输入
```sql
INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country)
SELECT cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country 
FROM CustNew;
```
上面的 INSERT SELECT 从 CustNew 中所有数据导入 Customers 表中，SELECT 中对应于 Customers 中的每一列，插入的行数处决于 SELECT 语句检索出的行数



#### 从一个表复制到另一个表

INSERT INTO 可以将数据复制到一个以及存在的表中，而SELECT INTO 语句可以将一个表的内容复制到一个全新的表中

输入
```sql
SELECT * 
INTO CustCopy
FROM Customers;
```
这条 SELECT 语句创建一个名为 CustCopy 的新表，并将 Customers 表的内容复制到新的表中。如果只想复制部分列可以明确指出列名，而不是使用通配符 *

在 MySQL、SQLite 以及 PostgreSQL 等数据库中使用的语法稍有不同：

输入
```sql
CREATE TABLE CustCopy AS 
SELECT * FROM Customers;
```

使用 SELECT INTO 需要知道的一些事情：
- 可以使用任何 SELECT 选项和子句，包括 WHERE 和 GROUP BY
- 可以利用联结从多个表插入数据
- 不管从多少个表中检索数据，只能插入一个表中

