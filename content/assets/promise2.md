#### 实现 then 方法

在 Promise 中 then 方法可以注册当前 Promise 状态确定后的回调

```js
promise.then(onResolve, onReject);
```

其中 onResolve 是 fulfilled 的后的回调接受 promise 的最终结果，onReject 是 rejected 的后的回调接受 promise 不能执行的原因

根据规范 then 方法可以被多次调用，而且必须返回 Promise

```js
export class Promise<T> {
    static all() {}
    static race() {}
    static resolve(value) {
        return new Promise((resolve) => resolve(value))
    }
    static reject(err) {
        return new Promise((resolve, reject) => reject(err))
    }
  ​
    ...

    then(onResolve?, onReject?) {
        // 如果 onResolve 或者 onReject 不是函数，其必须被忽略
        onResolve = typeof onResolve === 'function' ? onResolve : () => {}
        onReject = typeof onReject === 'function' ? onReject : () => {}

        if (this.status === FULFILLED) {
            let result = onResolve(this.value)
            if (result instanceof Promise) {
                return result;
            }
            // then 方法必须返回一个 Promise
            return Promise.resolve(result)
        }

        if (this.status === REJECTED) {

            let result = onReject(this.reason)
            if (result instanceof Promise) {
                return result
            }
            // then 方法必须返回一个 Promise
            return Promise.reject(result)
        }

        if (this.status === PENDING) {
            return new Promise((resolve, reject) => {

                const rs = (...args) => {
                    resolve(onResolve(...args))
                }
                const rj = (...args) => {
                    reject(onReject(...args))
                }
                this.onFulfilledCallbacks.push(rs)
                this.onRejcetedCallbacks.push(rj)
            })

        }

    }
    catch(reject) {
        return this.then(null, reject)
    }
  }
```

在 then 方法中首先判断 onResolve 和 onReject 参数是否为空，如果为空赋值一个空函数，then 方法返回的 Promise 的结果和 reason 也为空。
再根据状态判断如果状态已经确定为 fulfilled 或者 rejected 责执行 onResolve 或 onReject 方法，并返回 一个新的 Promise。
如果是 pending 状态则将 onResolve 和 onReject 分别 push 到 onFulfilledCallbacks 和 onRejcetedCallbacks 数组中，等到状态由 pending 转到 fulfilled 或者 rejected 时再执行

测试 then 方法

```ts
import { Promise } from "./Promise";

const promise = new Promise((resove, reject) => {
  setTimeout(resove, 1000);
});

// 多次调用
promise.then(() => console.log("multiple fist"));
promise.then(() => console.log("multiple second"));

// 链式调用
promise
  .then(() => {
    console.log("chain first");
    return "first value";
  })
  .then(value => {
    console.log(`chain recieve: ${value}`);
  });
```

输出

```bash
$ node promise-test.js
multiple fist
multiple second
chain first
chain recieve: first value
```

#### 值穿透

使用上面实现的 Promise 运行下面的代码：

```ts
new Promise(resolve => resolve(8))
  .then()
  .then()
  .then(value => {
    console.log("value", value);
  });
```

打印出来的 value 是 undefined，达到期望的结果是如下的代码

```ts
new Promise(resolve => resolve(8))
  .then(value => value)
  .then(value => value)
  .then(value => {
    console.log("value", value);
  });
```

所以需要将 then 函数的逻辑改为如下：

```ts
// 如果 onResolve 或者 onReject 不是函数，其必须被忽略
onResolve = typeof onResolve === "function" ? onResolve : value => value;
onReject = typeof onReject === "function" ? onReject : value => value;
```

基本上对 Promise 规范有了一个简单的实现，对其内部的实现原理会有更好的理解
