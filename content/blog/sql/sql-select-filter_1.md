---
title: 排序检索数据
date: 2019-08-30
---

## 排序检索数据


使用 SELECT 语句的 ORDER BY 子句可以对检索数据进行排序



#### 排序数据

使用 SQL 语句进行查询表中的某个列，并没有特定的顺序，比如

输入
```sql
SELECT prod_name
FROM Products;
```
输出
```sql
8 inch teddy bear
12 inch teddy bear
18 inch teddy bear
Fish bean bag toy
Bird bean bag toy
Rabbit bean bag toy
Raggedy Ann
King doll
Queen doll
```
上面检索出来的数据并不是随机显示的，如果不排序数据一般以它在底层表中出现的顺序显示，
这有可能是添加数据到表中的顺序，但是如果数据进行过更新或者删除，那么这个顺序可能会受到数据库重用存储空间方式的影响


使用 ORDER BY 子句可以对一个或多个列进行排序

输入
```sql
SELECT prod_name
FROM Products
ORDER BY prod_name
```

输出
```sql
12 inch teddy bear
18 inch teddy bear
8 inch teddy bear
Bird bean bag toy
Fish bean bag toy
King doll
Queen doll
Rabbit bean bag toy
Raggedy Ann
```

> 在指定一条 ORDER BY 子句时，应该保证它是 SELECT 语句中最后一条子句，
> 如果不是则会报错
> ORDER BY 子句中可以使用非选择列进行排序



#### 按多个列进行排序

按多个列进行排序，在 ORDER BY 子句中指定多个列名用逗号隔开

输入
```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price, prod_name;
```
输出
```sql
BNBG02|3.49|Bird bean bag toy
BNBG01|3.49|Fish bean bag toy
BNBG03|3.49|Rabbit bean bag toy
RGAN01|4.99|Raggedy Ann
BR01|5.99|8 inch teddy bear
BR02|8.99|12 inch teddy bear
RYL01|9.49|King doll
RYL02|9.49|Queen doll
BR03|11.99|18 inch teddy bear
```

多行排序时，排序的顺序完全按照规定进行，比如上面的例子中，仅在 prod_price 相同时，才会对 prod_name 进行排序，
如果 prod_price 列中所有的值都是唯一的，则不会按照 prod_name 进行排序




####  按列的位置进行排序

除了能用列名来指出排序顺序以外，ORDER BY 还可以使用相对位置进行排序

输入
```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY 2, 3;
```
输出
```sql
BNBG02|3.49|Bird bean bag toy
BNBG01|3.49|Fish bean bag toy
BNBG03|3.49|Rabbit bean bag toy
RGAN01|4.99|Raggedy Ann
BR01|5.99|8 inch teddy bear
BR02|8.99|12 inch teddy bear
RYL01|9.49|King doll
RYL02|9.49|Queen doll
BR03|11.99|18 inch teddy bear
```
`ORDER BY 2, 3` 中的 2 和 3 分别对应于选择的列的相对位置而不是列名，2 表示按照 prod_price 进行排序，3 表示按照 prod_name 进行排序

> 使用相对位置排序的好处是不用输入列名，但是也容易出错，对 SELECT 列进行更改时容易忘记对 ORDER BY 子句进行更改。
> 对于不在 SELECT 列中的列显然也无法使用这种排序方式



#### 指定排序方向

ORDER BY 子句的排序默认是升序排序（从 A 到 Z），如果要使用降序排序可以使用 DESC 关键词

输入
```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price DESC
```

输出
```sql
BR03|11.99|18 inch teddy bear
RYL01|9.49|King doll
RYL02|9.49|Queen doll
BR02|8.99|12 inch teddy bear
BR01|5.99|8 inch teddy bear
RGAN01|4.99|Raggedy Ann
BNBG01|3.49|Fish bean bag toy
BNBG02|3.49|Bird bean bag toy
BNBG03|3.49|Rabbit bean bag toy
```
上面的语句使用 DESC 关键词对 prod_price 进行降序排列


如果对多列进行排序，在需要指定排序方向的列上加上 DESC/ASC 关键词，DESC/ASC 关键词只作用于直接位于其前面的列

输入
```sql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price DESC, prod_name;
```
输出
```sql
BR03|11.99|18 inch teddy bear
RYL01|9.49|King doll
RYL02|9.49|Queen doll
BR02|8.99|12 inch teddy bear
BR01|5.99|8 inch teddy bear
RGAN01|4.99|Raggedy Ann
BNBG02|3.49|Bird bean bag toy
BNBG01|3.49|Fish bean bag toy
BNBG03|3.49|Rabbit bean bag toy
```
上面检索结果中 prod_price 使用 DESC 以降序排列，prod_name 仍然以默认的升序进行排列

