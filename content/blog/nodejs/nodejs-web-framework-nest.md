---
title: Node.js Web 框架 Nest
date: 2019-07-07
---


## Node.js Web 框架 Nest



Nest 是一个用来构建高效、可扩展的 Node.js Web 服务的框架，使用 Typescript 编写并结合了OOP (面向对象), FP (函数式), and FRP (响应式编程)等编程范式

Nest 设计上的灵感很多来源于 Angular，而 Angular 的设计模式又来源于 Java 中的 Spring 框架，比如依赖注入、控制反转、面向切面等，所以很多人认为 Nest 是 Node.js 版的Spring [^1]




#### 安装 & 创建项目
```bash
$ sudo npm i -g @nestjs/cli

$ nest new nest-demo
⚡  We will scaffold your app in a few seconds..

CREATE /nest-demo/.prettierrc (51 bytes)
CREATE /nest-demo/README.md (3370 bytes)
CREATE /nest-demo/nest-cli.json (84 bytes)
CREATE /nest-demo/nodemon-debug.json (163 bytes)
CREATE /nest-demo/nodemon.json (67 bytes)
CREATE /nest-demo/package.json (1805 bytes)
CREATE /nest-demo/tsconfig.build.json (97 bytes)
CREATE /nest-demo/tsconfig.json (325 bytes)
CREATE /nest-demo/tslint.json (426 bytes)
CREATE /nest-demo/src/app.controller.spec.ts (617 bytes)
CREATE /nest-demo/src/app.controller.ts (274 bytes)
CREATE /nest-demo/src/app.module.ts (249 bytes)
CREATE /nest-demo/src/app.service.ts (142 bytes)
CREATE /nest-demo/src/main.ts (208 bytes)
CREATE /nest-demo/test/app.e2e-spec.ts (561 bytes)
CREATE /nest-demo/test/jest-e2e.json (183 bytes)

? Which package manager would you ❤️  to use? npm
▹▹▸▹▹ Installation in progress... ☕
```




#### 项目结构
```bash
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

- app.controller.ts   路由控制器
- app.module.ts       项目的根模块
- main.ts             加载模块，项目的启动的入口

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
使用 `NestFactory.create` 来创建服务





#### 基本概念

1. Controllers (控制器)[^2]

Controller 负责处理请求，以及返回响应给客户端


![](https://docs.nestjs.com/assets/Controllers_1.png)


一个 Controller 可以定义多个路由。Nest 中通过使用 Typescript 中的装饰器（[decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)）来添加路由的信息（metadata）

使用 Nest CLI 工具 生成一个 Controller

```bash
$ nest g controller todo
CREATE /src/todo/todo.controller.spec.ts (479 bytes)
CREATE /src/todo/todo.controller.ts (97 bytes)
UPDATE /src/app.module.ts (322 bytes)
```

生成了todo.controller.ts 文件

```typescript
// 文件 todo.controller.ts
import { Controller } from '@nestjs/common';

@Controller('todo')
export class TodoController {}
```

同时在 app.module.ts 添加了 TodoController 依赖

```typescript
// 文件 app.module.ts
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './todo/todo.controller';

@Module({
  imports: [],
  controllers: [AppController, TodoController],
  providers: [AppService],
})
export class AppModule {}
```

通过**装饰器**来添加路由，Nest 提供了标准的 HTTP 请求方法的的装饰器 @Post(), @Get(), @Put(), @Delete(), @Head(), @All()等

添加一个 `item` 路由
```typescript
@Controller('todo')
export class TodoController {
    @Get('/item')
    item() {
        return 'Watch movie'
    }
}
```
访问 localhost:3000/todo/item
```
$ curl localhost:3000/todo/item
Watch movie
```

通过**装饰器**模式可以很方便的获取请求数据

- @Res()    获取 Request 对象
- @Req()    获取 Response 对象
- @Param(key?: string)    获取请求参数
- @Body(key?: string)     获取请求 Body
- @Query(key?: string)    获取URL的 query 参数
- @Headers(name?: string) 获取请求 Header

```typescript
  @Get('/item')
  item(@Req() req: Request, @Query('id') id: string) {
    return {
      query: { id },
      url: req.url,
    };
  }
```
访问
```bash
$ curl localhost:3000/todo/item?id=22
{"query":{"id":"22"},"url":"/todo/item?id=22"}
```



2019-07-08 更新



2. Providers (提供者)

Providers 是 Nest 中非常重要的概念，许多基本的类比如services、repositories、factories、helpers 等都被视为 Providers。Provider 使用依赖注入的方式来委托给 Nest 运行时。

Provider 可以通过 `@Injectable()` 类装饰器创建

```ts
import { Injectable } from '@nestjs/common';
import { Todo } from 'dist/todo/todo.dto';

@Injectable()
export class TodoService {
  private list: Todo[] = [
    { title: 'To sleep', content: 'To sleep at night', isDone: false },
  ];

  getTodoLit() {
    return this.list;
  }

  getTodoItem(id) {
    return this.list[id];
  }
}
```
一般用 Controller 来处理 HTTP 请求，而将复杂的任务交给 Provider

在 Controller 中使用 service

```ts
...
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  
  constructor(private readonly todoService: TodoService) {}

  @Get('/item')
  item(@Req() req: Request, @Query('id') id: string) {
    return this.todoService.getTodoItem(id)
  }
}
```
TodoService 通过 TodoController 的构造器注入后，可以在 TodoController 中使用 TodoService 实例



注册 Provider

在 Contorller 能够使用 Provider 之前需要在模块中注册 Provider

```ts
...
import { TodoService } from './todo/todo.service';

@Module({
  imports: [],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService],
})
export class AppModule {}
```
再访问 localhost:3000/todo/item
```bash
$ curl localhost:3000/todo/item?id=0
{"title":"To sleep","content":"To sleep at night","isDone":false}
```

当前项目结构如下
```bash
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── todo
    ├── todo.controller.spec.ts
    ├── todo.controller.ts
    ├── todo.dto.ts
    └── todo.service.ts
```

3. Modules (模块)

模块是通过 `@Module()` 装饰器申明，在模块中申明元数据用来组织项目结构[^3]，每个项目至少有一个模块
![](https://docs.nestjs.com/assets/Modules_1.png)


`@Module()`接受一下几个参数

- providers    提供者，初始化后可以在多个模块中共享
- controllers  控制器，引人模块中需要使用到的控制器
- imports      从模块中引入需要暴露给 Provider 的类
- exports      当前模块提供需要暴露给外部模块的类

```ts
...
import { TodoService } from './todo/todo.service';

@Module({
  imports: [],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService],
})
export class AppModule {}
```
上面的例子中引人了两个 Controller：AppController、TodoController，两个 Contoller 中都可以注入AppService、TodoService



[^1]: https://keelii.com/2019/07/03/nestjs-framework-tutorial-1/
[^2]: https://docs.nestjs.com/controllers
[^3]: https://docs.nestjs.com/modules