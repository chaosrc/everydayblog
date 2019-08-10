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

const commands = ['new', 'get', 'complete', 'delete', 'help']

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
        case '--delete':
            deleteTodo(argv['delete'])
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




2019-08-07 更新

---

创建数据库，保存 todo 数据

```js
...
const lowdb = require('lowdb')
const FileSystem = require('lowdb/adapters/FileSync')
const adapter = new FileSystem('db.json')
const db =  lowdb(adapter)
db.defaults({todos: []}).write()
...

async function newTodo() {
    const text = chalk.blue('输入待办事项\n')
    const td = await prompt(text)
    db.get('todos')
      .push({ title: td, complete: false })
      .write()
}

```
使用 lowdb 创建数据库并保存在 db.json 文件中，创建 todo 时 通过 db 保存新的 todo


- 获取 todo 列表

```js
async function getTodo() {
    const todos = db.get('todos').value()
    todos.forEach((todo,i) => {
        if(todo.complete) {
            text+= chalk.blue('√')
        }
        console.log(text)
    })
}
```

从 db 中获取 todo 列表输出到终端，如果已经完成则添加一个'√'


- 完成 todo 

```js
async function completeTodo() {
    getTodo()
    let num = await prompt('请选择已完成事项\n')
    if (!Number.isInteger(Number(num))) {
        console.log('参数无效')
    } else {
        db.set(`todos[${num - 1}].complete`, true).write()
    }
}
```
先输出所有的 todo 列表，然后提示用户输入完成的 todo，将完成的 todo 状态保存在 db 中


- 删除 todo

```js
async function deleteTodo(num) {
    if (!Number.isInteger(num)) {
        getTodo()
        num = await prompt('请选择已完成事项\n')
    }
    if (!Number.isInteger(Number(num))) {
        console.log('参数无效')
    } else {
        const todos = db.get('todos').splice(num - 1, 1)
        const deleteTitle = todos.value()[0].title
        todos.write()
        console.log(chalk.red('删除: ') + deleteTitle)
    }

}
```

删除有两种方式，一是通过 `todo --delete number` 通过 --delete 后面的参数值来删除对应的 todo，如果没有 输入 number 值则使用第二种方式，输入所有 todo 列表，提示输入需要删除的项，进行删除


运行整个流程

创建 todo
```bash
$ ./todo  --new
输入待办事项
吃饭
$ ./todo  --new
输入待办事项
睡觉
```

列出 todo
```bash
$ ./todo  --get
1. 吃饭
2. 睡觉
```

完成 todo
```bash
$ ./todo  --complete
1. 吃饭
2. 睡觉
请选择已完成事项
1
$ ./todo  --get
1. 吃饭√
2. 睡觉
```












