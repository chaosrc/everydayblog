---
title: 过滤数据（二）
date: 2019-09-01
---

## 过滤数据（二）



#### 组合 WHERE 子句

为了进行更强的过滤控制，SQL 允许多个 WHRER 子句组合，使用 AND 或 OR 分隔。




#### AND 操作符

如果要对多个列进行过滤，可以使用 AND 操作符添加多个条件

输入

```sql
SELECT prod_id, prod_price, prod_name
FROM Products
WHERE vend_id = 'DLL01' AND prod_price <= 4;
```
输出
```sql
BNBG01|3.49|Fish bean bag toy
BNBG02|3.49|Bird bean bag toy
BNBG03|3.49|Rabbit bean bag toy
```

上面的 SQL 语句检索出供应商为 DLL01 且产品价格小于 4 的所有产品的 id 、价格和名称。WHERE 子句中包含了两个条件，使用 AND 关键词连接，表示检索出同时满足两个条件的行。



#### OR 操作符

OR 操作符与 AND 相反，表示检索匹配任意条件的的行。一般在匹配第一个条件后就不在计算第二个条件了。

输入
```sql
SELECT prod_name, prod_price
FROM  Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```
输出
```sql
8 inch teddy bear|5.99
12 inch teddy bear|8.99
18 inch teddy bear|11.99
Fish bean bag toy|3.49
Bird bean bag toy|3.49
Rabbit bean bag toy|3.49
Raggedy Ann|4.99
```
上面的 SQL 语句检索出满足任意 WHERE 子句中指定供应商的所有产品的名称和价格。OR 语句告诉数据库匹配任意条件而不是同时匹配两个条件。



#### 求值顺序

WHRER 子句可以包含任意数目的 AND 和 OR 操作符，允许两者进行复杂、高级的过滤。

假如需要列出价格为 10 以上而且由 DLL01 或 BRS01 供应商制造的所有产品。使用下面的 SQL 语句

输入
```sql
SELECT prod_name, prod_price
FROM Products
WHERE vend_id = 'DLL01' OR vend_id = 'BRS01'
      AND prod_price >= 10;
```
输出
```sql
18 inch teddy bear|11.99
Fish bean bag toy|3.49
Bird bean bag toy|3.49
Rabbit bean bag toy|3.49
Raggedy Ann|4.99
```
可以看输出结果并不满足要求，有 4 个小于 10 的价格，因为 SQL 在处理 OR 操作符之前会优先处理 AND 操作符，上面的 SQL 语句解释为：检索由供应商为 BRS01 且价格大于等于 10 的所有产品，或者供应商为 DLL01 的所有产品，不管其价格如何。

解决这个问题的方法是使用圆括号对操作符进行明确的分组

输入
```sql
SELECT prod_name, prod_price
FROM Products
WHERE (vend_id = 'DLL01' or vend_id = 'BRS01')
       AND prod_price >= 10;
```
输出
```sql
18 inch teddy bear|11.99
```
圆括号具有比 AND 或 OR 更高的求值顺序，所以会先过滤圆括号内的 OR 条件。上面 SQL 语句可以理解为：检索出由供应商 DLL01 或 BRS01 制造且价格大于 10 的所有产品。

> 为了避免出错或者歧义，应该尽可能的使用圆括号进行操作符分组








