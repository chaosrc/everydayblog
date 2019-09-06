---
title: 创建计算字段
date: 2019-09-05
---


## 创建计算字段


一般储存在表中数据可能不是应用程序所需要的格式，我们需要对数据库中检索的字段进行转换、计算或者格式化后再返回给应用程序，这时就可以使用计算字段



####  拼接字段

可以通过拼接字段来使用计算字段。我们现在有一个 Vendors 表，里面包含供应商名和地址信息列，如果要生成一个报表，报表中需要展示名称和供应商，并且供应商使用括号扩起来，而数据库中并没有名称和供应商组合的字段以及括号，这时可以使用拼接字段进行组合

在不同的数据库中拼接字段的方式不一样，多数数据库可以使用加号（+）或者两个竖杠（||）表示，在 MySQL 和 MariaDB 中，必须使用特殊的函数


输入

```sql
SELECT vend_name || ' (' ||  vend_country || ')'
FROM Vendors
ORDER BY vend_name;
```

输出

```sql
Bear Emporium (USA)
Bears R Us (USA)
Doll House Inc. (USA)
Fun and Games (England)
Furball Inc. (USA)
Jouets et ours (France)
```

上面的 SELECT 语句拼接了以下语句：

- vend_name 列中的名字
- 左括号字符
- vend_country 列中的国家
- 右括号字符




#### 使用别名

上面的 SQL 语句拼接了名称和地址，但是这个新计算的列没有名字，在应用程序中无法引用。为了解决这个问题，SQL 中支持别名，别名可以做为一个字段或值的替换名。使用 AS 关键词来声明别名

输入

```sql
SELECT vend_name || ' (' || vend_country || ')'
AS vend_title
FROM Vendors
ORDER BY vend_title DESC;
```

输出

```sql
Jouets et ours (France)
Furball Inc. (USA)
Fun and Games (England)
Doll House Inc. (USA)
Bears R Us (USA)
Bear Emporium (USA)
```

上面的 SQL 语句对计算字段添加了别名 vend_title，使用 DESC 对 vend_title 进行降序排序，此时的 vend_title 在应用程序中也可以使用，就像一个实际的列一样



#### 执行算数计算

计算字段另一个常用的地方是对检索的数据就像算数计算，比如   OrderItems 表中包含每个订单中各项物品的价格和数量，可以通过算数计算来计算出各个物品的总价格

输入

```sql
SELECT prod_id, quantity, item_price, quantity * item_price AS total_amount
FROM OrderItems
WHERE order_num = 20008;
```

输出

```sql
RGAN01|5|4.99|24.95
BR03|5|11.99|59.95
BNBG01|10|3.49|34.9
BNBG02|10|3.49|34.9
BNBG03|10|3.49|34.9
```
上面的 SQL 语句中 total_amount 字段为计算字段，其值为 quantity * item_price，在应用程序中可以像其他实际字段一样使用

 








