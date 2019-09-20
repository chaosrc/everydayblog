---
title: 更新和删除数据
date: 2019-09-20
---

## 更新和删除数据



#### 更新数据

更新表的数据可以用 UPDATE 语句。UPDATE 语句有两种使用方式：

- 更新表中特定的行
- 更新表中所有行

UPDATE 语句由三部分组成：
- 需要更新的表
- 列名和它的新值
- 需要更新哪些行的过滤条件

输入
```sql
UPDATE Customers
SET cust_email = 'abc@qq.com'
WHERE cust_id = '1000000005'
```

上面的 UPDATE 语句对 Customers 表中 cust_id 为 1000000005 的顾客更新 Email 地址

UPDATE 语句通过 WHERE 子句来告诉数据库需要更新哪些行，**如果没有 WHERE 子句则会更新所有行**



更新多个列

输入
```sql
UPDATE Customers
set cust_contact = 'Sam Roberts',
    cust_email = 'san@toyland.com'
WHERE cust_id = '100000006';
```

更新多列时只需使用一条 SET 命令，每一个 “列=值” 之间用逗号分隔



#### 删除数据

从表中删除数据使用 DELETE 语句。同样 DELETE 语句有两种使用方式：
- 从表中删除特定的行
- 从表中删除所有行

从 Customers 表中删除一行

输入
```sql
DELETE FROM Customers
WHERE cust_id = '100000006';
```
上面的 SQL 语句删除了 Customers 表中 cust_id 为 100000006 的行，DELETE FROM 后面为需要删除数据的表名，WHERE 子句过滤要删掉的行，如果省略 WHERE 子句将会删除所有行

DELETE 语句从表中删除行，甚至所有行，但是 DELETE 语句不删除表本身



#### 删除和更新数据的原则


- 除非确实想要删除或更新所有数据，否则一定要带上 WHERE 子句
- 保证每个表都有主键
- 在使用 UPDATE 或 DELETE 语句之前，先用 SELECT 语句进行测试，保证 WHERE 子句是正确的
- 如果数据库支持添加对不带 WHERE 子句的更新或删除语句进行约束，那么应该尽可能添加约束


