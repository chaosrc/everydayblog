---
title: MySQL 备份
date: 2019-10-06
---

## MySQL 备份



#### 数据库做为 SQL 语句导出

通过生成一个文件，这个文件中包含重新创建这个数据库结构的所有 SQL 语句，来进行备份，如果需要也可以包含所有插入数据的 SQL 语句

SQL 语句是一种很好的备份方式，SQL 语句中仅包含文本，能够进行压缩

下面我们来使用 mysqldump 备份一下 tysql 这个数据库

输入
```sh
mysqldump -uroot -p --result-file=tysql.backup.sql tysql
```
上面的命令创建了一个 tysql.backup.sql 文件，打开文件可以看内容下面的内容

```sql
-- MySQL dump 10.13  Distrib 8.0.17, for Linux (x86_64)
--
-- Host: localhost    Database: tysql
-- ------------------------------------------------------
-- Server version	8.0.17
...

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customers` (
  `cust_id` char(10) NOT NULL,
  `cust_name` char(50) NOT NULL,
  `cust_address` char(50) DEFAULT NULL,
  `cust_city` char(50) DEFAULT NULL,
  `cust_state` char(5) DEFAULT NULL,
  `cust_zip` char(10) DEFAULT NULL,
  `cust_country` char(50) DEFAULT NULL,
  `cust_contact` char(50) DEFAULT NULL,
  `cust_email` char(255) DEFAULT NULL,
  PRIMARY KEY (`cust_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
INSERT INTO `Customers` VALUES ('1000000001','Village Toys','200 Maple Lane','Detroit','MI','44444','USA','John Smith','sales@villagetoys.com'),('1000000002','Kids Place','333 South Lake Drive','Columbus','OH','43333','USA','Michelle Green',NULL),('1000000003','Fun4All','1 Sunny Place','Muncie','IN','42222','USA','Jim Jones','jjones@fun4all.com'),('1000000004','Fun4All','829 Riverside Drive','Phoenix','AZ','88888','USA','Denise L. Stephens','dstephens@fun4all.com'),('1000000005','The Toy Store','4545 53rd Street','Chicago','IL','54545','USA','Kim Howard',NULL);
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

...
```

导出文件包含的内容
- DROP TABLE 如果表已经存在则先删除表，防止导入数据是出错
- CREATE TABLE 创建表
- INSERT 将所有的数据添加到表中
- LOCK TABLES 和 UNLOCK TABLES，确保只有当前用户在修改数据库



#### 导入备份数据

通过读取导出文件中的 SQL 语句，来创建数据库结构以及插入数据

创建一个新的数据库
```sql
CREATE DATABASE tysql2;
```

选择数据库
```sql
USE tysql2;
```

导入数据
```sql
SOURCE /var/lib/mysql/tysql.backup.sql
```





