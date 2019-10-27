---
title: 实体关系建模示例
date: 2019-10-04
---

## 实体关系建模示例



通过一个大学的学生和课程数据库为例来设计 ER 图表

大学数据库中存储关于学生、课程、学生每个学期完成的课程

需求列表：
- 学校提供一个或多个项目（programs）
- 一个项目由一个或多个课程组成
- 学生必须注册一个项目
- 学生选择的课程是他的项目的一部分
- 一个项目有名称、项目 ID、需要的学分、开始的年份
- 一个课程有名称、课程 ID、学分值、开始年份
- 学生有名字、姓氏、学生 ID、出生日期、首次注册的年份
- 当一个学生选择一门课程后，他尝试的年份和学期要被记录下来。当他完成这门课程时等级和分数需要记录下来
- 项目中的每一个课程安排到年份和学期


![](https://s2.ax1x.com/2019/10/05/urRgrq.png)