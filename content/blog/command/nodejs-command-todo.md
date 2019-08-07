---
title: 使用 Node.js 编写命令行程序（二）
date: 2019-08-06
---

## 使用 Node.js 创建 Todo 命令行程序



完成一个命令行小程序，具有以下功能：

- todo new        创建一个 todo
- todo get        获取 todo 列表
- todo complete   完成一个 todo
- todo help       获取帮助


使用到的依赖：
- lowdb      用来储存 todo 列表
- chalk      打印带有样式的字符
- yargs      命令行参数校验
- readline   读取用户输入



#### 使用 yargs 校验参数

```js
const yargs = require('yargs')
const chalk = require('chalk')
const rl = require('readline')

const argv = yargs
.scriptName('todo')
.usage('todo <command>')
.help('help')
.describe('help', '获取帮助')
.command('new', '创建一个 todo')
.command('get', '获取 todo 列表')
.command('complete', '完成一个 todo')
.argv

function errorLog(error) {
    const text = chalk.red(error)
    console.log(text)
}

const commands = ['new', 'get', 'complete', 'help']

if (!commands.some(cmd => argv[cmd])) {
    errorLog('参数无效')
    yargs.showHelp()
    return
}
```
scriptName() 定义命令行程序的名字，usage() 定义如何使用命令， help() 定义显示帮助的参数。如果输入的命令不在定义范围里面则提示‘参数无效’，并且显示帮助信息


运行 ./todo  --help

```bash
$ ./todo  --help
todo <command>

Commands:
  todo new       创建一个 todo
  todo get       获取 todo 列表
  todo complete  完成一个 todo

Options:
  --version  Show version number
  --help     获取帮助 
```



#### 根据命令参数执行程序逻辑
```js

function run(cmd) {
    switch (cmd) {
        case '--new':
            newTodo()
            break;
        case '--get':
            getTodo()
            break;
        case '--complete':
            completeTodo()
            break;
        default:
            errorLog('参数无效')
            yargs.showHelp()
    }
}
run(process.argv[2])
```
根据不同的传人参数执行相应的逻辑


- 创建 todo

定义 prompt 提示用户输入
```js
function prompt(question) {
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    })
    return new Promise((resove, reject) => {
        r.question(question, (answer) => {
            r.close()
            resove(answer)
        })
    })
}
```

添加 newTodo 方法

```js
async function newTodo() {
    const text = chalk.blue('输入待办事项\n')
    const td = await prompt(text)
    console.log(td)
}
```

运行 todo --new

![](https://s2.ax1x.com/2019/08/07/e4tx6s.png)



(未完待续...)




