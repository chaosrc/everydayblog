---
title: 过滤数据（一）
date: 2019-08-31
---

## 过滤数据（一）



#### 使用 WHERE 子句

数据表一般包含大量的数据，而通常只需要根据特定的要求检索表中的部分行，而不是所有行。

在 SELECT 语句中，数据根据 WHERE 子句中特定的搜索条件进行过滤。

输入
```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price = 3.49;
```

输出
```sql
Fish bean bag toy|3.49
Bird bean bag toy|3.49
Rabbit bean bag toy|3.49
```

上面的 SQL 语句检索两个列，但是只返回 prod_price 为 3.49 的行



#### WHERE 子句操作符


|操作符 | 说明 | 操作符| 说明|
|:-------:|----------|:-------:|-------|
| = | 等于 | > | 大于 |
| <> | 不等于 | >= | 大于等于|
| != | 不等于 | !> | 不大于 |
| < | 小于 | BETWEEN | 在指定的两值之间 |
| <= | 小于等于 | IS NULL | 为 NULL 值 |
| !< |不小于 |

> 上面的操作符并非所有的数据库都支持，想要确定是否支持需要查看相应文档



#### 大于/小于检查

输入
```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price < 10
```

输出
```sql
8 inch teddy bear|5.99
12 inch teddy bear|8.99
Fish bean bag toy|3.49
Bird bean bag toy|3.49
Rabbit bean bag toy|3.49
Raggedy Ann|4.99
King doll|9.49
Queen doll|9.49
```

上面的 SQL 语句检索出了所有价格小于 10 的产品



#### 不匹配检查

输入
```sql
SELECT vend_id, prod_name
FROM Products
WHERE vend_id <> 'DLL01';
```

输出
```sql
BRS01|8 inch teddy bear
BRS01|12 inch teddy bear
BRS01|18 inch teddy bear
FNG01|King doll
FNG01|Queen doll
```
使用了 <> 不等于操作符来过滤掉 vend_id 为 DLL01 的行



#### 范围值检查

如果要查看某个范围的值，可以使用 BETWEEN 操作符。BETWEEN 操作符需要指定两个值一个开始值一个结束值。

检索价格在 5 至 10 之间的所有产品

输入
```sql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 5 AND 10;
```
输出
```sql
8 inch teddy bear|5.99
12 inch teddy bear|8.99
King doll|9.49
Queen doll|9.49
```
在使用 BETWEEN 时，指定开始值和结束值，用 AND 关键字分隔，检索出所有开始值和结束值之间的值，包括开始值和结束值



#### 空值检查

在创建表时，可以指定列的值是否能为空，如果可以为空那么这个空值为 NULL

> NULL 值与 0，空字符串以及空格值并不相同

要确定值是否为 NULL 不能简单的检查 = NULL。SELECT 语句中有一个特殊的 WHERE 子句 `IS NULL` 用来检查是否为 NULL 值。

输入
```sql
SELECT cust_name
FROM Customers
WHERE cust_email IS NULL;
```

输出
```sql
Kids Place
The Toy Store
```
上面的 SQL 语句通过 `WHERE cust_email IS NULL` 来过滤 cust_email 为 NULL 的列










