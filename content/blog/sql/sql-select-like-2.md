---
title: 用通配符进行过滤（二）
date: 2019-09-04
---

## 用通配符进行过滤（二）



#### 下划线（_）通配符

下划线通配符也是一个非常有用的通配符，它与 % 通配符的用途很相似，但是它只匹配单个字符，而不是多个字符。

输入

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE '__ inch teddy bear';
```

输出

```sql
BR02|12 inch teddy bear
BR03|18 inch teddy bear
```

上面的 SQL 语句使用了两个 _ 通配符匹配，只有同时匹配两个操作符的行会被检索出来，比如第一行匹配 12， 第二行匹配 18。对比 % 操作符，执行下面的 SQL 

输入

```sql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE '% inch teddy bear';
```

输出

```sql
BR01|8 inch teddy bear
BR02|12 inch teddy bear
BR03|18 inch teddy bear
```

在使用两个 _ 通配符时，第一行 8 就没有匹配因为 8 只匹配一个 _ 通配符。

与 % 匹配多个字符不同，_ 只能匹配一个字符，即不能多也不能少



#### 方括号（[]）通配符

方括号（[]）通配符可以用来指定一个字符集, 搜索结果必须匹配指定集合中的一个字符

需要注意的是支持方括号（[]）通配符的数据库比较少，现在只有 Access 和 SQL Server 支持。


输入

```sql
SELECT cust_contact
FROM Customers
Where cust_contact LIKE '[JM]%' 
```

上面的 SQL 语句匹配所有名字以 J 或 M 开头的行。

输出

```sql
Jim Jones
John Smith
Michelle Green
```



#### 通配符使用总结

SQL 的通配符很有用，但是通配符的搜索比一般的搜索要消费更长的时间。在使用通配符是尽量遵循下面的原则：
- 不要过度使用通配符，如果其他的操作符能够到达相同的目的，应该优先使用其他操作符
- 在确实要使用通配符时，尽量不要把通配符放在开始出，因为通配符在开始处时搜索起来最慢
- 注意通配符的位置，如果放错位置，可能不会返回想要的数据















