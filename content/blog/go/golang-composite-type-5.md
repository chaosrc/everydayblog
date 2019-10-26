---
title: Golang 复合类型（五）
date: 2019-10-25
---


##  Golang 复合类型（五）



#### Structs

一个 struct 由零个或多个任意类型的命名的字段组成

下面声明一个 Employee 类型的 struct，以及一个 Employee 实例 foo

```go
type Employee struct {
	ID      int
	Name    string
	Address string
	Salary  int
}

var foo Employee
```

foo 中的字段通过点符号来获取比如 `foo.name`，因为 foo 是一个变量，它的字段也是变量，因此可以对字段进行赋值
```go
foo.Salary = 5000
```
或者拿到地址，通过指针来获取
```go
name := &foo.Name
*name = *name + "lastName"
```

点符号也可以用在 struct 指针上面

```go
p := &foo
p.Address = "shanghai"
```
最后一句相当于 `(*p).Address = "shanghai"`

以大写字母开头的 struct 字段会被导出，这是 Go 的主要访问控制机制

一个命名的 struct 类型 S 不能声明一个类型为 S 的字段：聚合类型不能包含自己。但是 S 可以声明一个指针类型 *S 的字段，这使得我们可以创建递归数据结构比如链表和树

下面使用二叉树实现插入排序
```go
type Tree struct {
	value       int
	left, right *Tree
}

func sort(values []int) {
	var root *Tree

	for _, value := range values {
		root = add(root, value)
	}

	toArray(values[:0], root)
}

func add(tree *Tree, value int) *Tree {
	if tree == nil {
		tree = &Tree{value: value}
		return tree
	}

	if value <= tree.value {
		tree.right = add(tree.right, value)
	}
	if value > tree.value {
		tree.left = add(tree.left, value)
	}
	return tree
}

func toArray(list []int, tree *Tree) []int {
	if tree == nil {
		return list
	}
	if tree.right != nil {
		list = toArray(list, tree.right)
	}
	list = append(list, tree.value)
	if tree.left != nil {
		list = toArray(list, tree.left)
	}
	return list
}
```

运行
```go
func main() {
	list := []int{2, 1, 5, 6, 3, 8, 2}
	sort(list)
	fmt.Println(list) // [1 2 2 3 5 6 8]
}
```






