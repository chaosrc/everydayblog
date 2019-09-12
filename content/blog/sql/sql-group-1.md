---
title: 分组数据（一）
date: 2019-09-11
---

## 分组数据（一）

SQL 中的聚集函数可以汇总数据，能够计算平均值、最大值、最小值等，所有的计算都是表的所有数据或者匹配特定 WHERE 子句的数据，比如：

输入

```sql
SELECT COUNT(*) AS num_prods
FROM products
WHERE vend_id = 'DLL01';
```

输出

```sql
4
```

如果要返回每个供应商的产品数目，或者返回10个以上供应商的产品，那么就可以用到分组了。
使用分组可以将数据分为多个逻辑组，对每个组进行集聚计算。



#### 创建分组


在 SELECT　语句中使用 GROUP BY 子句建立

输出

```sql
SELECT vend_id, COUNT(*) AS num_prods
FROM products
GROUP BY vend_id;
```

输入

```sql
BRS01|3
DLL01|4
FNG01|2
```

上面的 SQL 语句指定了两个列：vend_id 为产品供应商的 ID，num_prods 为 COUNT(\*) 计算字段，使用 GROUP BY 子句对 vend_id 进行排序并分组，此时 COUNT(*) 会对每个 vend_id 的 num_props 进行计算。从输出结果可以看到有三个供应商，分别对应 3、4、2 个产品数量


使用 GROUP BY 的一些规定：

- GROUP BY 子句可以包含任意数目的列，因此可以对分组进行嵌套，从而进行更细致的数据分组
- 如果使用在 GROUP BY 子句中使用了嵌套分组，数据将在最后指定的分组上进行汇总
- GROUP BY 子句中列出的每一列都必须是检索列或者有效表达式，但是不能是聚集函数
- 大多数 SQL 实现不允许 GROUP BY 带有长度可变的数据类型，比如文本类型
- 除了聚集函数语句外，SELECT 语句中的每一列都必须在 GROUP BY 子句中给出
- 如果分组列中包含具有 NULL 值的行，那么 NULL 将作为一个分组返回
- GROUP BY 子句必须出现在 WHERE 子句之后，ORDER BY 子句之前



使用 GROUP BY 子句嵌套分组

输入

```sql
SELECT vend_id, prod_price, COUNT(prod_price)
FROM Products
GROUP BY vend_id, prod_price;
```

输出

```sql
BRS01|5.99|1
BRS01|8.99|1
BRS01|11.99|1
DLL01|3.49|3
DLL01|4.99|1
FNG01|9.49|2
```

上面的 SQL 语句，COUNT(prod_price) 计算产品价格的计数，使用 GROUP BY 对 vend_id 和 prod_price 进行嵌套分组












