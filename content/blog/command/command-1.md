---
title: 使用 Node.js 编写命令行程序（—）
date: 2019-08-05
description: Node.js 命令行程序简介以及命令行参数的使用
---


## 使用 Node.js 编写命令行程序（一）



Node.js 命令行工具应用非常广泛，比如前端框架的脚手架 Angular CLI、 Vue CLI 、Create React App, 以及打包编译工具webpack、babel等，下面将介绍如何开始创建一个 Node.js 命令行程序



#### Shebang

> shebang是由脚本开头的字符数字符号和感叹号（＃！）组成的字符序列

通过 Shebang 告诉系统应该使用什么解释器来运行脚步，比如使用 sh 或 python

```bash

#!/usr/bin/env sh

#!/usr/bin/env python -c

```

同样也可以使用 Shebang 的方式来运行 Node.js 程序

```js
#!/usr/bin/env node
console.log('hello')
```

在系统中安装 Node.js 后，创建一个 hello 文件，添加上面的内容以及可执行权限

```bash
$ touch hello
$ chmod +x hello
```

运行

```bash
$ ./hello 
hello
```



#### 命令行的理念和惯例

了解现有程序的理念和惯例，有助于创建出更加方便使用的命令行程序

以 tsc 为例
```
$ tsc
Version 2.9.2
Syntax:   tsc [options] [file ...]

Examples: tsc hello.ts
          tsc --outFile file.js file.ts
          tsc @args.txt

Options:
 -h, --help          Print this message.
 --all               Show all compiler options.
 -v, --version       Print the compiler's version.
--init               Initializes a TypeScript project and creates a tsconfig.json file.
 -w, --watch         Watch input files.
```

通过 -h 和 --help 输出帮助信息，使用 -v 和 --version 来输出版本信息，这些都是一些通用的惯例

使用 --init 来创建新的项目

使用 -w 或者 --watch 来监听文件的变化

通过了解现有的一些命令行程序，能够学习到很多命令行程序的设计理念



注：tsc 是 Typescript 编译器





#### 使用命令行参数

命令行程序大多数都会接受参数，在 Node.js 中可以通过 process.argv 来获取

创建 argvs 文件
```js
#!/usr/bin/env node

console.log(process.argv)
```

运行

```bash
$ ./argv -a 1 -b 2
[
  '/usr/local/bin/node',
  '/Users/chao/workspace/node/node-demo/command-demo/argvs',
  '-a',
  '1',
  '-b',
  '2'
]
```

process.argv 返回的是一个包含命令行参数的数组，第一个参数是 Node.js 程序的路径，第二个参数 JavaScript 执行文件的路径，后面是执行是传人的参数







