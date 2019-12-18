---
title: Golang 实战（一）
date: 2019-12-16
---

## Golang 实战（一）



#### 使用 fresh

fresh 是一个命令行工具用来在每次保存文件时编译和运行 web 应用

安装
```shell
$ go get github.com/pilu/fresh
```

使用
```shell
$ cd /path/app
$ fresh
```



#### 使用 gin 框架

gin 是一个用 Golang 编写的 web 框架

安装
```shell
$ go get -u github.com/gin-gonic/gin
```

导入代码
```go
import "github.com/gin-gonic/gin"
```

使用 POST、GET、PUT 等方法

```go
func main() {
    router := gin.Default()

    router.GET("/getName", getName)
    router.POST("/postName", postName)
    router.PUT("/putName", putName)
    router.DELETE("/deleteName", deleteName)

    // 默认为 8080 端口 或者环境变量 PORT 的值
    router.Run()
}
```

路径参数

```go
func main() {
    router := gin.Default()

    router.GET("/user/:name", func (c *gin.Context) {
        name := c.Param("name")
        c.String(http.StatusOK, "hello, %s", name)
    })
}

```

请求参数
```go
func main() {
    router := gin.Default()
    // 请求 url： /hello?firstname=foo&lastname=bar
    router.GET("/hello", func (c *gin.Context) {
        firstname := c.DefaultQuery("firstname", "gust")
        lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname") 的简写
    })
}
```