# Backend Server for sg-c2-fe-dev

## 概述
为 sg-c2-fe-dev 项目提供后端用户认证 API 服务。

## 技术栈
- Node.js
- Express.js
- JWT (JSON Web Token)
- bcryptjs (密码加密)

## 安装

```bash
cd server
npm install
```

## 启动

```bash
npm start
```

服务器将在 http://localhost:3001 启动。

## API 文档

### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

响应:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "your_username"
  }
}
```

### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

响应:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "your_username"
  }
}
```

### 验证 Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

响应:
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "username": "your_username"
  }
}
```

### 登出（使 Token 失效）
```
POST /api/auth/logout
Authorization: Bearer <token>
```

响应:
```json
{
  "message": "Logged out successfully"
}
```

### 健康检查
```
GET /api/health
```

响应:
```json
{
  "status": "ok",
  "timestamp": "2026-03-08T11:35:00.000Z"
}
```

## 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| PORT | 3001 | 服务器端口 |
| JWT_SECRET | your-secret-key-change-in-production | JWT 密钥（生产环境请修改） |

## 注意
- 当前使用内存存储用户数据，生产环境请替换为数据库
- JWT 密钥在生产环境必须修改
