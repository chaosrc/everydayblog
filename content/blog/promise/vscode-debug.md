---
title: 使用 Visual Studio Code 调试代码
date: 2019-08-23
---

## 使用 Visual Studio Code 调试代码



Visual Studio Code（简称 VS Code） 是一个跨平台、轻量级代码编辑器。VS Code 内置的对 Node.js 的 debug 支持，能够 debug Javascript 和 Typescript ，对于其他语言可以通过 VS Code 提供的插件来支持




#### 基本调试

1. 创建调试代码

![](https://s2.ax1x.com/2019/08/24/msBbJf.png)


2. 添加断点、运行

![](https://s2.ax1x.com/2019/08/24/mswb7t.gif)

在需要断点的行数左侧的空白处单击添加断点，在 VS Code 左侧工具栏中点击地 4 个图标打开 debug 面板，以 debug 模式运行程序

3. 调试

![](https://s2.ax1x.com/2019/08/24/msBrZR.gif)

运行 `curl localhost:8000` 访问服务，代码在断点处暂停执行可以查看代码上下文以及常规的 debug 调试，基本上覆盖了 Chrome DevTools 的所有功能




#### 调试配置

上面演示了一个 VS Code 中最基本的调试，VS Code 还提供了一个配置文件可以对调试功能进行详细的设置

![](https://s2.ax1x.com/2019/08/24/msBHFP.png)

打开 debug 面板，点击开始旁边的设置按钮选择Node.js，VS Code 会自动创建一个 launch.json 文件


![](https://s2.ax1x.com/2019/08/24/msBTot.png)


launch.json 文件用来储存调试相关的一些配置，VS Code 在启动时后读取 launch.json 来决定如何运行程序


launch.json 的常用配置选项

1. 必填字段

- type：调试器的类型，`node` 指内置的 Node.js 调试器类型，如果是其他语言比如 go 和 php，安装对应的扩展后 type 的值分别为 go 和 php

- request: 请求类型，包括 launch 和 attach。launch 是以调试模式启动程序，attach 是附加到已经启动的进程并开启调试模式。

- name：下拉选择时显示的名字

2. 通用的可选字段

- preLaunchTask: 在开始调试之前需要启动的任务，任务的名字对应 task.json (.vscode 文件夹中) 中定义的任务

- postDebugTask: 在调试结束时启动的任务，任务的名字同样是在 task.json 中定义的

- internalConsoleOptions: 控制 Debug Console 面板的显示

- serverReadyAction：可以配置调试启动时自动打开浏览器并访问指定的 URL

3. 大部分调试器支持的字段

- program: 调试器要运行的程序或者文件
- args：传递给调试程序的参数
- env：环境变量
- cwd：当前工作路径用来查找依赖或者其他文件
- port：附加到一个运行程序时的程序端口号
- address：远程调试的 IP 地址
- skipFiles：调试时需要忽略的文件比如外部依赖 node_modules




#### 远程调试

Node.js >= 4.x 以上的版本开始支持远程调试

- 在服务器上以 debug 模式运行程序

```bash
$ node --inspect=0.0.0.0:9229 index.js
```
--inspect 参数默认值是 127.0.0.1:9229 只能在本机连接，如果要使用远程 debug 模式需要将 IP 指定为 0.0.0.0 或者 公共 IP（ public IP）。需要注意的是调试器可以完全访问 Node.js 执行环境，将调试器暴露在公共网络非常危险，因此只能在测试环境或者内网启用远程调试。[^1]


- 添加 launch.json 配置

![](https://s2.ax1x.com/2019/08/24/m6AFfS.png)

在 launch.json 文件中点击 Add Configuration ，选择 Node.js: Attach to Remote Program，VS Code 会自动添加一项配置

![](https://s2.ax1x.com/2019/08/24/m6Emge.png)

填写对应的字段：
- address： 服务器 IP 地址
- port：服务器 Node.js 调试器的端口默认为 9229，可以通过 --inspect 参数指定
- remoteRoot：服务器 Node.js 程序目录



连接远程调试器

![](https://s2.ax1x.com/2019/08/24/m6VGZR.png)

在调试面板选择远程配置运行

![](https://s2.ax1x.com/2019/08/24/m6Z81S.png)








[^1]: https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications