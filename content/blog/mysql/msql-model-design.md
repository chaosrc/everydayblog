---
title: 数据库模型和设计
date: 2019-10-01
---


## 数据库模型和设计



在创建数据库时，很容易落入快速开发而没有投入足够的时间和努力去做设计的陷阱。这样会导致频繁的重新设计和实现成本



#### 错误的实现方式

想象一下我们想要创建一个数据库去存储学生的成绩，我们可以创建一个 Student_Grades 表，表中有每个学生的姓名、别名、课程名称以及分数（Pctg）

| GivenNames | Surname | CourseName | Pctg|
|------------|------------|------------| ------------|
| John Paul  | Bloggs | Web Database | 72|
| John Paul  | Bloggs | Mathematics  | 43|
| John Paul  | Bloggs | Mathematics  | 65|
| Sarah     | Doe | Programing 1 | 87|
| Sarah     | Smith | Programing 1 | 55|

很容易获取到任意学生任意课程的分数，然而可能会有两个姓名相同的学生都叫 Sarah Smith，因此需要为每个学生添加添加一个唯一的 ID
|StudentID| GivenNames | Surname | CourseName | Pctg|
|------------|------------|------------|------------| ------------|
|123454| John Paul  | Bloggs | Web Database | 72|
|123454| John Paul  | Bloggs | Mathematics  | 43|
|123454| John Paul  | Bloggs | Mathematics  | 65|
|123456| Sarah     | Doe | Programing 1 | 87|
|123457| Sarah     | Smith | Programing 1 | 55|

这里还有另一问题，John Paul 的课程 Mathematics 第一次考了 43 分不及格，而第二次考了 65 分通过。在上面的表中没有展示它们直接的顺序，因此需要添加年份和学期字段（Sem）

|StudentID| GivenNames | Surname | CourseName |Year|Sem| Pctg|
|----------|-----------|---------|----------|----|---| -----|
|123454| John Paul  | Bloggs | Web Database |2018|2| 72|
|123454| John Paul  | Bloggs | Mathematics  |2018|2| 43|
|123454| John Paul  | Bloggs | Mathematics  | 2019|3|65|
|123456| Sarah     | Doe | Programing 1 |2018|1| 87|
|123457| Sarah     | Smith | Programing 1 |2019|2| 55|

此时 Stuend_Grades 表已经变得非常臃肿了。我们可以将学生信息单独拆分为一个表 Student_Details:

| StudentID | GivenNames | Surname |
| --------- | --------- | --------- |
|123454| John Paul  | Bloggs |
|123456| Sarah     | Doe |
|123457| Sarah     | Smith |

Student_Grades 表：

|StudentID| CourseName |Year|Sem| Pctg|
|----------|----------|----|---| -----|
|123454| Web Database |2018|2| 72|
|123454| Mathematics  |2018|2| 43|
|123454|  Mathematics  | 2019|3|65|
|123456| Programing 1 |2018|1| 87|
|123457|  Programing 1 |2019|2| 55|


如果要查询学生的成绩，我们首先在 Student_Details 表中查询StudentID，通过 StudentID 在 Student_Grades 表中查询成绩

还有很多问题没有考虑，比如学生的邮箱、手机号、考勤等。这样的实现方式的问题在于，不断的遇到没有考虑到的问题，需要不断地改变数据库结构。




#### 数据库设计的过程

在数据库设计中有三个重要的阶段，每一个过程都产生一个渐进的低层次描述：

- 需求分析
  首先确定并记录数据库的确切用途，将存储什么样的数据以及数据之间如何关联。可能需要对需求进行仔细的研究，和各种与数据库交互的人员进行沟通

- 概念设计
  一但我们知道了数据库的需求是什么，就可以将其提取为数据库设计的正式描述，比如使用建模来进行概念设计

- 逻辑设计
  最后，将数据库设计映射为真实的数据库系统和表



