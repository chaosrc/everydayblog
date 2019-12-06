---
title: Golang 测试（三）
date: 2019-12-04
---

##  Golang 测试（三）



#### 外部测试包

net/url 包提供 URL 解析，net/http 包提供 web 服务和 HTTP 客户端库，上层的 net/http 依赖下层的 net/url。然而 net/url 中的一个测试需要在 URLs 和 HTTP 客户端之间交互，也就是说下层包导入了上层包。

![Q1HbA1.png](https://s2.ax1x.com/2019/12/04/Q1HbA1.png)

在 net/url 包中声明这样一个测试函数会导致包循环导入（如上图），在 Go 中禁止循环导入。

解决这个问题的方法是在一个外部测试包（external test package）中声明这个函数，也就是在 net/url 文件夹中将测试包定义为 pacakge url_test。

外部测试包被当作一个独立的包。从逻辑上来说，在它依赖的包上提升了一层：

![Q1qYJP.png](https://s2.ax1x.com/2019/12/04/Q1qYJP.png)

通过 go list 工具可以查看包中的 Go 代码哪些是产品代码，哪些是内部测试代码，以及哪些是外部测试代码。

查看 fmt 包中的产品代码文件

```shell
$ go list -f={{.GoFiles}} fmt
[doc.go errors.go format.go print.go scan.go]
```

内部测试代码文件
```shell
$ go list -f={{.TestGoFiles}} fmt
[export_test.go]
```

外部测试代码文件

```shell
$ go list -f={{.XTestGoFiles}} fmt
[errors_test.go example_test.go fmt_test.go gostringer_example_test.go scan_test.go stringer_example_test.go stringer_test.go]
```