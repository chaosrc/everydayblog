---
title: Promise 规范及实现原理
date: 2019-08-18
---


## Promise 规范及实现原理


在 Javascript 中异步和事件监听都是通过回调进行传值，回调过多很容易形成‘回调地狱’，比如：

```js
step1((value1) => {
    step2(value1, (value2) => {
        step3(value2, (value3) => {
            step4(value3, (value4) => {
                ...
            })
        })
    })
})
```
上面的代码依次执行 step1，step2，step3，step4，每个方法都是异步的用到前一个函数的返回值，在真实环境下每一层嵌套都可能会有很多逻辑以及更多的嵌套，使得代码不易维护。而 Promise 就是为了解决回调地狱问题的，最开始是由社区提出和实现，最后成为了 ES6 标准。




#### Promise 规范


promise 表示的是一个异步操作的最终结果，与 promise 交互是通过 then 函数，then 函数注册了两个回调函数，用于接受 promise 的最终结果或者不能执行的原因

Promise 规范的简单总结：
- Promise 本质是一个状态机，每一个 promise 只有三种状态：pending、fulfilled 或 rejected。状态只能由 pending 转为 fulfilled 或者 pending 转为 rejected，状态转变不可逆
- then 方法可以被同一个 promise 多次调用
- then 方法必须返回一个 promise，从而实现链式调用
- 值穿透



#### 定义 Promise API

```ts
// 定义 Primise 的三种状态
type STATE = "pending" | "fulfilled" | "rejected";
const PENDING: STATE = "pending";
const FULFILLED: STATE = "fulfilled";
const REJECTED: STATE = "rejected";

export class Promise {
  static all() {}
  static resolve() {}
  static race() {}
  static reject() {}

  constructor() {}
  then() {}
  catch() {}
}


// 辅助函数

function isFunction(fn) {
    return typeof fn === 'function'
}
function isObject(o) {
    return typeof o === 'object'
}
function isArray(arr) {
    return Array.isArray(arr)
}
```

上面的代码定义了 Promise 的三种状态、辅助函数以及 Promise 接口




#### 实现 Promise 构造器函数

```js
export class Promise<T> {
  static all() {}
  static resolve() {}
  static race() {}
  static reject() {}

  value: T;
  reason: any;
  status: STATE;
  onFulfilledCallbacks: Function [] = [];
  onRejcetedCallbacks: Function [] = [];
  constructor(excutor) {
    if (!isFunction(excutor)) {
      throw new Error("excutor must be function");
    }
    // 初始化状态
    this.status = PENDING;

    this._doExcutor(excutor);
  }
  _doExcutor(excutor) {
    const resolve = value => {
      setTimeout(() => {
        // 只能由 pending 转为 fulfilled
        if (this.status === PENDING) {
          this.value = value;
          this.status = FULFILLED;
          this.onFulfilledCallbacks.forEach(fn => fn(this.value))
        }
      });
    };
    const reject = reason => {
      setTimeout(() => {
        // 只能由 pending 转为 rejected
        if (this.status === PENDING) {
          this.reason = reason;
          this.status = REJECTED;
          this.onRejcetedCallbacks.forEach(fn => fn(this.reason))
        }
      });
    };
    excutor(resolve, reject);
  }
  then() {}
  catch() {}
}
```

构造器中传人的 excutor 是在创建 Promise 对象时传人
```js
new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
})
```

在 resolve 和 reject 函数中控制状态只能由 pending 到  fulfilled 或 rejected

使用 setTimeout 是为了保证 onFulfilledCallbacks 中的方法是异步执行的



2019-08-19更新

---



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



以上基本上是对 Promise 规范有了一个简单的实现，对其内部的实现原理有了更好的理解



