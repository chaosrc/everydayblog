---
title: 使用 Tick Processor 分析 CPU 使用情况
date: 
---


## 使用 Tick Processor 分析 CPU 使用情况



Tick Processor 是 v8 内置的一个性能分析工具，可以记录 Javascript、C、C++代码的堆栈信息，该功能默认是关闭的，可以通过添加命令行参数 --prof 开启



#### 创建测试代码

```js
const crypto = require('crypto')

function hash(password) {
    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    return hash
}

console.time('pbkdf2Sync')
for (let i = 0; i < 100; i++) {
    hash('123456qwert')
}
console.timeEnd('pbkdf2Sync')
```

创建了一个 hash 函数使用 crypto.pbkdf2Sync 方法同步计算 hash 值，将 hash 函数循环执行 100 次来做 CPU 密集型运算

使用 --prof 参数运行

```bash
$ node --prof index.js 
pbkdf2Sync: 753.065ms
```
执行 100 次 pbkdf2Sync 函数共消耗了 753.065ms，同时生成了 isolate-0x103802000-66678-v8.log 文件

```bash
$ less isolate-0x103802000-66678-v8.log
v8-version,7,4,288,27,-node.18,0
shared-library,/usr/local/bin/node,0x100001000,0x100f2e38d,0
shared-library,/System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation,0x7fff40d46810,0x7fff40f399ac,421
shared-library,/System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation,0x7fff40d46810,0x7fff40f399ac,421703680
shared-library,/usr/lib/libSystem.B.dylib,0x7fff6693694a,0x7fff66936b2e,421703680
shared-library,/usr/lib/libc++.1.dylib,0x7fff66b6af40,0x7fff66bb22b0,421703680
shared-library,/usr/lib/libDiagnosticMessagesClient.dylib,0x7fff665bff08,0x7fff665c090c,421703680
shared-library
...
```



#### 使用 --prof-process 命令解析 log 数据

```bash
$ node --prof-process isolate-0x103802000-66678-v8.log

Statistical profiling result from isolate-0x103802000-66678-v8.log, (659 ticks, 4 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
      1    0.2%          /usr/lib/system/libsystem_platform.dylib

 [JavaScript]:
   ticks  total  nonlib   name

 [C++]:
   ticks  total  nonlib   name
    583   88.5%   88.6%  T node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
     25    3.8%    3.8%  T node::native_module::NativeModuleEnv::CompileFunction(v8::FunctionCallbackInfo<v8::Value> const&)
     20    3.0%    3.0%  t 
     ...

 [Summary]:
   ticks  total  nonlib   name
      0    0.0%    0.0%  JavaScript
    654   99.2%   99.4%  C++
      2    0.3%    0.3%  GC
      1    0.2%          Shared libraries
      4    0.6%          Unaccounted

 [C++ entry points]:
   ticks    cpp   total   name
    622   96.7%   94.4%  T __ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
     21    3.3%    3.2%  t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE

 [Bottom up (heavy) profile]:
  Note: percentage shows a share of a particular caller in the total
  amount of its parent calls.
  Callers occupying less than 1.0% are not shown.

   ticks parent  name
    583   88.5%  T node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
    583  100.0%    T __ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
    583  100.0%      LazyCompile: ~handleError internal/crypto/pbkdf2.js:74:21
    583  100.0%        LazyCompile: ~pbkdf2Sync internal/crypto/pbkdf2.js:44:20
    583  100.0%          LazyCompile: ~hash /Users/chao/workspace/node/node-demo/tick-processor/index.js:3:14
    583  100.0%            Eval: ~<anonymous> /Users/chao/workspace/node/node-demo/tick-processor/index.js:1:1
```
输出的内容包括6部分：Shared libraries、JavaScript、C++、Summary、C++ entry points、Bottom up (heavy) profile，其中 JavaScript 和 C++ 部分列出了对应代码执行时所占的 CPU 时钟周期（ticks），Summary 则列出了各个部分总的 CPU 时钟周期占比。可以看出 C++ 代码部分占据了 99.2% 的 CPU 时钟周期，而其中 node::crypto::PBKDF2 方法又占据了 88.5% 的 CPU 时钟周期




#### 创建异步测试代码

```js
const crypto = require('crypto')

function hash(password, cb) {
    const salt = crypto.randomBytes(128).toString('base64')

    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', cb)
}

let count = 0

console.time('pbkdf2')
for (let i = 0; i < 100; i++) {
    hash('12356qwert', () => {
        count++
        if (count === 100) {
            console.timeEnd('pbkdf2')
        }
    })
}
```
将 crypto.pbkdf2Sync 同步方法换成异步方法 crypto.pbkdf2，再运行

```bash
$ node --prof async.js 
pbkdf2: 373.455ms
```
运行时间较同步方法快了将近一倍


```bash
$ node --prof-process isolate-0x102803e00-69628-v8.log 
Statistical profiling result from isolate-0x102803e00-69628-v8.log, (155 ticks, 4 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
      1    0.6%          /usr/lib/system/libsystem_platform.dylib

 [JavaScript]:
   ticks  total  nonlib   name

 [C++]:
   ticks  total  nonlib   name
     73   47.1%   47.4%  T _kpersona_get
     28   18.1%   18.2%  t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE
     22   14.2%   14.3%  T node::native_module::NativeModuleEnv::CompileFunction(v8::FunctionCallbackInfo<v8::Value> const&)
      4    2.6%    2.6%  T node::binding::GetInternalBinding(v8::FunctionCallbackInfo<v8::Value> const&)
      4    2.6%    2.6%  T ___guarded_open_np
     ...

 [Summary]:
   ticks  total  nonlib   name
      0    0.0%    0.0%  JavaScript
    150   96.8%   97.4%  C++
      2    1.3%    1.3%  GC
      1    0.6%          Shared libraries
      4    2.6%          Unaccounted

 [C++ entry points]:
   ticks    cpp   total   name
     29   54.7%   18.7%  T __ZN2v88internal21Builtin_HandleApiCallEiPmPNS0_7IsolateE
     23   43.4%   14.8%  t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE
      1    1.9%    0.6%  t node::inspector::(anonymous namespace)::InspectorConsoleCall(v8::FunctionCallbackInfo<v8::Value> const&)

 [Bottom up (heavy) profile]:
  Note: percentage shows a share of a particular caller in the total
  amount of its parent calls.
  Callers occupying less than 1.0% are not shown.

   ticks parent  name
     73   47.1%  T _kpersona_get

     28   18.1%  t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE
     12   42.9%    t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE
      2   16.7%      LazyCompile: ~copyProps internal/per_context/primordials.js:28:19
      1   50.0%        LazyCompile: ~makeSafe internal/per_context/primordials.js:51:18
      1  100.0%          Eval: ~<anonymous> internal/per_context/primordials.js:1:1
      1   50.0%        LazyCompile: ~<anonymous> internal/per_context/primordials.js:104:11
      1  100.0%          t __ZN2v88internalL47Builtin_Impl_Stats_CallSitePrototypeGetTypeNameEiPmPNS0_7IsolateE
      1  100.0%            Eval: ~<anonymous> internal/per_context/primordials.js:1:1
```

可以看出使用异步方法 CPU 时钟周期从 600 多次减少到了 150 几次
