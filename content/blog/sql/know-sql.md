---
title: 数据库基础
date: 2019-08-26
description: 了解数据库表、列、行以及主键
---

## 数据库基础



#### 数据库

数据库是一个以某种有组织的方式储存的数据集合。可以将数据库想象为一个文件柜，这个文件柜只是一个存放数据的物理位置，而不管数据是什么、如何组织。



#### 表

表是一种结构化的文件，可以用来存储某种特定类型的数据。就好像是文件柜中的文件，文件里面存放某个类型的资料

数据库中的每一个表都有一个名字来标识，而且在同一个数据库中这个名字是唯一的

表的特性是由模式（schema）决定的，模式定义数据在表中如何存储，包括储存什么样的数据、数据如何分解、各部分的信息如何命名等



#### 列和数据类型

表是由列组成的，列是表中的一个字段存储表中的某部分信息。表相当于一个网格，每一列储存着特定的信息

数据库中的每一列都有相应的数据类型（datetype），定义了列可以存储哪些数据种类。比如如果列中储存的是金额，那么数据类型应该是数值类型，如果是储存姓名则数据类型为文本类型，需要根据储存的内容定义合适的数据类型

在列中限定数据类型可以帮助正确的分类数据以及优化存储性能，因此在创建表时必须特别关注数据类型



#### 行

表中的数据是按行储存的，每一条记录就是一行，也就是表网格中的水平行



#### 主键

表中的每一行都应该有一列或几列可以唯一标识自己，这个唯一标识列被称为主键。如果没有主键，更新或者删除表中特定行就会很困难。主键不是必须的，但是有了主键可以方便的对数据进行操作和管理

主键列需要满足的条件：
- 任意两行都不具有相同的主键值
- 每一行都必须具有一个主键值且主键值不能为 NULL
- 主键列中的值不允许修改或者更新
- 主键值不能重用，如果某一行从表中删除，它的主键值不能赋值给以后的新行



#### 什么是 SQL

SQL 是 Structtured Query Language（结构化查询语句） 的缩写，SQL 是一个专门与数据库沟通的语言。

SQL 不是特定数据库的专有语言，SQL 语言能在绝大多数数据库中使用。

SQL 语言简单易学但是强大、灵活，能够进行复杂和高级的数据库操作。














