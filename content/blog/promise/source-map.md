---
title: 在 Node.js 中使用 Source Map
date: 2019-08-21
---


## 在 Node.js 中使用 Source Map



为了减少代码体积或者编译成兼容性更好的低版本代码，通常需要压缩和编译代码，但是会导致在出现错误时无法对错误进行定位，通过 Source Map 工具可以解决这个问题。下面将会介绍 uglify-es 和 tyescript 编译后如何使用 Source Map 工具定位错误



#### uglify-es

uglify-js 是常用的 Javascript 代码压缩工具，但是支持到 ES 5 的版本。uglify-es 支持 ES 6 及以上版本并且兼容 uglify-js。

使用 source-map-support 模块可以使 Node.js 支持 source-map。

安装 uglify-es 和 source-map-support

```js
$ npm i uglify-es source-map-support
```

创建测试代码

```js
require('source-map-support').install()

function a() {
    throw new Error('error')
}

function start() {
    a()
}

start()
```

在代码顶部引入 source-map-support 模块并执行 install 方法，执行 start 方法调用 a 方法抛出错误

使用 uglify-es 压缩代码

```bash
$ node_modules/.bin/uglifyjs app.js -o app.min.js --source-map "url=app.min.js.map"
```

得到压缩代码 app.min.js 以及其 map 文件 app.min.js.map

app.min.js
```js
require("source-map-support").install();function a(){throw new Error("error");console.log("hello")}function start(){a()}start();
//# sourceMappingURL=app.min.js.map
```
app.min.js.map
```json
{"version":3,"sources":["app.js"],"names":["require","install","a","Error","console","log","start"],"mappings":"AAAAA,QAAQ,sBAAsBC,UAG9B,SAASC,IACL,MAAM,IAAIC,MAAM,SAChBC,QAAQC,IAAI,SAGhB,SAASC,QACLJ,IAGJI"}
```

运行 app.min.js 

```bash
$ node app.min.js
/Users/chao/workspace/node/node-demo/promise/source-map/app.js:5
    throw new Error('error')
          ^
Error: error
    at a (/Users/chao/workspace/node/node-demo/promise/source-map/app.js:5:11)
    at start (/Users/chao/workspace/node/node-demo/promise/source-map/app.js:5:5)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/source-map/app.js:5:5)
```

可以看到 start 到 a 的调用栈，以及出现错误的位置 app.js 的第 5 行

如果不实用 source-map，即去掉代码中的 `require('source-map-support').install()`

再运行
```
$ node app.min.js/Users/chao/workspace/node/node-demo/promise/source-map/app.min.js:1
function a(){throw new Error("error")}function start(){a()}start();
             ^

Error: error
    at a (/Users/chao/workspace/node/node-demo/promise/source-map/app.min.js:1:20)
    at start (/Users/chao/workspace/node/node-demo/promise/source-map/app.min.js:1:56)
```

无法正确的显示出现错误的位置




#### Typescript

创建测试代码
```ts
import 'source-map-support/register'

class Foo {
    constructor() {
        throw new Error('Foo new error')
    }
}

new Foo()
```

使用 Typescript 的编译工具 tsc 编译
```bash
tsc --sourceMap app_ts.ts
```

运行生成的 app_ts.js

```bash
$ node app_ts.js

/Users/chao/workspace/node/node-demo/promise/source-map/app_ts.ts:5
        throw new Error('Foo new error')
              ^
Error: Foo new error
    at new Foo (/Users/chao/workspace/node/node-demo/promise/source-map/app_ts.ts:5:15)
    at Object.<anonymous> (/Users/chao/workspace/node/node-demo/promise/source-map/app_ts.ts:9:1)
    at Module._compile (internal/modules/cjs/loader.js:778:30)
```

也可以正确定位到错误位置




