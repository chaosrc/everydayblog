---
title: 在 Node.js 中使用模版渲染
date: 2019-07-02
---

## 在 Node.js 中使用模版渲染



Node.js 中模版引擎有很多种，这里使用简单易学的[EJS](https://ejs.co/)模版



#### 什么是 EJS

EJS 中的 E 是 “Embedded”，即嵌入式 Javascript，是一个使用纯 Javascript 生成 HTML 的模版语言[^1]



#### 安装 EJS 模块

```bash
$ npm install ejs
```



#### 渲染模版

```typescript
// 引入ejs模块
import ejs, { RenderFileCallback } from "ejs"
import { ArticleType } from "../../src/model/types"

// 创建 article.ejs 文件，使用ejs渲染
export function renderArticel(data: ArticleType, cb: RenderFileCallback<any>) {
  ejs.renderFile(__dirname + "/article.ejs", data, {}, cb)
}
```



#### 在 HTTP 路由中添加模版渲染

```typescript
...
// 引入定义好的渲染方法
import { renderArticel } from "./views";
...

app.get("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  articels.find(id, (err: Error, row: ArticleType) => {
    if (err) return next(err);
    // 将数据渲染成HTML，并发送给用户
    renderArticel(row, (err, html) => {
        if(err) return console.log(err)
        res.end(html)
    })
    // res.send(row);
  });
});

```



### EJS 语法

模版标签的含义[^2]

- <% '脚本' 标签，流程控制，不输出到 HTML
- <%= 输出数据到模版
- <%\_ 删除其前面的空格符
- <%- 输出非转义的数据到模板
- %> 一般结束标签
- -%> 删除紧随其后的换行符
- \_%> 将结束标签后面的空格符删除

比较常用的是 `<%` 和 `<=`，对应脚本逻辑和 HMTL 输出

比如：

```html
<!-- 文件 article.ejs -->
<% if ( title ) { %>
<h3>Title: <%= title %></h3>
<% } %>
```

if 语句在 <% 和 %> 之间，不会输出，title 在<%= 和 %>之间，输出为 HTML。最终渲染结果为：

```html
<h3>Title: Node.js</h3>
```

完整的文章和文章列表的模版

```html
<!-- 文件 article.ejs  -->
<% if ( title ) { %>
<h2>标题: <%= title %></h2>
<% } %> 
<% if (content) { %>
<p><%= content %></p>
<% } %>
```

```html
<% rows.forEach((art) => { %>
<h3><%= art.title %></h3>
<p>
  <%= art.content.length > 100 ? art.content.slice(0, 97) + '...' : art.content
  %>
</p>
<% }) %>
```



访问 http://localhost:8800/articles 查看文章列表渲染结果
![](https://s2.ax1x.com/2019/07/03/ZYlBiq.png)



访问 http://localhost:8800/articles/4 查看id为4的文章渲染结果
![](https://s2.ax1x.com/2019/07/03/ZYlwon.png)



[^1]: https://ejs.co/
[^2]: https://ejs.bootcss.com/
