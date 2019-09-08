---
title: 使用函数处理数据（一）
date: 2019-09-06
---

## 使用函数处理数据（一）



与大多数其他编程语言一样，SQL 也支持函数来处理数据，为数据的转换和处理提供方便

对于不同类型的函数除了少数被主要的数据库支持，大部分函数虽然功能相同但是函数的名称和语法可能完全不同




#### SQL 中的函数类型

大部分 SQL 都支持以下的函数类型：

- 文本处理函数，比如删除空格，大小写转换等
- 数值处理函数，进行算术操作，比如代数运算，求取绝对值
- 日期和时间处理函数，比如计算两个日期之差，检查日期有效性等
- 系统函数，返回数据库的一些特殊信息，比如用户登录信息

函数即可以在列上使用，也可以在 WHERE 等子句中使用



#### 文本处理函数

输入

```sql
SELECT vend_name, UPPER(vend_name) AS vend_name_upcase
FROM Vendors
ORDER BY vend_name;
```

输出

```sql
Bear Emporium|BEAR EMPORIUM
Bears R Us|BEARS R US
Doll House Inc.|DOLL HOUSE INC.
Fun and Games|FUN AND GAMES
Furball Inc.|FURBALL INC.
Jouets et ours|JOUETS ET OURS
```
上面的 SQL 语句使用 UPPER 将文本转为大写，输出的第一列为表中储存的值，第二列为通过 UPPER 函数转为大写后的值

输入

```sql
SELECT vend_name, LENGTH(vend_name) AS vend_name_length
FROM Vendors;
```
输出

```sql
Bears R Us|10
Bear Emporium|13
Doll House Inc.|15
Furball Inc.|12
Fun and Games|13
Jouets et ours|14
```
上面的 SQL 语句使用 LENGTH 计算 vend_name 的长度，输出的第二列的值为对应行的 vend_name 字符串长度



常见的文本处理函数

| 函数      | 说明 |
| -------- | ------- |
| LEFT()   | 返回字·符串左边的字符 | 
| LENGTH() | 返回字符串的长度   |
| LOWER()  | 将字符串转为小写  |
| LTRIM()  |  去掉字符左边的空格 |
| RTRIM()  |  去掉字符右边的空格 |
| UPPER()  | 将字符串转为大写  |



