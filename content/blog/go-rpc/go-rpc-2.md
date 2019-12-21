---
title: Go rpc (二)
date: 2019-12-22
---

## Go rpc (二) ：Protobuf

Protobuf 是 Protobuf Buffers 的简称，是一个高效、灵活、带有自动序列化机制的数据语言，定位类似于 XML、JSON等描述语言。



#### 安装

- 安装 protobuf 
  https://github.com/protocolbuffers/protobuf/releases

- 安装 Go 插件
  ```shell
  go get -u github.com/golang/protobuf/protoc-gen-go
  ```



#### 在 .proto 文件中定义类型

Protobuf 中的基本单元为 message，类似于 Go 中的 struct，在 message 中可以定义基础类型字段或者嵌套其他 message
```go
package message;
message Person {
  required string name = 1;
  required int32 id = 2;
  optional string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    required string number = 1;
    optional PhoneType type = 2 [default = HOME];
  }

  repeated PhoneNumber phone = 4;
}
```



#### 生成类型文件

```shell
protoc --go_out=. *.proto
```

生成一个 message.pb.go 文件，包含 .proto 中定义的类型
```go
package message
import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

....

type Person_PhoneType int32

const (
	Person_MOBILE Person_PhoneType = 0
	Person_HOME   Person_PhoneType = 1
	Person_WORK   Person_PhoneType = 2
)

var Person_PhoneType_name = map[int32]string{
	0: "MOBILE",
	1: "HOME",
	2: "WORK",
}

var Person_PhoneType_value = map[string]int32{
	"MOBILE": 0,
	"HOME":   1,
	"WORK":   2,
}

....

type Person struct {
	Name                 *string               `protobuf:"bytes,1,req,name=name" json:"name,omitempty"`
	Id                   *int32                `protobuf:"varint,2,req,name=id" json:"id,omitempty"`
	Email                *string               `protobuf:"bytes,3,opt,name=email" json:"email,omitempty"`
	Phone                []*Person_PhoneNumber `protobuf:"bytes,4,rep,name=phone" json:"phone,omitempty"`
}

func (m *Person) Reset()         { *m = Person{} }
func (m *Person) String() string { return proto.CompactTextString(m) }
func (*Person) ProtoMessage()    {}
func (*Person) Descriptor() ([]byte, []int) {
	return fileDescriptor_33c57e4bae7b9afd, []int{0}
}
...

```



#### 使用 

```go
func main() {
	name := "John"
	id := int32(1234)
	email := "123456@qq.com"
	person := &message.Person{
		Name:  &name,
		Id:    &id,
		Email: &email,
	}

	person2 := &message.Person{}
	data, _ := proto.Marshal(person)
	proto.Unmarshal(data, person2)

	fmt.Println(person2) // name:"John" id:1234 email:"123456@qq.com" 
}
```
