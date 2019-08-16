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


运行 lldb

```bash
$ lldb-4.0 -c core.1070
(lldb) 
```

此时 llnode 还不能使用，需要加载 llnode 插件到 lldb 中




#### 加载 llnode 插件

- 使用 llnode 命令

  通过全局安装 llnode（npm install -g llnode）后，使用 llnode 命令会启动 lldb 并且自动加载 llnode 插件，所有 llnode 的参数都会传给 lldb

- 使用 ~/.lldbinit 加载

  在 ~/.lldbinit 中添加 plugin load 命令，lldb 在启动是会自动加载插件
  ```
  plugin load /path/to/the/llnode/plugin
  ```

- 手动加载 llnode 插件

  运行 lldb 后，使用 plugin load 命令加载
  ```bash
  $ lldb-4.0 -c core.10706 
  (lldb) target create --core "core.10706"
  Core file '/home/chao/workspace/core-dump/core.10706' (x86_64) was loaded.
  (lldb) plugin load /path/llnode/llnode.so
  ```




#### 使用 llnode 分析 Core 文件


成功加载 llnode 后，运行 `v8 help` 查看命令选项

```bash
$ llnode -c core.10706 
(lldb) target create --core "core.10706"
Core file '/home/chao/workspace/core-dump/core.10706' (x86_64) was loaded.
(lldb) plugin load '/home/chao/software/node/lib/node_modules/llnode/llnode.so'
(lldb) settings set prompt '(llnode) '
(llnode)  v8 help
     Node.js helpers

Syntax: 

The following subcommands are supported:

      bt                -- Show a backtrace with node.js JavaScript functions
                           and their args. An optional argument is accepted; if
                           that argument is a number, it specifies the number
                           of frames to display. Otherwise all frames will be
                           dumped.
                           Syntax: v8 bt [number]
      findjsinstances   -- List every object with the specified type
                           name.
                           Flags:
...
```



运行 v8 findjsobjects 查看所有对象的实例以及总共占用的内存大小

```bash
(llnode) v8 findjsobjects
 Instances  Total Size Name
 ---------- ---------- ----
          1         24 AssertionError
          1         24 AsyncResource
          1         24 FastBuffer
          1         24 Loader
          ...
          3        280 AsyncHook
         12        384 ContextifyScript
         12        712 TickObject
         14       1120 (ArrayBufferView)
         55       3520 NativeModule
        339      10848 (Array)
        647      36584 Object
       1101      44024 LeakClass
       7855      41008 (String)
 ---------- ---------- 
      10099     142656 
```
可以看到 LeakClass 实例有 1101 个 占用来 44024 Byte内存



运行 v8 findjsinstances 查看类的所有实例

```bash
(llnode) v8 findjsinstances LeakClass
0x19e5b993ce91:<Object: LeakClass>
0x19e5b993ce11:<Object: LeakClass>
0x19e5b993cd91:<Object: LeakClass>
0x19e5b993cd11:<Object: LeakClass>
0x19e5b993cc91:<Object: LeakClass>
0x19e5b993cc11:<Object: LeakClass>
0x19e5b993cb91:<Object: LeakClass>
0x19e5b993cb11:<Object: LeakClass>
...
```



运行 v8 i 或 v8 inspect 查看实例的具体内容
```bash
(llnode) v8 i 0x19e5b993ce91
0x19e5b993ce91:<Object: LeakClass properties {
    .name=0x19e5b993cec9:<String: "0.hu7sgkclxh">,
    .age=3.357192}>
```
可以看到 0x19e5b993ce91 实例的两个属性 name 和 age ，以及它们的值



运行 v8 findrefs 查看引用

```bash
(llnode) v8 findrefs 0x19e5b993ce91
0x19e5b9911a21: (Array)[999]=0x19e5b993ce91
(llnode) v8 i 0x19e5b9911a21
0x19e5b9911a21:<Array: length=1289 {
    [0]=0x19e5b9913091:<Object: LeakClass>,
    [1]=0x19e5b9913271:<Object: LeakClass>,
    [2]=0x19e5b9913359:<Object: LeakClass>,
    ...
```
实例 0x19e5b993ce91 的引用是一个数组里面有 1289 个 LeakClass 实例，也就是代码里面 leaks 数组















[^1]: https://github.com/nodejs/llnode




