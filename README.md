# express-blog

### 后端

> expresssjs+mongodb

> 使用 express 搭建项目，mongodb 做数据库，使用 https://railway.app/dashboard 存放数据库，七牛云作为图床实现上传功能，使用中间件实现不同功能

- [x] 文章增删改查接口
- [x] 用户信息处理接口
- [x] 用户权限中间件
- [x] 登录验证
- [x] 分类标签功能
- [x] 角色管理接口
- [x] 权限管理接口
- [ ] 网站浏览量统计接口
- [ ] 用户交互接口（评论）
- [ ] 全局搜索接口
- [x] 文件上传接口对接七牛云
- [x] 项目上线

## 目标

### 前台小程序

![7417edf93fdfacca7f1145ca3fbfd3b](http://rudxzhmj6.bkt.clouddn.com//pic/7417edf93fdfacca7f1145ca3fbfd3b.jpg)

> 仓库地址:https://github.com/tianchi-W/uni-blog-wx/tree/dev
> uniapp+vue3+hooks+ts（由于后台接口域名还备案还没通过 😓，小程序中没有数据，暂时只能在测试版看效果 😹）

- [x] 文章增删改查接口
- [x] 文章分页查询接口与上拉加载
- [x] mp-html 渲染 markdown 语法
- [x] 用户登录及信息编辑
- [x] 密码加密
- [x] 用户微信和 web 身份标识
- [x] 文章分类页及首页动态 tab 栏
- [ ] 搜索
- [ ] 用户评论收藏点赞处理
- [ ] 埋点统计
- [ ] 排序

### 后台管理系统

> 项目仓库：https://github.com/tianchi-W/blog-admin

> 项目预览：http://13.231.127.205

> vue3+element-plus+hooks+vite4+ts
> 预览账号：mongodb 密码：123456

- [x] 文章增删改查接口
- [x] 用户登录注册接口
- [x] 文章分页查询接口
- [x] 小程序登录及请求权限接口
- [x] 用户信息修改接口（不包括修改密码）
- [x] 图片上传和富文本上传功能接口（七牛云图床）
- [ ] 点击数统计
- [ ] 搜索
- [x] home 页统计面板（暂时用 threejs 代替）
- [ ] 设置页 banner 页图片处理
- [x] 标签和分类功能
- [x] 角色管理
- [x] 动态路由
- [x] 权限管理
- [x] 动态菜单
- [ ] 密码加密传输
- [x] 项目上线

### web 端

> 施工中，先复习一下 reactjs，然后使用 next.js 进行服务端渲染，接口看情况有时间用 nestjs 练练手，没时间的话继续用 express 的接口

- [x] 创建文件夹
