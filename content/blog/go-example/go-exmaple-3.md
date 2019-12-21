---
title: Go 实战（三）
date: 2019-12-18
---

##  Go 实战（三）



#### 使用数据库

```go
package common

import (
	"fmt"

	"github.com/jinzhu/gorm"
	// 使用sqlite3
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Database struct {
	*gorm.DB
}

var DB *gorm.DB

func Init() *gorm.DB {

	db, err := gorm.Open("sqlite3", "../gorm.db")
	if err != nil {
		fmt.Println("db err: ", err)
	}
	db.DB().SetConnMaxLifetime(10)
	DB = db
	return DB
}

func GetDB() *gorm.DB {
	return DB
}

```

#### jwt 认证

```go
package users

import (
	"net/http"
	"strings"

	"github.com/chaosrc/realworld/common"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"github.com/gin-gonic/gin"
)

// 过滤掉 token 前缀
func stripTokenString(token string) (string, error) {
	if len(token) > 5 && strings.ToUpper(token[:6]) == "TOKEN" {
		return token[:6], nil
	}
	return token, nil
}

// 获取 header 的 Authorization，并过滤掉 token 前缀
var AuthorizationHeaderExtractor = &request.PostExtractionFilter{
	request.HeaderExtractor{"Authorization"},
	stripTokenString,
}

// 提取 OAuth2 访问 token。先获取 header 的 Authorization ，
// 然后再获取其中的 access_token
var MyAuth2Extractor = &request.MultiExtractor{
	AuthorizationHeaderExtractor,
	request.ArgumentExtractor{"access_token"},
}

func UpdateContextUserModel(c *gin.Context, myUserId uint) {
	var myUserModel UserModel

	if myUserId != 0 {
		db := common.GetDB()
		db.First(&myUserModel, myUserId)
	}
	c.Set("my_user_id", myUserId)
	c.Set("my_user_model", myUserModel)
}

func AuthMiddleware(auth401 bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		UpdateContextUserModel(c, 0)
		token, err := request.ParseFromRequest(c.Request, MyAuth2Extractor, func(token *jwt.Token) (interface{}, error) {
			b := []byte("awejiqwieijwiqoewjqowe")
			return b, nil
		})

		if err != nil {
			if auth401 {
				c.AbortWithError(http.StatusUnauthorized, err)
			}
			return
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			myUserId := uint(claims["id"].(float64))
			UpdateContextUserModel(c, myUserId)

		}
	}
}
```