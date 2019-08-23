---
title: 使用 Chrome DevTools 调试 Node.js 程序
date: 2019-08-22
---


## 使用 Chrome DevTools 调试 Node.js 程序




代码调试是程序员的必备技能，选择适合的工具能够极大的提高调试的效率。

Node.js 6.3 及以上版本内置了一个调试器，可以结合 Chrome DevTools 使用来调试代码。





#### 创建测试代码

```js
const Koa = require('koa')

const app = new Koa()

app.use(async (ctx) => {
    ctx.body = "Hello World"
})

app.listen(8000)
```

上面的代码使用 koa 创建一个简单 web 服务，监听 8000 端口




#### 使用 Chrome DevTools

在运行程序时加上 `--inspect` 和 `--inspect-brk` 参数开启 debug 模式，两者的区别是使用`--inspect-brk` 会在程序第一行就暂停执行

运行程序
```bash
$ node --inspect index.js 
Debugger listening on ws://127.0.0.1:9229/286e1f8b-00a1-4fd9-8bca-a67a4e74cdc8
For help, see: https://nodejs.org/en/docs/inspector

```

打开 chrome，访问 chrome://inspect

![](https://s2.ax1x.com/2019/08/22/mBSuGV.png)

在 Romote Target 下面会列出所有可以调试的程序，点击对应的 inspect 按钮可以打开调试工具

![](https://s2.ax1x.com/2019/08/22/mBSK2T.png)

可以看到我们上面写的测试代码，点击左边的行数添加断点

![](https://s2.ax1x.com/2019/08/22/mBSe5q.png)

访问刚刚启动的程序
```bash
$ curl localhost:8000
```

可以看到程序暂停到断点出并且可以查看当前上下文下的变量信息，debugger 工具栏还有单步执行、单步进入等常见的 deug 功能

![](https://s2.ax1x.com/2019/08/22/mBSnP0.png)




#### 使用 process._debugProcess

通常情况下我们启动了一个 Node.js 程序但是没有添加 `--inspect` 或 `--inspect-brk`，那么必须重启程序并添加参数，使用 _debugProcess 可以在不重启的情况下进入 debug 模式


首先常规运行程序
```bash
$ node  index.js 
```

获取程序的 pid

```bash
$ pgrep -n node
91771
```

运行 _debugProcess

```bash
$ node -e "process._debugProcess(91771)"
```
_debugProcess 方法中传人的参数为需要以 debug 模式运行程序的 pid




打开 chrome 进行调试

![](https://s2.ax1x.com/2019/08/23/mB9DUA.png)


