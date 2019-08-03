---
title: Node.js 程序的运维与部署
date: 2019-08-02
---




## Node.js 程序的运维与部署




每一种 web 技术都有各种增强稳定性和提供性能的技巧，Node.js 也不例外。web 程序如何部署，如何选择部署环境，如何保证在线时长也是一个至关重要的




#### 安置 Node.js 程序

可靠和可扩展的运行 Node.js 的三种方式：
- 平台即服务（PaaS） -- 在 Amoazon、Azure 等平台上运行
- 服务器或虚拟主机 -- 在云上、私有主机或者公司内部的服务器上运行
- 容器 -- 在 Docker 容器中运行

在 PaaS 服务上运行相对比较容易，只需要注册相应的账号，创建程序，然后推送代码，基本上是即插即用的

在服务器上安装定制化比较高，可以安装自己想要的服务，比如 HTTP 服务器、缓存层、日志软件等，但是需要自己管理，对 DevOps 等有要求

容器可以看作是程序部署自动化的 OS 虚拟技术，可以将程序定义为镜像，方便的组合多个程序，将程序容器化后，用一条命令就可以带起一个新实例



#### 保证 Node.js 不掉线

如果使用 ssh 在服务器上直接运行 Node.js，退出 ssh 后 Node.js 就会停止运行。使用 Forever 工具可以保证程序不会停止运行，而且如果程序崩溃，Forever 还会重启程序

- 安装 Forever

```bash
$ npm install -g forever
```

- 使用 Forever 启动程序
```bash
$ forver start server.js
```

- 停止程序
```bash
$ forver stop server.js
```

- 列出所有管理程序
```bash
$ forvever list
```

- 源码发生改变是自动重启
```bash
$ forvever -w start server.js
```




#### 使用 Upstart 保证在线时长

Upstart 可以优雅第管理所有 Linux 程序的启动和关停。CentOS 和 Ubuntu 的现代版本都支持 Upstart

- 安装

CentOS
```bash
$ sudo yun install upstart
```

Ubuntu
```bash
$ sudo apt install upstart
```

安装好后需要给每个程序添加一个 Upstart 配置文件，并放在 /etc/init 目录下

```

author  'chao'
description: '描述'

start on runlevel [2345]
stop on runlevel [06]

respawn
respawn limit 15 5

console log
env NODE_ENV=production
exec /usr/bing/node server.js

```

respaw 配置程序在崩溃后需要重启的次数
、以及间隔时间

再使用 exec 命令运行程序

Upstart 可配置化很高，功能强大，，深入了解可以参考官网文档








