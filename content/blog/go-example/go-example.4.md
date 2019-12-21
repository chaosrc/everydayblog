---
title: Go 实战（四）
date: 2019-12-19
---

## Go 实战（四）



#### 序列化

```go
type UserSerializer struct {
	c *gin.Context
}

type UserResponse struct {
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Bio      string  `json:"bio"`
	Image    *string `json:"image"`
	Token    string  `json:"token"`
}

func (self *UserSerializer) Response() UserResponse {
	userModel := self.c.MustGet("my_user_model").(UserModel)
	user := UserResponse{
		Username: userModel.Username,
		Email:    userModel.Email,
		Bio:      userModel.Bio,
		Image:    userModel.Image,
		Token:    common.GenToken(userModel.ID),
	}
	return user

}
```

#### 生成 token

```go
const PasswordSecret = "123rweg45442tefsgg"
// 生成 token
func GenToken(id uint) string {
	jwtToken := jwt.New(jwt.GetSigningMethod("HS256"))
	jwtToken.Claims = jwt.MapClaims{
		"id": id,
		"exp": time.Now().Add(time.Hour * 24).Unix()
	}
	token, _ := jwtToken.SignedString([]byte(PasswordSecret))
	return token
}
```