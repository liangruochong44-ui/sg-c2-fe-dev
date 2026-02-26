# Gitee Token 测试 Skill

## 概述

全面测试 Gitee API Token 的权限，确保可以正常访问仓库。

## 适用场景

- Token 首次配置后的验证
- 无法访问 Gitee 仓库时的诊断
- 排查 API 调用失败的原因

## 执行步骤

### 步骤1: 读取 Token

从 TOOLS.md 读取 Gitee Token：

```bash
grep "Token" /home/lrc/.openclaw/workspace/TOOLS.md | head -1
```

或使用环境变量/参数传入。

### 步骤2: 用户信息测试

验证 Token 基本有效性：

```bash
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/user" | jq -r '.login, .name, .id'
```

**预期**: 返回用户登录名、名称、ID

### 步骤3: 仓库列表测试

获取用户可访问的仓库：

```bash
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/user/repos?per_page=10" | jq '.[].full_name'
```

**预期**: 返回仓库名列表

### 步骤4: 目标仓库访问测试

测试特定仓库的访问权限：

```bash
# 测试仓库元信息
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}" | jq -r '.full_name, .permissions'

# 测试 branches
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}/branches" | jq '.[].name'

# 测试 commits
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}/commits?per_page=3" | jq '.[].commit.message'

# 测试文件内容
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}/contents/README.md" | jq -r '.name, .content'
```

**预期**: 
- 元信息返回仓库名和权限
- branches 返回分支列表
- commits 返回提交记录
- 文件内容返回 base64 编码的文件内容

### 步骤5: Issues 测试

测试 Issues 访问：

```bash
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}/issues?state=open&per_page=5" | jq '.[].title'
```

**预期**: 返回 open issues 标题列表

### 步骤6: 写入权限测试（如需要）

测试创建/修改能力：

```bash
# 测试获取仓库信息（需要 push 权限）
curl -s -H "Authorization: token $TOKEN" "https://gitee.com/api/v5/repos/{owner}/{repo}" | jq '.permissions'
```

**权限字段说明**:
- `admin`: true = 管理权限
- `push`: true = 推送权限  
- `pull`: true = 拉取权限

---

## 输出格式

### 测试结果汇总

```
=== Gitee Token 测试结果 ===

✅ 用户: {login} ({name}) - ID: {id}

📦 仓库权限:
  - {repo1}: admin={admin}, push={push}, pull={pull}
  - {repo2}: admin={admin}, push={push}, pull={pull}

📋 Issues 状态:
  - {repo1}: {count} open issues
  - {repo2}: {count} open issues

🔧 权限等级: {level}
```

---

## 常见问题

### 1. 401 Unauthorized
- Token 无效或已过期
- 重新生成 Token

### 2. 403 Forbidden
- Token 权限不足
- 需要更高权限（如 repo 级别）

### 3. 404 Not Found
- 仓库不存在
- 仓库名或所有者错误

### 4. permissions 为 null
- 可能是私有仓库且未授权
- 检查 Token 是否对仓库有访问权限

---

## 依赖工具

- `exec`: curl 命令执行
- `jq`: JSON 解析

## 注意事项

1. Token 应保密，不要在日志中暴露
2. 测试命令使用 `curl -s` 静默模式
3. 使用 `jq` 提取关键字段
4. 测试多个仓库以全面评估权限
