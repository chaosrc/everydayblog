---
title: Node.js 内存调试之 gcore 与 llnode
date: 2019-08-13
---

## Node.js 内存调试之 gcore 与 llnode



内存泄露是 Node.js 常见的问题之一，不当的全局缓存、事件监听、闭包等都可能导致内存泄露，如何检测、定位内存泄露是非常重要的话题



#### 什么是 Core Dump

当程序在运行过程中异常终止或者崩溃时，操作系统将会将程序当时的内存状态记录下来，并保存在一个文件中，这种行为就叫 Core Dump。Core Dump 不仅会保存内存信息，也会保存寄存器信息、内存管理信息、其他处理器以及操作系统状态信息等，对于程序的诊断和调试非常有帮助，当程序出错后 Core Dump 可以再现出错时的场景

linux 中通过 `ulimit -c` 查看允许生成的 Core Dump 文件大小如为 0，则 Core Dump 为关闭状态，使用 `ulimit -c unlimited` 命令开启并不限制 Core Dump 生成文件的大小

```bash
$ ulimit -c
0
$ ulimit -c unlimited
$ ulimit -c
unlimited
```

上面的命令只在当前终端生效，如果想要永久生效需要修改 /etc/security/limits.conf 中修改




#### gcore

gcore 命令可以在不重启程序的情况下生成指定进程的 Core Dump

```bash
$ gcore [-o filename] pid
```

pid 指定程序的进程 id，当程序发生 Core Dump 时，默认会在执行 gcore 命名的目录下生成 core.<pid> 文件 或者 -o 参数指定的文件名的文件




#### llnode

lldb 是一个高性能调试器，而 llnode 是 lldb 的一个插件，用来调试 Node.js

安装 llnode 和 lldb [^1]

```bash
$ sudo apt install lldb-4.0 liblldb-4.0-dev
$ npm install -g llnode
```



#### 测试 Core Dump

```js
// 文件： index.js
const leaks = []

class LeakClass {
    constructor() {
        this.name = Math.random().toString(36)
        this.age = Math.random() * 100
    }
}

setInterval(() => {
    for (let i = 0; i < 100; i++) {
        leaks.push(new LeakClass())
    }
    console.warn('Leaks: %d', leaks.length)
}, 1000)
```

上面是一个使用全局变量做缓存导致内存泄露的例子

运行
```bash
$ node index.js
```

等待几秒后运行 gcore

```bash
$ gcore -o core_file `pgrep -n node`
```

生成 Core Dump 文件 core_file



下一步将会分析生成的 Core Dump 文件






[^1]: https://github.com/nodejs/llnode




