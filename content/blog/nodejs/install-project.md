---
title: Node.js的安装以及npm包管理工具的使用
date: 2019-06-24
description: Node.js的安装以及npm包管理工具的使用
---

## Node.js 的安装以及 npm 包管理工具的使用



### Node.js 的版本

- 长期支持版 LTS，18 个月的更新支持，12 个月的维护支持
- 当前发布版 Current，6 个月的更新支持，单数版（比如 9，11）6 个月后不再支持，双数版（比如 10，12）6 个月后进入长期支持版

![](https://raw.githubusercontent.com/nodejs/Release/master/schedule.svg?sanitize=true)

### 安装 Node.js

- Windows、macOS 用户直接从[Node.js 官网](https://nodejs.org/en/download/)下载安装包
- [Ubuntu 安装](https://github.com/nodesource/distributions#deb)

Node.js 12.x

```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Node.js 10.x

```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- [CentOS 安装](https://github.com/nodesource/distributions#rpm)

Node.js 12.x

```bash
curl -sL https://rpm.nodesource.com/setup_12.x | bash -
```

Node.js 10.x

```bash
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
```

检查安装是否成功

```bash
$ node -v
v12.4.0
```

### npm 包管理工具

Node.js 中自带包管理工具 npm

```bash
$ npm -v
6.9.0
```

npm 可以用来安装来自 npm 仓库的 js 模块，同时也可以将自己的代码分享在 npm 仓库

#### 创建一个 Node.js 项目

```bash
$ mkdir node-demo

$ cd node-demo

$ npm init -y
```

`npm init -y` 会创建一个 package.json 文件用来描述项目，比如版本号、入口文件路径、执行脚本、许可证等

```json
{
  "name": "node-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

其中“main”用来指定项目的入口文件默认为“index.js”

"script"是一个 JSON 对象，对象中的每一个属性都可以对应一段执行脚本[^1]

比如给"script"添加一个“start”执行脚本

```JSON
{
  ...
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  ...
}
```

index.js 文件

```javascript
console.log("hello Node.js")
```

通过运行`npm run start`来执行 start 脚本

```bash
$ npm run start
hello Node.js
```

#### 安装第一个 Node.js 模块

使用 npm install 或者简写 npm i 加模块名

```bash
$ npm install express
# 或者
$ npm i express
```

其中 express 是一个模块名

安装完成后，项目目录下会增加一个 node_modules 的文件夹用来存放 npm
安装的模块

```bash
$ ls -1
index.js
node_modules
package.json
```

package.json 里面会添加dependencies对象，在里面会记录安装的模块名字以及版本号

```json
{
  ...
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```
随着项目的增大，依赖的模块会越来越多，为了防止不同项目中版本的依赖问题，npm 默认会将依赖安装在项目的node_modules中，node_modules的体积也会越来越大，所以node_modules一定要添加在.gitignore中，不要和源码一起提交。因为package.json中会保留所以的依赖信息，所以从git clone项目后，只需要运行`npm install`不指定模块名，会默认安装package.json中的所有依赖。

下一步可以开始写Node.js了😊

[^1]: http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html
