---
title: 分组数据（二）
date: 2019-09-12
---


## 分组数据（二）



#### 分组过滤

GROUP BY 除了能对数据进行分组外，还可以对分组进行过滤，指定包含哪些分组，排除哪些分组

与 WHERE 子句的不同是 WHERE 子句过滤的是行而不是分组。SQL 中提供了对分组进行过滤的子句 HAVING。HAVING 非常类似与 WHERE，且支持所有的 WHERE 子句操作符。

输入

```sql
SELECT cust_id, COUNT(*) as num
FROM orders
GROUP BY cust_id
HAVING COUNT(*) >= 2;
```

输出

```sql
1000000001|2
```
上面的 SQL 语句使用 HAVING COUNT(*) >= 2 过滤订单数量大于等于 2 的订单

> HAVING 和 WHERE 的区别：
> WHERE 是在分组前进行过滤，而 HAVING 是在分组后进行过滤


同时使用 WHERE 和 HAVING 子句

输入

```sql
SELECT vend_id, COUNT(*) AS num
FROM products
WHERE prod_price >= 4
GROUP BY vend_id
HAVING num >= 2;
```

输出

```sql
BRS01|3
FNG01|2
```
上面的 SQL 语句先使用 WHERE 子句过滤 prod_price大于等于 4 的产品，然后对分组数量大于等于 2 的分组进行过滤




 #### 分组排序

GROUP BY 和 ORDER BY 经常完成相同的工作，但是它们之间有如下区别

| ORDER BY | GROUP BY |
| ---------- | --------- |
| 对产生的输出排序 | 对行分组，但输出可能不是分组的顺序|
| 对任意列都可使用 | 只能使用选择列或者表达式 |
| 不一定需要 | 如果与聚集函数一起使用列，则必须使用|

检索包含三个及以上物品的订单号和订购物品的数目，并通过订单号进行分组

输入

```sql
SELECT order_num, COUNT(*) AS items
FROM order_items
GROUP BY order_num
HAVING COUNT(*) >= 3;
```

输出

```sql
20006|3
20007|5
20008|5
20009|3
```

添加 ORDER BY 子句对物品的数量进行排序

输入

```sql
SELECT order_num, COUNT(*) AS items
FROM order_items
GROUP BY order_num
HAVING COUNT(*) >= 3
ORDER BY items;
```

输出

```sql
20006|3
20009|3
20007|5
20008|5
```

#### SELECT 子句的顺序

SELECT 语句中使用时必须遵循的次序

| 子句 | 说明 | 是否必须使用 |
|-----|-----|-----|
| SELECT | 要返回的列或表达式 | 是 |
| FROM | 检索数据的表 | 是 |
| WHERE | 行级过滤 | 否 |
| GROUP BY | 分组 | 仅在按组计算集聚数据时使用 |
| HAVING | 组级过滤 | 否 |
| ORDER BY | 对输出排序 | 否 |






