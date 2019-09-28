---
title: 管理事务处理
date: 2019-09-28
---


## 管理事务处理




#### 事务处理

使用事务处理（tansaction processing），通过确保成批的 SQL 操作要么完全执行，要么完全不执行，来维护数据库的完整性。如果没有错误发生所有 SQL 操作将会提交到数据库表，如果发生错误，则进行回退，将数据库恢复到某个已知且安全的状态


事务处理的术语
- 事务（transaction）指一组 SQL 语句
- 回退（rollback）指撤销指定的 SQL 语句的过程
- 提交（commit）指将未存储的 SQL 语句结果写入数据库表
- 保留点（savepoint）指事务处理中设置的临时占位符，可以对它发布退回




#### 控制事务处理

管理事务的关键在于将 SQL 语句组分解为逻辑块，并明确规定数据何时应该退回，何时不应该退回

有些数据库要求明确标识事务处理的开始和结束

在 SQL Server 中使用如下标识
```sql
BEGIN TRANSACTION
...
COMMIT TRANSACTION
```
上面的例子中，在 BEGIN TRANSACTION 和 COMMIT TRANSACTION 语句子句的 SQL 必须完全执行或完全不执行

在 MySQL 中使用
```SQL
START TRANSACTION
...
```



#### 使用 ROLLBACK 

SQL 的 ROLLBACK 命令用来回退 SQL 语句

输入
```sql
DELETE FROM Orders;
ROLLBACK;
```
上面的语句执行 DELETE 操作，然后用 ROLLBACK 语句撤销



#### 使用 COMMIT 

一般的 SQL 语句都是针对数据库表直接执行被编写的，这就是所谓的隐式提交，即提交操作是自动进行的

在事务处理中，提交不会隐式进行。进行名叫的提交，使用 COMMIT 语句

下面是 SQL Server 的例子

输入
```sql
BEGIN TRANSACTION 
DELETE OrderItems WHERE order_num = 1222
DELETE Orders WHERE order_num = 1222
COMMIT TRANSACTION
```



#### 使用保留点

使用简单的 ROLLBACK 和 COMMIT 语句，就可以写入或撤销整个事务，但是只有简单的任务才能这样做，复杂的事务可能需要部分提交或退回

要支持回退部分数据，必须在事务处理中的合适位置放置占位符，这样如果需要回退，可以回到某个占位符，这些占位符称为保留点

在 MySQL 和 Oracle 中占位符可以使用 SAVEPOINT

输入
```sql
ROLLBACK to delete
```

每个保留点都要能够标识它的唯一值。以便在回退时知道回退到何处


在 MySQL 和 Oracle 使用 ROLLBACK
```sql
ROLLBACK TO delete
```

