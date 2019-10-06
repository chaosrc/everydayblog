---
title: MySQL 用户变量
date: 2019-10-05
---


## MySQL 用户变量



很多时候我们需要保存 SQL 语句检索的结果，比如想在后面的 SQL 语句中使用这个值，或者想保存这个值在之后显示。使用用户变量允许我们保存结果之后再使用


举一个例子，下面的 SQL 语句查找艺术家的名字并将它保存在一个用户变量中

输入

```sql
 SELECT @artist:=artist_name 
 FROM artist 
 WHERE artist_id = 1;
```

输出
```sql
+----------------------+
| @artist:=artist_name |
+----------------------+
| swift                |
+----------------------+
```
上面的语句中，使用 @ 符合来表示用户变量，使用 := 操作符来给变量赋值

可以使用 SELECT 语句来打印变量的内容

```sql
mysql> SELECT @artist;
+---------+
| @artist |
+---------+
| swift   |
+---------+
```

也可以不使用 SELECT 语句直接给变量赋值，比如初始化一个变量

```sql
SET @counter := 0;
```

同时初始化多个变量

```sql
SET @counter := 0, @age := 18;
```



变量最常用的方式是保存查询结果，然后在后面的语句中使用。比如在一个音乐数据库中查询最近播放歌曲的名字

在不使用变量时，首先要查找到最近一次播放的时间，然后将这个时间做为 WHERE 子句的条件查询歌曲的名字


```sql
mysql> SELECT MAX(played) FROM played;
+----------------------+
| played                |
+----------------------+
| 2018-05-09 15:44:23   |
+----------------------+
```

```sql
mysql> SELECT track_name 
FROM track 
INNER JOIN played 
USING (artist_id, album_id, track_id)
WHERE played = "2018-05-09 15:44:23 ";
```

下面是使用变量的语句

```sql
mysql> SELECT @recent := MAX(played) FROM played;

mysql> SELECT track_name 
FROM track 
INNER JOIN played 
USING (artist_id, album_id, track_id)
WHERE played = @recent;

```



使用变量的一些原则
- 用户变量是对于连接唯一的，不同的链接可以有相同的名字，但是是两个变量
- 变量名是字母数字字符串，也可以是点（.）、下划线（_）和 美元符号（$)
- 在 MySQL 版本 5 之前变量名大小写敏感，在 5 之后的版本大小写不区分
- 变量没有初始化时为 NULL 值
- 当连接断开时变量被销毁
- 尽量不要在一个查询语句中同时赋值和使用同一个变量。因为变量赋值后可能无法在同一个 SQL 语句中立即生效


