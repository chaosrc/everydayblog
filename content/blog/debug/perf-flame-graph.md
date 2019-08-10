---
title: 理解 perf 与 火焰图（FlameGraph）
date: 2019-08-08
---

## perf 与 火焰图（FlameGraph）


Node.js 是单线程异步的 I/O 模型，在接受到请求时并不是每个请求启动一个线程，如果有一个任务长时间占用 CPU 整个应用就会卡住，无非处理其他请求。火焰图（FlameGraph）可以将 CPU 的使用情况可视化，自观的了解到程序的性能瓶颈




#### perf

perf（perf_event 的简称）是 linux 内核自带的系统性能分析工具，能进行函数级与指令级的热点查找，常用于查找性能瓶颈以及定位热点代码。

- 安装 perf

```bash
$ uname -a
Linux chao-TOP2 4.18.0-18-generic #19~18.04.1-Ubuntu SMP Fri Apr 5 10:22:13 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux

$ sudo apt install linux-tools-common
$ sudo apt install linux-tools-4.18.0-18-generic linux-cloud-tools-4.18.0-18-generic
```
查看当前 Linux 内核版本，安装 linux-tools-common 以及对应内核版本的 tools


- 创建测试代码


```js
const crypto = require('crypto')

const express = require('express')

const app = express()
const users = {}


app.get('/newUser', (req, res) => {
    const name = req.query.name || 'test'
    const password = req.query.password || 'test'

    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    users[name] = { salt, hash }

    // res.status(204)
    res.end('创建成功')
})

app.get('/auth', (req, res) => {
    const name = req.query.name || 'test'
    const password = req.query.password || 'test'

    if (!name) {
        res.end('用户名不能为空')
        return
    }
    const user = users[name]
    if (!user) {
        res.end('用户名不存在')
        return
    }
    const salt = user.salt
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    if (user.hash === hash) {
        // res.status(204)
        res.end('登录成功')
    } else {
       res.end('密码错误')
    }
})


app.listen(8001)
```

添加 --perf_basic_prof 运行程序

```bash
$ node --perf_basic_prof index.js & 
[1] 6450
```

会生成 /tmp/perf-<PID>.map 文件

```bash
$ tail /tmp/perf-6450.map 
2b04e2de7f2a 45 LazyCompile:~emitBeforeScript internal/async_hooks.js:316
2b04e2de812a 5a LazyCompile:~validateAsyncId internal/async_hooks.js:113
2b04e2de83a2 bc LazyCompile:~pushAsyncIds internal/async_hooks.js:351
2b04e2de877a 76 LazyCompile:~_combinedTickCallback internal/process/next_tick.js:129
2b04e2de8a62 18 LazyCompile:~emitListeningNT net.js:1391
2b04e2de8bea 37 LazyCompile:~emitAfterScript internal/async_hooks.js:330
2b04e2de8dfa c6 LazyCompile:~popAsyncIds internal/async_hooks.js:364
2b04e2de919a 77 LazyCompile:~tickDone internal/process/next_tick.js:88
2b04e2de9412 12 LazyCompile:~clear internal/process/next_tick.js:42
2b04e2de95fa b8 LazyCompile:~emitPendingUnhandledRejections internal/process/promises.js:100
```

map 文件的三列依次为：16进制的符号地址、大小、符号名，perf 会尝试查找 /tmp/perf-<PID>.map 文件将16进制的符号转换为人能够读懂的符号

#### 生成火焰图

clone 火焰图工具
```bash
$ git clone https://github.com/brendangregg/FlameGraph.git ~/FlameGraph
```

使用 ab 压测
```bash
$ curl 'http://localhost:8001/newUser?name=admin&password=123456'

$ ab -k -c 10 -n 2000 'http://localhost:8001/auth?name=admin&password=123456'

```

在另一个终端中使用 perf 记录运行情况

```bash
$ sudo perf record -F 99  -p 3709 -g -- sleep 30
[ perf record: Woken up 2 times to write data ]
[ perf record: Captured and wrote 0.423 MB perf.data (1494 samples) ]
$ sudo chown root /tmp/perf-3709.map
$ sudo perf script > perf.stacks

$ ~/FlameGraph/stackcollapse-perf.pl --kernel < perf.stacks | ~/FlameGraph/flamegraph.pl --color=js --hash > flamegraph.svg

```

下面是生成的 svg 火焰图 图片

![](https://s2.ax1x.com/2019/08/09/eHeXg1.jpg)






2019-08-10更新

---


#### perf 的使用

- -F 指定采样频率
- -p 指定进程 pid
- -g 启用 call-graph 记录
- sleep 指定记录的秒数

perf record 会将记录的信息保存到当前执行目录的 perf.data 文件

perf script 将读取 perf.data 的 trace 信息写入 perf.stacks 文件




#### 火焰图的含义

运行 FlameGraph 时，使用 --color=js 指定生成 Javascript 配色的 svg，其中 green 代表 Javascript, blue 代表 Buildin, yellow 代表 C++，red 代表 System。

- 每一个小块代表一个函数在栈中的位置（即一个栈帧）
- Y 轴代表栈的深度，每个方块下面是他的祖先（即父函数）
- X 轴代表总的样例群体，从左至右并非按照时间排序，仅仅是按照字母顺序排列
- 方块的高度代表 CPU 时间，越宽代表 CPU 时间越长，或者 CPU 使用很频繁


从下面的火焰图可以看出 node::crypto::PBKDF2Request C++代码占用的大量的 CPU 时间

![](https://s2.ax1x.com/2019/08/10/eqOCuR.png)

是因为使用了 `crypto.pbkdf2Sync` 同步方法，将 pbkdf2Sync 改为异步的 pbkdf2 方法，再生成火焰图

```js
...
app.get('/auth', (req, res) => {
    ...
    const salt = user.salt
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, hash) => {
        hash = hash.toString('hex')
        if (user.hash === hash) {
            // res.status(204)
            res.end('登录成功')
        } else {
            res.end('密码错误')
        }
    })
    
})
...
```

重新生成的火焰图

![](https://s2.ax1x.com/2019/08/10/eqO858.jpg)


绿色的 Javascript 部分明显减小，是因为异步的 I/O 方式，底层使用了多线程执行






