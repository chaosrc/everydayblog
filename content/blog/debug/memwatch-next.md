---
title: Node.js 内存调试之 memwatch-next
date: 2019-08-16
descript: 使用 memwtach-next 来监测内存泄露和比较堆信息
---

## Node.js 内存调试之 memwatch-next


memwatch-next 是一个用来监测内存泄露和比较堆信息的模块，下面介绍如何使用 memwatch-next



#### 创建测试代码

```js
const memwatch = require('memwatch-next')
const http = require('http')

let count = 0

memwatch.on('stats', (stats) => {
    console.log(count++, stats)
})
memwatch.on('leak', (info) => {
    console.log('---')
    console.log(info)
    console.log('---')
})

const server = http.createServer((req, res) => {
    for(let i = 0; i < 10000; i++) {
        server.on('request', function leakCallback() {})
    }

    req.end('Hello World')
    global.gc()
})

server.listen(3000)
```

每次请求时注册 10000 个 request 事件来引发内存泄露，然后手动触发一次 GC

使用 --expose-gc 参数来运行 Node.js 将会暴露 GC 方法，可以手动触发 GC

```bash
$ node --expose-gc index.js
```



#### memwatch 的事件

1. stats：GC 事件，每一次执行 GC 都会触发该事件并返回 heap 相关信息

```js
{ 
  num_full_gc: 1, //完整的垃圾回收次数
  num_inc_gc: 1, // 增长的垃圾回收次数
  heap_compactions: 1, // 内存压缩次数
  usage_trend: 0, // 使用趋势
  estimated_base: 5796560, // 预期基数
  current_base: 5796560, // 当前基数
  min: 0, // 最小值
  max: 0 // 最大值
}
```

2. leak：为可疑的内存泄露事件，触发该事件的条件是内存在连续 5 次 GC 后都是增长的

```js
{ 
  growth: 3563080,
  reason: 'heap growth over 5 consecutive GCs (0s) - -2147483648 bytes/hr'
}
```


运行

```bash
$ node --expose-gc leaks2.js 
(node:24921) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 request listeners added. Use emitter.setMaxListeners() to increase limit
0 { num_full_gc: 1,
  num_inc_gc: 1,
  heap_compactions: 1,
  usage_trend: 0,
  estimated_base: 5796560,
  current_base: 5796560,
  min: 0,
  max: 0 }
1 { num_full_gc: 2,
  num_inc_gc: 2,
  heap_compactions: 2,
  usage_trend: 0,
  estimated_base: 6722656,
  current_base: 6722656,
  min: 0,
  max: 0 }
2 { num_full_gc: 3,
  num_inc_gc: 3,
  heap_compactions: 3,
  usage_trend: 0,
  estimated_base: 7635344,
  current_base: 7635344,
  min: 7635344,
  max: 7635344 }
3 { num_full_gc: 4,
  num_inc_gc: 5,
  heap_compactions: 4,
  usage_trend: 0,
  estimated_base: 8536880,
  current_base: 8536880,
  min: 7635344,
  max: 8536880 }
---
{ growth: 3563080,
  reason: 'heap growth over 5 consecutive GCs (0s) - -2147483648 bytes/hr' }
---
4 { num_full_gc: 5,
  num_inc_gc: 7,
  heap_compactions: 5,
  usage_trend: 0,
  estimated_base: 9359640,
  current_base: 9359640,
  min: 7635344,
  max: 9359640 }
5 { num_full_gc: 6,
  num_inc_gc: 8,
  heap_compactions: 6,
  usage_trend: 0,
  estimated_base: 9007952,
  current_base: 9007952,
  min: 7635344,
  max: 9359640 }
6 { num_full_gc: 7,
  num_inc_gc: 9,
  heap_compactions: 7,
  usage_trend: 0,
  estimated_base: 9007968,
  current_base: 9007968,
  min: 7635344,
  max: 9359640 }
```

Node.js 已经警告事件监听过多可能会导致内存泄露。连续多次 GC 后内存增长触发了 leak 事件，打印出了增长的内存数（Bytes）已经预估的每小时增长内存数




#### 使用 Heap Diff

使用 memwatch 的 HeapDiff 函数来对比两次堆快照之间的差异

```js
const memwatch = require('memwatch-next')
const http = require('http')


const server = http.createServer((req, res) => {
    for(let i = 0; i < 10000; i++) {
        server.on('request', function leakCallback() {})
    }

    res.end('Hello World')
    global.gc()
})

server.listen(3000)

const hd = new memwatch.HeapDiff()

memwatch.on('leak', (info) => {
    const diff = hd.end()

    console.dir(diff, {depth: 10})
})
```

同样的内存泄露代码，先创建 HeapDiff 对象，在 leak 事件时计算两次堆快照的差异并打印出来


运行，并使用同样的 ab 命令测试
```bash
$ node --expose-gc leaks3.js 
(node:26612) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 request listeners added. Use emitter.setMaxListeners() to increase limit
{ before: { nodes: 36946, size_bytes: 4765736, size: '4.54 mb' },
  after: { nodes: 88799, size_bytes: 9000168, size: '8.58 mb' },
  change: 
   { size_bytes: 4234432,
     size: '4.04 mb',
     freed_nodes: 876,
     allocated_nodes: 52729,
     details: 
      [ { what: 'Arguments',
          size_bytes: 32,
          size: '32 bytes',
          '+': 1,
          '-': 0 },
        { what: 'Array',
          size_bytes: 497584,
          size: '485.92 kb',
          '+': 946,
          '-': 517 },
...
```
可以看出在内存泄露之前和之后，内存由 4.54 mb 增加到了 8.58


