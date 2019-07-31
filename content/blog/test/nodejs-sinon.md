---
titile: Node.js 测试之 Sinon.js 的探测器和存根
date: 2019-07-30
---


## Sinon.js 的探测器和存根



Sinon.js 是用来编写测试探测器(spies)、存根(stubs)和模拟对象(mocks)的 Javascript 库，能够运行在任何 Node.js 测试框架中

模拟对象和存根库是测试工具箱里的终极工具[^1], 在写单元测试的时候有一些依赖比如文件读取、网络请求等依赖想要避开是就可以使用**存根**（stubs)来替代这些依赖，有助于更好的进行测试




#### 创建项目并安装 sinon

```bash
$ mkdir sinon-demo
$ cd sinon-demo/
$ npm init -y
$ npm install sinon
```

接下来编写一个 Database 类将键/值对保存在本地文件中，使用 Sinon 进行测试

```js
// 文件： db.js
const fs = require('fs')

class Database {
    constructor(fileName) {
        this.fileName = fileName
    }
    save(cb) {
        fs.writeFile(this.fileName, JSON.stringify(this.data), cb)
    }
    insert(key, value) {
        if (!this.data) {
            this.data = {}
        }
        this.data[key] = value
    }
}

module.exports = Database

```



#### 探测器(spies)

测试探测器是一个方法当它被调用的时候可以记录传人的参数、返回值、调用次数和异常等。下面使用 sinon.spy() 方法来模拟 fs writeFile 方法，这样就可以不用真实调用文件系统

```js
const sinon = require('sinon')
const fs = require('fs')
const assert = require('assert')

const Database = require('./db')

const spyWriteFile = sinon.spy(fs, 'writeFile')
const spySaveDone = sinon.spy()

const db = new Database('./data.json')

db.insert('name', 'foo')

db.save(spySaveDone)

sinon.assert.calledOnce(spyWriteFile)

spyWriteFile.restore()

```

spy 方法在不传人任何参数时会生成一个匿名的探测器方法，这个方法只会记录调用信息不会做任何其他操作
```js
const spySaveDone = sinon.spy()
```

spy 方法传人一个对象以及它上面的已存在的方法时，spy 会对这个方法进行包装然后记录调用信息，但在使用上来看和原来的方法一样
```js
const spyWriteFile = sinon.spy(fs, 'writeFile')
```

然后断言判断 spyWriteFile 方法是否被调用了一次

最后再调用`spyWriteFile.restore()`恢复 fs 的 writeFile 方法




#### 存根(stubs)

上面的测试中使用 spy 方法来仅仅是包装 writeFile 方法记录其调用信息，但是 writeFile 的 cb 没有执行，但是我们又不希望真实的调用 writeFile 方法，这时候就可以使用存根(stubs)来替换原来的writeFile 方法

```js
const sinon = require('sinon')
const fs = require('fs')

const Database = require('./db')

// const spyWriteFile = sinon.spy(fs, 'writeFile')
const subWriteFile = sinon.stub(fs, 'writeFile').callsFake((file, data, cb) => {
    cb()
})
const spySaveDone = sinon.spy()

const db = new Database('./data.json')

db.insert('name', 'foo')

db.save(spySaveDone)

sinon.assert.calledOnce(subWriteFile)
sinon.assert.calledOnce(spySaveDone)

subWriteFile.restore()
```

使用 stub 方法先传人需要替换的对象 fs 及其方法名 writeFile ，然后 callsFake 中定义一个方法来替换 writeFile 从而改变了 writeFile 的行为




[^1]: 《Node.js 实战(第二版)》第9章测试 Node.js 程序