---
title: 使用 v8-profiler 分析 CPU 使用情况
date: 2019-08-10
---


## 使用 v8-profiler 分析 CPU 使用情况


Node.js 是基于 Chrome 的 V8 引擎，V8 暴露了一些 profiler API 用来分析 CPU 的使用情况



#### 创建测试代码

```js
const profiler = require('v8-profiler')
const crypto = require('crypto')
const express = require('express')
const fs = require('fs')

const app = express()
const users = {}


app.get('/newUser', (req, res) => {
    const name = req.query.name || 'test'
    const password = req.query.password || 'test'

    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    users[name] = { salt, hash }
    res.end('创建成功')

})

app.get('/profiler', (req, res) => {
    // 开始记录
    profiler.startProfiling('CPU profiler')

    // 30 秒后停止记录，并且导出记录结果
    setTimeout(() => {
        const profile = profiler.stopProfiling()
        profile.export()
            .pipe(fs.createWriteStream('./profile.cpuprofile'))
            .on('finish', () => {
                profile.delete()
            }
            )
    }, 30 * 1000)
})

app.listen(8001)
```

在 `/newUser` get 请求里面使用 `crypto.pbkdf2Sync` 同步方法获取 hash 值，进行 CPU 密集型计算

`/profiler` 请求中开始记录 CPU 运算，30 秒后停止记录，并将记录的数据导出至当前目录下的 `profile.cpuprofile` 文件



#### 记录 CPU 使用情况
启用 web 服务，并开始记录 CPU 使用

```bash
$ node index.js &
$ curl http://localhost:8001/profiler
```
在另一个终端进行 ab 压测触发 CPU 密集计算

```bash
$ ab -c 20 -n 2000 'http://localhost:8001/newUser'
```

最后生成的 `profile.cpuprofile` 文件中记录了函数调用栈、路径、时间戳和一些其他信息

```bash
$ ll
400K -rw-rw-r--   1 chao chao 399K Aug 10 18:20 profile.cpuprofile
```



#### 使用 Chrome DevTools 可视化数据

Chrome 自带了分析 CPU profile 日志的工具

打开 Chrome 开发工具，选择 Javascript Profiler 面板，点击 Load 加载

![](https://s2.ax1x.com/2019/08/10/eOTV3j.png)


选择 profile.cpuprofile 文件加载

![](https://s2.ax1x.com/2019/08/10/eOLxgg.png)



2019-08-11 更新

---

在左上角的菜单中可以选择三种查看模式

![](https://s2.ax1x.com/2019/08/11/ev1JqU.md.png)

- Chart 显示按时间顺序排列的火焰图
- Heavy(Botton Up) 按照函数对性能的影响排列，同时可以查看函数的调用路径
- Tree(Top Down) 显示调用结构的总体状况，从调用堆栈的顶端开始


选择 Tree(Top Down) 模式，可以看的有下面三列
- Self Time 函数调用所耗费的时间，仅包含函数本身的声明，不包括任何子函数的执行时间
- Total Time 函数调用所耗费的总时间，包含本身的函数声明及所以子函数的执行时间
- Function 函数名及路径，可展开查看子函数

![](https://s2.ax1x.com/2019/08/11/evdQTx.png)
从图中可以看到 parserOnHeadersComplete 函数占据了绝大部分的 CPU 时间

逐级展开后定位到最终 crypto 的 pbkdf2Sync 方法

![](https://s2.ax1x.com/2019/08/11/ev0lRO.png)




#### 使用火焰图来展示 cpuprofile 数据

全局安装 flamegraph

```bash
$ sudo npm install -g flamegraph
```

将 cpuprofile 文件生成 svg 文件

```bash
$ flamegraph -t cpuprofile -f profile.cpuprofile -o profile.svg
```

![](https://s2.ax1x.com/2019/08/11/evDkDJ.png)

同样能够定位到 pbkdf2 占据了绝大部分的 CPU 时间




#### 使用 v8-analytics 分析 CPU 使用

v8-analytics 是 Node.js 社区开源的一个解析 v8-profiler 和 heapdump 等模块生成的 CPU 和 heap-memory日志工具，具有以下功能：

- 将 V8 引擎逆优化或者优化失败的函数标红展示，并显示优化失败的结果
- 在函数执行时长超过预期时标红展示
- 展示当前项目中可疑的内存泄露点

安装 v8-analytics
```bash
$ npm install -g v8-analytics
```

使用 v8-analytics 查看执行时间大于 50 ms的函数

```bash
$ va timeout profile.cpuprofile 50 --only
Function Execute Time > 50ms List:
1. (idle) (416.7ms 1.39%) 
2. (idle) (855.3ms 2.85%) 
3. parserOnHeadersComplete (61.4ms 0.20%) (_http_common.js 71)
4. parserOnIncoming (61.4ms 100.00%) (_http_server.js 644)
5. emit (61.4ms 100.00%) (events.js 149)
6. app (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/express.js 38)
7. handle (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/application.js 158)
8. handle (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/index.js 136)
9. next (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/index.js 176)
10. process_params (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/index.js 327)
11. anonymous (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/index.js 275)
12. trim_prefix (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/index.js 288)
13. handle (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/layer.js 86)
14. query (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/middleware/query.js 39)
15. expressInit (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/middleware/init.js 29)
16. dispatch (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/route.js 98)
17. next (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/node_modules/express/lib/router/route.js 114)
18. anonymous (61.4ms 100.00%) (/Users/chao/workspace/node/node-demo/perf-demo/v8-pf.js 10)
19. pbkdf2Sync (61.4ms 100.00%) (internal/crypto/pbkdf2.js 44)
20. handleError (61.4ms 100.00%) (internal/crypto/pbkdf2.js 74)
21. pbkdf2 (61.4ms 100.00%) 
```

依然可以定位到 pbkdf2 函数