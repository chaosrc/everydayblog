---
title: Node.js 内存调试之 heapdump
date: 2019-08-15
---

## Node.js 内存调试之 heapdump



heapdump 是一个 dump V8 堆信息的工具，前面提到的 v8-profiler 也有堆信息的功能，这两个工具的原理是一样的，但是 heapdump 更简单一点



#### 使用 heapdump

首先创建一段内存泄露的测试代码

```js
const heapdump = require('heapdump')

let leakObject = null
let count = 0


setInterval(() => {
    let originLeak = leakObject

    const unused = () => {
        if(originLeak) {
            console.log('originLeak', originLeak)
        }
    }

    leakObject = {
        count: count++,
        leakString: new Array(1e7).join('*'),
        leakMethod: () => {
            console.log('leak message')
        }
    }
}, 1000)
```

这是一段经典的内存泄露测试代码，内存泄露的原因是：在 setInterval 的回调方法中有两个闭包一个是 unused 方法，一个是 leakMethod 方法。unused 方法中引用了全局的 originLeak 变量，如果没有后面的 leakMethod 方法，则在函数执行完成后 unused 将会被销毁，闭包作用域被销毁，不会产生内存泄露，因为后面的 leakMethod 被全局的 leakObject 引用，leakMethod 形成的闭包作用域引用了 unused 从而引用了 originLeak 变量，导致 originLeak 不能被销毁，随着 setInterval 的不断被调用形成闭包链，导致所有的 leakObject 都不能被销毁，最终导致内存泄露


运行测试代码

```bash
$ node leaks.js
```

执行两次下面的命令

```bash
$ kill -USR2 `grep -n node`
```

生成两个 heapsnapshot 文件
```bash
$ ls
heapdump-165258801.171380.heapsnapshot  index.js
heapdump-165267934.430.heapsnapshot     leaks.js
```



#### 使用 Chrome DevTools 分析 heapsnapshot 文件

打开 Chrome DevTool 选择 memory 面板，点击 load 加载 heapsnapshot 文件

![](https://s2.ax1x.com/2019/08/15/mVhwn0.png)


两个文件都 load 后，在左上角可以看到 4 个下拉选项

![](https://s2.ax1x.com/2019/08/16/mV4VbV.png)

- Summary: 以构造函数名分类显示
- Comparison: 比较多个快照之间的差异
- Containment: 查看整个 GC 路径
- Statistics: 以饼状图形式显示内存占用信息

最常用的是 Summary 和 Comparison



选择 Summary 进行查看

- Constructor： 构造函数名，加括号的表示是内置的。构造函数名后面的 x 加数字，表示对象的个数
- Distance: 指到 GC 根对象（root）的距离，指到 GC 根对象在浏览器中一般是 window 对象，在 node.js 中一般为 global 对象。距离越大说明引用越深
- Shallow Size: 指对象自身的大小，不包括他引用对象的大小
- Retained Size: 指对象自身的大小和它引用的对象的大小，即该对象被 GC 之后能回收的大小


点击 Retained Size 进行降序排列，展开 closure 这一项，可以看到 leakMethod，再继续展开 leakMethod，可以看到对 originLeak 的引用，而 originLeak 又继续引用了上一个 leakMethod 

![](https://s2.ax1x.com/2019/08/16/mVIT4U.png)





