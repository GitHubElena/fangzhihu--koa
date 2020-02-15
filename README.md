# 仿知乎后台接口 #
基于koa2+mongodb

## 安装插件 ##
- [x] mongoose为操作mongodb的第三方插件
- [x] koa-body解析 ctx.request.body(json以及file类型都可以)
- [x] koa-static 将资源静态化置于服务器地址
- [x] jwt(jsonwebtoken) ||  koa-jwt (第三方插件jwt) 生成接口认证令牌token
- [x] koa-json-error  捕捉一切error(包含404 error)
- [x] koa-paramter参数校验插件
- [x] koa-router 实现路由与接口的匹配

 
## 目录结构介绍 ##

    |--  app                                 // 源码目录  
    |       |-- controllers                  // 控制器文件  
    |                |-- answers             // 答案相关业务接口文件  
    |                |-- comments            // 评论相关业务接口文件  
    |                |-- home                // 首页相关业务接口文件  
    |                |-- questions           // 问题相关业务接口文件  
    |                |-- topics              // 话题相关业务接口文件  
    |                |-- users               // 用户相关业务接口文件  
    |       |-- models                       // 数据库scheme文件  
    |                |-- answers             // 答案相关数据库schema文件  
    |                |-- comments            // 评论相关数据库schema文件  
    |                |-- questions           // 话题相关数据库schema文件  
    |                |-- users               // 用户相关数据库schema文件  
    |       |-- public                       // 公共文件存放目录  
    |                |-- uploads             // 上传文件存放目录  
    |       |-- routes                       // 路由文件  
    |                |-- answers             // 答案相关路由文件  
    |                |-- comments            // 评论相关路由文件  
    |                |-- home                // 主页路由文件  
    |                |-- index               // 自动化载入路由实列文件  
    |                |-- questions           // 问题相关路由文件  
    |                |-- topics              // 话题相关路由文件  
    |                |-- users               // 用户相关路由文件  
    |      |-- config                       // 公共配置文件  
    |      |-- index                        // 主入口文件  
    |--  data                               
    |       |-- db                           // 数据库文件      
    |-- .gitignore                           // 忽略的文件  
    |--  package.json                        // 项目及工具的依赖配置文件  
    |--  README.md                           // 说明  


## 安装步骤 ##

  安装nodejs 以及Mongodb，同时安装mongodb-compass数据库可视化工具方便查看数据的变化
  mongodb下在bin目录同文件下新建data文件夹且在文件夹下新建db文件夹，
  确保数据库文件存放目录
  git clone 本项目


## 本地开发 ##

  进入到mongodb下的bin目录  cmd执行 mongod --dbpath=..\data\db开启数据库
  开启mongodb-compass 连接mongodb
  cd fangzhihu      // 进入模板目录
  npm install       // 安装文件依赖
  npm run devStart  // 启动该项目


