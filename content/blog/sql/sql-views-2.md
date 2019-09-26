---
title: 使用视图（二）
date: 2019-09-25
---


## 使用视图（二）



#### 使用视图重新格式化检索出的数据

重新格式化检索出的数据是视图最常见的用途之一。下面的 SQL 语句组合计算供应商的名称和位置：

输入
```sql
SELECT RTRIM(vend_name) + '(' + RTRIM(vend_country) + ')' AS vend_title
FROM Vendors
ORDER BY vend_name;
```

输出
```sql
vend_title        
------------------
Bears R Us(USA)
Bear Emporium(USA)
Doll House Inc.(USA)
Furball Inc.(USA)
Fun and Games(England)
Jouets et ours(France)
```

如果需要经常用得上面这个格式的结果，可以创建一个视图来使用，而不必每次执行时进行拼接

输入
```sql
CREATE VIEW VendorLocation AS
SELECT RTRIM(vend_name) + '(' + RTRIM(vend_country) + ')' AS vend_title
FROM Vendors;
```
再使用视图进行数据检索

输入
```sql
SELECT * FROM VendorLocation;
```
输出
```sql
vend_title     
---------------
Bears R Us(USA)
Bear Emporium(USA)
Doll House Inc.(USA)
Furball Inc.(USA)
Fun and Games(England)
Jouets et ours(France)
```



#### 使用视图过滤不需要的数据


视图对于应用普通的 WHERE 子句也很有用。比如要过滤没有电子邮箱的顾客

输入
```sql
CREATE VIEW CustomerEmailList AS
SELECT cust_id, cust_name, cust_email
FROM Customers
WHERE cust_email IS NOT NULL;
```
上面的语句创建了视图 CustomerEmailList，并使用 WHERE 子句过滤掉了 cust_email 为 NULL 的值

检索 CustomerEmailList

```sql
SELECT * FROM CustomerEmailList;
```

输出

```sql
1000000001|Village Toys|sales@villagetoys.com
1000000003|Fun4All|jjones@fun4all.com
1000000004|Fun4All|dstephens@fun4all.com
1000000005|The Toy Store|abc@qq.com
```



#### 视图与计算字段

下面是检索订单物品，并计算每种物品的总价格

输入
```sql
SELECT prod_id, 
       quantity,
       item_price,
       quantity * item_price AS total_price
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

创建视图

```sql
CREATE VIEW OrderItemPrice AS
SELECT prod_id,
       quantity,
       item_price,
       order_num,
       quantity * item_price AS total_price
FROM OrderItems;
```

在视图上检索订单内容

```sql
SELECT * FROM OrderItemPrice
WHERE order_num = '20008';
```

输出
```sql
RGAN01|5|4.99|20008|24.95
BR03|5|11.99|20008|59.95
BNBG01|10|3.49|20008|34.9
BNBG02|10|3.49|20008|34.9
BNBG03|10|3.49|20008|34.9
```

可以看到视图非常容易创建，而且很好使用，正确使用可以极大的简化复杂数据的处理