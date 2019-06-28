---
title: Node.js异步编程之事件监听
date: 2019-06-27
description: 在 Node.js 中通过在事件发射器(EventEmitter)中绑定事件监听函数来处理重复性事件。一些 Node.js 中的重要组件比如 HTTP、TCP 以及流模块都被做成了事件发射器。也可以定义自己的事件发射器。
---

### Node.js 异步编程之事件监听



在 Node.js 中通过在事件发射器(EventEmitter)中绑定事件监听函数来处理重复性事件。一些 Node.js 中的重要组件比如 HTTP、TCP 以及流模块都被做成了事件发射器。也可以定义自己的事件发射器。

#### 使用 net 模块来创建一个基于 TCP socket 的 echo 服务器

引人 net 模块并监听 data 事件

```javascript
// 文件index.js

// 引入net模块
const net = require("net")

const server = net.createServer(socket => {
  //监听data事件
  socket.on("data", handleDataReceive)

  //处理data事件的方法
  function handleDataReceive(data) {
    socket.write(`server: ${data.toString()}`)
  }
})

server.listen(8801)
```

socket 是一个事件发射器，当用户发送数据时会触发`socket`的`data`事件，在data事件中注册了函数`handleDataReceive`来处理`data`事件

运行
```bash
$ node index.js
```
使用telnet连接
```bash
$ telnet localhost 8801
Trying ::1...
Connected to localhost.
Escape character is '^]'.
hello
server: hello
who are you
server: who are you
```
telnet将数据发送给服务器，服务器处理后传回给telnet

#### 自定义一个事件发射器


实现一个简单的聊天服务器具有以下功能：
- 加入功能，当用户连接服务器时加入聊天频道
- 广播功能，用户发送信息时会广播给所有已加入的用户
- 用户离开时从频道中移除

自定义事件发射器channel，注册`join`、`broadcast`以及`close`事件，clients用来保存每次连接的socket，subscription用来保存`broadcast`的监听方法以便于`close`时移除监听
```javascript
const net = require('net')
const Emitter = require('events').EventEmitter

const channel = new Emitter()

channel.clients = {}
channel.subscription = {}

// 添加join事件
channel.on('join', function(id, socket) {
    this.clients[id] = socket
    this.subscription[id] = (sendId, data) => {
        if (sendId !== id) {
            socket.write(data)
        }
    }
    // 添加广播事件
    this.on('broadcast', this.subscription[id])
    // 添加关闭事件
    this.on('close', function(id) {
        this.off('broadcast', this.subscription[id])
    })
})

```

建立TCP socket连接给`channel`发送事件
```javascript
...
const server = net.createServer(socket => {
    const id = `${socket.remoteAddress}:${socket.remotePort}`
    channel.emit('join', id, socket)
    socket.on('data', data => {
        channel.emit('broadcast', id, data)
    })
    socket.on('close', () => {
        channel.emit('close', id)
    })

})

server.listen(8802)

```

运行，并使用多个窗口通过telnet连接服务器
![](https://s2.ax1x.com/2019/06/28/ZuLPF1.png)

gif
![gif](https://s2.ax1x.com/2019/06/28/ZuqjQU.gif)

