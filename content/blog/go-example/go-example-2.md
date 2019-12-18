---
title: Golang 实战（二）
date: 2019-12-16
---

## Golang 实战（二）



#### 用户注册


创建用户模型
```go
package users

type UserModel struct {
	ID           uint    `gorm:"primary_key"`
	Username     string  `gorm:"column:username"`
	Email        string  `gorm:"column:email;unique_index"`
	Bio          string  `gorm:"column:bio;size:1024"`
	Image        *string `gorm:"column:image"`
	PasswordHash string  `gorm:"column:password;not null"`
}
```

模型与请求 body 绑定

```go
package common

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)
// 使用 gin 模型绑定 https://github.com/gin-gonic/gin#model-binding-and-validation
func Bind(c *gin.Context, obj interface{}) error {
	b := binding.Default(c.Request.Method, c.ContentType())
	return c.ShouldBindWith(obj, b)
}
```

添加表单校验
```go
type UserModelValidator struct {
	User struct {
		Username string `form:"username" json:"username" binding:"exists,alphanum,min=4,max=255"`
		Email    string `form:"email" json:"email" binding:"exists,email"`
		Password string `form:"password" json:"password" binding:"exists,min=8,max=255"`
		Bio      string `form:"bio" json:"bio" binding:"max=1024"`
		Image    string `form:"image" json:"image" binding:"omitempty,url"`
	} `json:"user`
	userModel UserModel `json:"-"`
}

func (self *UserModelValidator) Bind(c *gin.Context) error {
	err := common.Bind(c, self)
	if err != nil {
		return err
	}

	return nil
}
```

添加路由

```go
func UsersRegister(router *gin.RouterGroup) {
	router.POST("/", UsersRegistration)
}

func UsersRegistration(c *gin.Context) {
	userModelValidator := UserModelValidator{}
	if err := userModelValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err)
		return
	}
	c.JSON(http.StatusCreated, userModelValidator.User)
}
```


