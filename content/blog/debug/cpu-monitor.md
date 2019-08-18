---
title: Node.js 内存调试之 cpu-memory-monitor
date: 2019-08-17
desciption: 使用 cpu-memory-monitor 来监控 CPU 和 Memory 的使用情况，并根据配置策略自动生成 dump 文件
---


## Node.js 内存调试之 cpu-memory-monitor



前面介绍了用 heapdump 和 memwatch-next 来调试内存，但是它们需要手动触发 Core Dump，在实际使用时并不知道什么时候去触发，而 cpu-memory-monitor 可以用来监控 CPU 和 Memory 的使用情况，可以根据配置策略自动 dump CPU 的使用情况（Cpuprofile）和内存快照 （Heapsnapshot)




#### 安装 cpu-memory-monitor

```bash
$ npm i cpu-memory-monitor
```



####  使用 cpu-memory-monitor

cpu-memory-monitor 的使用很简单，在程序入口文件中引入，配置 CPU 和 Memory 的 dump 策略

```js
const Monitor = require('cpu-memory-monitor')

Monitor({
    cpu: {
        interval: 1000,
        duration: 30000,
        threshold: 60,
        profileDir: '/tmp',
        counter: 3,
        limiter: [5, 'hour']
    }
})
```

以上代码的作用是： 每 1000 ms（interval）检查一次 CPU 的使用情况，如果发现连续 3 次 （counter）CPU 的使用情况大于 60%（threshold）则 dump 30000 ms（duration） 的 CPU 使用情况并在 /tmp（profileDir）目录下生成 `cpu-${process.pid}-${Date.now()}.cpuprofle` 文件，每小时最多 dump 5 次（limiter）

上面是 CPU 的配置，Memory 的配置也相似，不同点在于 Memory 没有 duration 配置，因为内存快照是某一时刻的而不是一段时间的，另外 threshold 是最大的内存使用比如 '2gb'，最后生成的文件是内存快照 `cpu-${process.pid}-${Date.now()}.heapsnapshot`

```js
const Monitor = require('cpu-memory-monitor')

Monitor({
    memory: {
        interval: 1000,
        threshold: '2.5gb',
        profileDir: '/tmp',
        counter: 3,
        limiter: [5, 'hour']
    }
})
```

需要注意的是**不要将 CPU 和 Memory 配置一起使用**，因为可能出现的情况是：首先，内存增加到达了设定的阀值，触发 Memory Dump 和 GC，导致 CPU 使用率增加而达到 CPU 的设定阀值，触发 CPU Dump，再导致内存堆积请求过多而再次触发 Memory Dump，最后导致雪崩



#### cpu-memory-monitor 的实现原理

cpu-memory-monitor 库很精简，源代码只有 100 多行。


```js
...
const heapdump = require('heapdump')
const profiler = require('v8-profiler')
const memwatch = require('memwatch-next')
...

function dumpCpu (cpuProfileDir, cpuDuration) {
  profiler.startProfiling()
  processing.cpu = true
  setTimeout(() => {
    const profile = profiler.stopProfiling()
    const filepath = genProfilePath(cpuProfileDir, 'cpu', 'cpuprofile')
    ...
  }, cpuDuration)
}

function dumpMemory (memProfileDir, isLeak = false) {
  ...
  heapdump.writeSnapshot(filepath, (error, filename) => {
    ...
    console.log(`heapsnapshot dump success: ${filename}`)
  })
}

module.exports = function cpuMemoryMonitor (options = {}) {
  ...

  if (options.cpu) {
    const cpuTimer = setInterval(() => {
      ...
      pusage.stat(process.pid, (err, stat) => {
        ...
        if (stat.cpu > cpuThreshold) {
            ...
              if (remaining > -1) {
                dumpCpu(cpuProfileDir, cpuDuration)
                counter.cpu = 0
              }
            ...
        } else {
          counter.cpu = 0
        }
      })
    }, cpuInterval)
  }

  if (options.memory) {
    const memTimer = setInterval(() => {
      ...
      pusage.stat(process.pid, (err, stat) => {
        ...
        if (stat.memory > memThreshold) {
            ...
              if (remaining > -1) {
                dumpMemory(memProfileDir)
                counter.memory = 0
              }
            ...
        } else {
          counter.memory = 0
        }
      })
    }, memInterval)

    memwatch.on('leak', (info) => {
      console.warn('memory leak: %j', info)
      dumpMemory(memProfileDir, true)
    })
  }
}
```

可以看到核心的 dumpCpu 和 dumpMemory 方法分别使用了 v8-profiler 和 heapdump，以及结合 memwtach-next 监测内存泄露



