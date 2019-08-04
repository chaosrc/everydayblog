---
title: Node.js 的 集群（Cluster） 和 线程（Worker Threads）
date: 2019-08-03
---


## Node.js 的 集群（Cluster） 和 线程（Worker Threads）



Node.js 是天生的单线程运行模式，运行在单核 CPU 上，而现代计算机基本都是多核的 CPU。Node.js 提供了两种方式来充分利用多核 CPU： 集群（Cluster） 和 线程（Worker Threads）



#### 集群（Cluster）

Cluster 可给一个程序创建多个工作进程，在不同的内核上运行同一个副本，每个工作进程都共享同一个 TCP/IP 端口。下图是 Custer 运行在4核 CPU 上

![](https://s2.ax1x.com/2019/08/03/erYuqI.png)

一个 Master 主进程核三个工作进程


- 使用 Cluster

在 server.js 文件中创建一个 web 服务
```js
const http = require('http')

function start() {
    const server = http.createServer((req, res) => {
        res.writeHead(200)
        res.end('hello world\n')
    })
    
    server.listen(8000)
}

exports.start = start
```

在 index.js 中使用 Cluster 运行 web 服务

```js
const cluster = require('cluster')
const os = require('os')
const server = require('./server')

// 获取本机 CPU 数量
const numCPUs = os.cpus().length

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 开始运行`)

    // 根据 CPU 数量复刻工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    // 监听工作进程退出事件
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 退出`)
    })
} else {
    server.start()
    console.log(`工作进程 ${process.pid} 启动 `)
}
```

首先判断当前进程是否为主进程，如果是者根据 CPU 数量来复刻多个工作进程，如果不是则为工作线程，运行 web 服务


运行程序
```bash
$ node index.js 
主进程 9772 开始运行
工作进程 9773 启动 
工作进程 9774 启动 
工作进程 9775 启动 
工作进程 9776 启动
```
通过 ip 和端口访问 web 服务
```bash
$ curl localhost:8000
hello world
```

主进程和工作进程都是各自独立的系统进程，运行在各自的内核，无非共享全局变量。Cluster 提供了主进程和工作进程间通信的方法




2019-08-04 更新

---

- 进程间的通信

主进程和工作进程之间可以通过事件来传递消息。下面的代码在主进程中维护总的请求数，当有请求进来时工作线程给主进程发送消息更新总请求数，然后主进程广播给所有工作进程

```js
// 文件：index.js
const cluster = require('cluster')
const os = require('os')
const server = require('./server')

// 获取本机 CPU 数量
const numCPUs = os.cpus().length

const workers = []
let requests = 0

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 开始运行`)
    // 根据 CPU 数量复刻工作进程
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork()
        workers.push(worker)
        worker.on('message', (msg) => {
            if (msg && msg.cmd === 'inrement') {
                requests++
                broadcast(requests)
            }
            
        })
    }
    // 监听工作进程退出事件
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 退出`)
    })
} else {
    server.start()
    console.log(`工作进程 ${process.pid} 启动 `)
}

function broadcast(msg) {
    workers.forEach(worker => {
        worker.send({cmd: 'update', requests: msg})
    })
}
```
在 index.js 文件中保存所有复刻的工作进程，并监听每个工作进程的 `message` 事件，如果是 `increment` 命令则请求数加 1，再把结果广播给所有工作进程


```js
// 文件：server.js
const http = require('http')

let requests = 0

function start() {
    const server = http.createServer((req, res) => {
        res.writeHead(200)
        res.end(`工作进程 ${process.pid}: 已接受 ${requests} 次请求\n`)
        process.send({cmd: 'inrement'})
    })

    process.on('message', (msg) => {
        if (msg && msg.cmd === 'update') {
            requests = msg.requests
        }
    })
    
    server.listen(8000)
}

exports.start = start
```
在 server.js 文件即工作进程中，每次请求完成发送一个 `inrement` 命令，通知主进程记录请求。监听主进程中广播的 `update` 命令，更新总请求数量

运行
```bash
$ node index.js
主进程 18878 开始运行
工作进程 18879 启动 
工作进程 18880 启动 
工作进程 18881 启动 
工作进程 18882 启动
```
```bash
$ curl localhost:8000
工作进程 18879: 已接受 0 次请求
$ curl localhost:8000
工作进程 18880: 已接受 1 次请求
$ curl localhost:8000
工作进程 18881: 已接受 2 次请求
```



#### 线程（Worker Threads）

通过 worker_threads 模块可以使用线程来并行执行 Javascript 代码，对于运行 CPU 密集型的任务非常有用。与 Cluster 不同 worker_threads 之间可以通过 `ArrayBuffer` 或 `SharedArrayBuffer` 共享内存。

下面使用 Worker Threads 来异步执行 fibonacci 函数
```js
// 文件： async-fibonacci.js
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads')
const fibonacci = require('./fibonacci')

//判断当前是否为主线程
if(isMainThread) {
    //导出异步函数
    module.exports = function asyncFibonacci(n) {
        return new Promise((resolve, reject) => {
            // 创建 Worker 线程
            const worker = new Worker(__filename, {
                workerData: n
            })
            // 监听线程返回的结果
            worker.on('message', resolve)
            // 处理错误消息
            worker.on('error', reject)
            worker.on('exit', (code) => reject(new Error(`exit ${code}`)))
        })
    }
} else {
     const result = fibonacci(workerData)

    // 将计算结果推送到主线程
    parentPort.postMessage(result)
}
```
如果当前代码在主线程运行，则通过 `new Worker()` 以当前文件创建工作线程，并通过 `workerData` 将函数的参数传递给工作线程，然后监听 `message` 事件将计算的结果通过 Promise 返回。如果做为工作线程运行则通过 workerData 接受通过 Worker 构造器传过来的的数据，并将计算结果发送给主线程


fibonacci 函数
```js
// 文件: fibonacci.js
module.exports = function fibonacci(n) {
    if (n === 0 || n === 1) {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

分别以同步和异步的方式来运行 fibonacci 函数

```js
// 文件： index.js
const fibonacci = require('./fibonacci')
const asyncFibonacci = require('./async-fibonacci')

async function start() {
    const n = 42
    console.time('fibonacci')
    for (let i = 0; i < 4; i++) {
        fibonacci(n)
    }
    console.timeEnd('fibonacci')

    console.time('async fibonacci')
    let asyncList = []
    for (let i= 0; i < 4; i++) {
        asyncList.push(asyncFibonacci(n))
    }
    await Promise.all(asyncList)
    console.timeEnd('async fibonacci')
}

start()
```

当 n 等于 42 执行
```bash
$ node index.js 
fibonacci: 12712.866ms
async fibonacci: 8722.920ms
```

当 n 等于 20 执行
```bash
fibonacci: 2.607ms
async fibonacci: 62.558ms
```

当 n 较大的时候异步执行效率更高，当 n 较小的时候创建线程本身的开销大于计算，运行效率反而比同步低，因此线程只有在运行 CPU 密集型的任务才能发挥作用



