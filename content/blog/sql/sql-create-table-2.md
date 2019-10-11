---
title: 创建和操控表（二）
date: 2019-09-22
---

## 创建和操控表（二）



#### 更新表


使用 ALTER TABLE 可以更新表的定义，以下是变更表时需要考虑的事情：

- 理想情况下不要在表中包含数据时对其进行变更
- 所有数据库都允许给现有的表增加列，但是对所增加列的数据类型以及 NULL 和 DEFAULT 的使用有限制
- 很多数据库不允许删除或更改表中的列
- 多数数据库允许重命名表中的列
- 很多数据库限制对已经填有数据列的更改，而不限制对未填数据列的修改

使用 ALTER TABLE 更改表结构时，需要给出以下信息：
- 在 ALTER TABLE 后面给出表名，且该表必须存在
- 列出要做哪些修改



下面对 Vendors 表进行更改

输入
```sql
ALTER TABLE Vendors
ADD vend_phone CHAR(20);
```
上面的 SQL 语句对 Vendors 表增加了 vend_phone 列，数据类型为 CHAR



删除列 (并非对所有数据库都有效)
```sql
ALTER TABLE Vendors
DROP COLUMN vend_phone;
```

复杂的表结构变更一般需要手动删除过程，包括以下步骤：
- 使用新的列布局创建一个新表
- 使用 SELECT INTO 语句从旧表中复制数据到新表
- 检验包含所需数据的新表
- 重命名旧表
- 用原来旧表的名字重命名新表
- 根据需要重新创建触发器、存储过程、索引和外键

> 使用 ALTER TABLE 时要极其小心，应该在改动前做完整的备份



#### 删除表

使用 DROP TABLE 可以删除表，删除整个表而不是其内容

输入
```sql
DROP TABLE CustCopy;
```
上面的语句删除了 CustCopy 表。删除表没有确认，也不能撤销，执行这条语句将永久删除该表



#### 重命名表

每个数据库对表的重命名支持有所不同，没有严格的标准。MySQL、Oracle 和 PostgreSQL 使用 RENAME 语句

```sql
RENAME TABLE Vendors TO vendors
```

SQLite 中使用 ALTER TABLE 语句
```sql
ALTER TABLE Vendors
RENAME TO vendors
```





