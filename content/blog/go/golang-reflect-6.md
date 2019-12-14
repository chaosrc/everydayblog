---
title: Golang 反射（六）
date: 2019-12-13
---


## Golang 反射（六）



#### 获取 struct 字段标签

在一个 web 服务中，大多数 HTTP 处理方法做的第一件事是提取请求参数到本地变量。定义一个叫 data 的匿名 struct 类型变量，其字段对应 HTTP 请求的参数，struct 的字段标签指定参数名。Unpack 方法从请求中获取参数填充 data，因此参数能够方便的通过适当的类型获取。

```go
func search(res http.ResponseWriter, req *http.Request){
	var data struct {
		Labels []string  `http:"1"`
		MaxResults int   `http:"max"`
		Exact   bool     `http:"x"`
	}

	data.MaxResults = 10
	if err := Unpack(req, &data); err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
	}
	fmt.Fprintf(res, "Search: %+v\n", data)
}
```

Unpack 方法需要做三件事：首先，调用 req.ParseForm() 解析请求，之后 req.Form 会包含所有的参数，不管是 GET 还是 POST 请求。

接下来，Unpack 方法构建每一个字段名称到对应的变量的映射，如果字段有标签，那么字段名称可能和实际名称不同。reflect.Type 的 Field 方法返回一个 reflect.StructField。SructField 提供每一个字段信息，包括名称、类型、可选的标签。

```go
func Unpack(req *http.Request, ptr interface{}) error {
	if err := req.ParseForm(); err != nil {
		return err
	}

	fields := make(map[string]reflect.Value)

	v := reflect.ValueOf(ptr).Elem()

	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		tag := field.Tag
		name := tag.Get("http")
		if name == "" {
			name = strings.ToLower(field.Name)
		}
		fields[name] = v.Field(i)
	}

	for name, values := range req.Form {
		f := fields[name]
		if !f.IsValid() {
			continue
		}

		for _, value := range values {
			if f.Kind() == reflect.Slice {
				elem := reflect.New(f.Type().Elem()).Elem()
				if err := populate(elem, value); err != nil {
					return err
				}
				f.Set(reflect.Append(f, elem))
			} else {
				if err := populate(f, value); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func populate(rv reflect.Value, v string) error {
	switch rv.Kind() {
	case reflect.String:
		rv.SetString(v)
	case reflect.Int:
		i, err := strconv.Atoi(v)
		if err != nil {
			return err
		}
		rv.SetInt(int64(i))

	case reflect.Bool:
		b, err := strconv.ParseBool(v)
		if err != nil {
			return err
		}
		rv.SetBool(b)
	default:
		return fmt.Errorf("Unsuport kind %s", rv.Type())
	}
	return nil
}
```

运行

```shell
$ curl 'localhost:8888/?x=1&max=34&1=u&1=b'
Search: {Labels:[u b] MaxResults:34 Exact:true}
```
