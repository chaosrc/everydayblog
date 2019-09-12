---
title: 聚集函数（三）
date: 2019-09-10
---

## 聚集函数（三）



前面介绍的几个聚集函数都可以如下使用：

- 对所有行执行计算，可以指定指定特定行或者所有行（*）
- 通过指定 DISTINCT 参数，可以只包含不同的值

下面使用 DISTINCT 参数，计算平均值

输入

```sql
SELECT AVG(DISTINCT prod_price) AS avg_price
FROM Products
WHERE vend_id = 'DLL01';
```

输出

```sql
4.24
```

上面的 AVG(DISTINCT prod_price) 计算平均值只包含了各个不同的价格，价格相同的物品只会计算一次

下面是不使用 DISTINCT 参数的结果

输入

```sql
 SELECT AVG(prod_price) AS avg_price
 FROM Products
 WHERE vend_id = 'DLL01';
```

输出

```sql
3.865
```

因为没有使用 DISTINCT 计算了价格相同的物品所以平均值要小于使用 DISTINCT 时的结果




> DISTINCT 不能用于 COUNT(*)
> DISTINCT 可以用于 MIN 和 MAX， 但是没有实际的价值，不管考不考虑不同值，计算结果都是相同的





#### 组合聚集函数

SELECT 语句还可以组合多个聚集函数使用

输入

```sql
SELECT COUNT(*) AS num_items,
    MIN(prod_price) AS price_min,
    MAX(prod_price) AS price_max,
    AVG(prod_price) AS proce_avg
FROM Products;
```

输出

```sql
9|3.49|11.99|6.82333333333333
```

上面的 SELECT 语句使用了四个聚集函数 COUNT、MIN、MAX、AVG，同时计算产品数量、最高价格、最低价格以及平均值



#### 总结

 SQL 的聚集函数可以用来汇总数据，虽然应用也可以进行这些操作但是 SQL 聚集函数的效率要高很多