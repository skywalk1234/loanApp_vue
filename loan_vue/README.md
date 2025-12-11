# 贷款App前端项目

这是一个基于Vue 3构建的移动端贷款应用程序前端项目。

## 项目结构

```
loan_vue/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── services/        # API服务
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 公共资源
└── package.json         # 项目配置
```

## 功能特性

### 1. 用户认证
- 用户登录（支持邮箱验证码和密码登录）
- 用户注册
- 邮箱验证码发送和验证

### 2. 主要页面
- **首页**：用户信息、快捷服务、产品优势、平台公告
- **贷款页面**：贷款产品列表、申请功能
- **消息页面**：消息分类、消息列表、详情查看
- **个人页面**：用户信息、账户管理、设置帮助

### 3. 贷款管理
- **借款记录**：查看历史借款、还款进度、筛选功能
- **还款记录**：还款历史、统计信息
- **还款功能**：正常还款、提前还款、还款计划

### 4. 技术特性
- 响应式设计，适配移动端
- 底部导航栏
- 路由守卫，权限控制
- API服务封装
- 全局样式管理

## 技术栈

- **Vue 3**: 前端框架
- **Vue Router 4**: 路由管理
- **Axios**: HTTP请求库
- **Vite**: 构建工具

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## API接口说明

项目预留了完整的API接口，包括：

### 认证相关
- `/auth/login` - 用户登录
- `/auth/register` - 用户注册
- `/auth/send-email-code` - 发送邮箱验证码
- `/auth/verify-email-code` - 验证邮箱验证码

### 用户相关
- `/user/info` - 获取用户信息
- `/user/credit-info` - 获取信用信息
- `/user/real-name-auth` - 实名认证
- `/user/bind-bank-card` - 绑定银行卡

### 贷款相关
- `/loan/products` - 获取贷款产品
- `/loan/apply` - 申请贷款
- `/loan/records` - 获取借款记录
- `/loan/records/:id` - 获取借款详情

### 还款相关
- `/repayment/plans/:loanId` - 获取还款计划
- `/repayment/make` - 正常还款
- `/repayment/early` - 提前还款
- `/repayment/records` - 获取还款记录

### 消息相关
- `/messages` - 获取消息列表
- `/messages/:id` - 获取消息详情
- `/messages/:id/read` - 标记已读

## 注意事项

1. 当前为前端演示版本，所有API调用都预留了接口
2. 模拟数据用于展示功能
3. 需要根据实际后端API调整接口地址
4. 生产环境需要配置真实的API服务器地址

## 后续优化建议

1. 添加表单验证
2. 优化移动端交互体验
3. 添加错误处理和loading状态
4. 实现图片上传功能
5. 添加更多统计图表
6. 优化性能，添加缓存机制