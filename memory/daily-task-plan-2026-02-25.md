# 每日任务规划 - 详细版

## 执行时间
2026-02-25 17:00

---

## 步骤1: 系统诊断结果

### 🔍 系统诊断

| 项目 | 状态 | 详情 |
|------|------|------|
| **Gateway** | ✅ 运行中 | pid: 465060, bind: 0.0.0.0:18789 |
| **渠道** | ✅ Feishu 正常 | configured |
| **Sessions** | 18 活跃 | MiniMax-M2.5-highspeed (1000k ctx) |
| **Plugins** | 5 个 | memory-lancedb-pro, feishu_doc, feishu_wiki, feishu_drive, feishu_bitable |
| **Agents** | 3 个 | main, 2005, sun_light |

### ⚠️ 安全警告

| 级别 | 问题 | 修复方案 |
|------|------|----------|
| **CRITICAL** | Config 文件世界可读 (mode=644) | `chmod 600 ~/.openclaw/openclaw.json` |
| **CRITICAL** | Host-header origin fallback 启用 | 禁用 `dangerouslyAllowHostHeaderOriginFallback` |
| **WARN** | 无 auth 限速配置 | 配置 `gateway.auth.rateLimit` |

---

## 步骤2: 搜索调研结果

### 搜索能力状态

| 方式 | 状态 | 说明 |
|------|------|------|
| **MiniMax MCP** | ❌ 不可用 | Coding Plan API Key 无搜索权限 |
| **Brave Search** | ❌ 不可用 | 缺少 API Key |
| **web_fetch** | ✅ 可用 | 可作为替代方案 |

### 📈 能力提升建议

基于系统现状分析，建议：

1. **[P0] 安全加固**
   - 修复 config 文件权限 (chmod 600)
   - 禁用 Host-header 漏洞配置
   - 可行性: 高 | 难度: 简单

2. **[P1] 搜索能力替代方案**
   - 方案A: 申请 Brave Search API Key (免费额度 2000次/月)
   - 方案B: 使用 web_fetch 替代简单搜索
   - 方案C: 确认 MiniMax 是否有搜索权限
   - 可行性: 中 | 难度: 简单

3. **[P1] Gitee Token 更新**
   - 当前 Token 已失效
   - 需要重新生成 Token 并更新配置
   - 可行性: 高 | 难度: 中等

---

## 步骤3: Gitee Issues 状态

### 📋 Gitee Issues

| 仓库 | 状态 | 说明 |
|------|------|------|
| **doc** | ❌ 无法访问 | Token 已失效 (401 Unauthorized) |
| **game419** | ❌ 无法访问 | Token 已失效 (401 Unauthorized) |

**需要操作**: 重新生成 Gitee Token

---

## 步骤4: 近期进展汇总

### ✅ 已完成

| 日期 | 事项 | 状态 |
|------|------|------|
| 02-24 | Monitor 优化 | ✅ 自动恢复逻辑已实现 |
| 02-24 | Codex CLI 安装 | ✅ v0.104.0 |
| 02-25 | sun_light agent | ✅ 已创建并配置 |
| 02-25 | Memory 系统 | ✅ 正常工作 |
| 02-25 | MiniMax MCP | ✅ Chat 可用，搜索待解决 |

### 🔄 进行中

| 事项 | 状态 |
|------|------|
| 搜索能力 | MiniMax 搜索 API 不可用 |
| Gitee Token | 已失效 |

---

## 步骤5: 今日任务规划

### 🎯 今日目标

**核心目标**: 完成系统安全加固，解决搜索能力问题

---

### 📋 待办事项

#### P0 - 紧急

1. **[P0] 修复 Config 文件权限**
   - 命令: `chmod 600 ~/.openclaw/openclaw.json`
   - 预期: 消除 CRITICAL 安全警告

2. **[P0] 修复 Host-header 漏洞配置**
   - 修改: `gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback: false`
   - 预期: 消除 CRITICAL 安全警告

3. **[P0] 解决搜索能力问题**
   - 方案: 申请 Brave Search API Key 或确认 MiniMax 搜索权限
   - 预期: 恢复 web_search 功能

#### P1 - 重要

4. **[P1] 更新 Gitee Token**
   - 操作: 在 gitee.com 生成新 Token
   - 更新: TOOLS.md 中的 Token 配置
   - 预期: 恢复 Gitee Issues 访问

5. **[P1] 测试 sun_light agent**
   - 操作: 通过 webchat 与 sun_light 对话
   - 验证: agent 正常工作

6. **[P1] 整理 worldbuilding skill**
   - 操作: 完善技能配置和文档
   - 预期: 支持夜间世界观文档撰写

#### P2 - 一般

7. **[P2] 配置 auth 限速**
   - 操作: 在 openclaw.json 添加 rateLimit 配置
   - 预期: 防止暴力破解

8. **[P2] 研究 MCP 服务集成**
   - 操作: 探索更多 MCP 服务
   - 预期: 发现新的能力提升点

---

### ⏰ 时间块规划

| 时间段 | 任务 | 优先级 |
|--------|------|--------|
| **上午** (已过) | 监控优化、agent创建、Memory研究 | ✅ 完成 |
| **17:00-18:00** | P0-1: Config 权限修复 | P0 |
| **18:00-19:00** | P0-2: Host-header 修复 + P0-3: 搜索问题 | P0 |
| **19:00-20:00** | P1-4: Gitee Token 更新 | P1 |
| **20:00-22:00** | P1-5: sun_light 测试 + P1-6: skill 整理 | P1/P2 |

---

## 执行命令速查

```bash
# 安全修复
chmod 600 ~/.openclaw/openclaw.json

# 配置修改 (需要编辑 openclaw.json)
# 将 gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback 设为 false

# Brave API Key 申请
# https://brave.com/search/api/

# 测试搜索
openclaw status --deep
```

---

## 备注

- 搜索调研因缺少 Brave API Key 无法执行 web_search
- 建议优先处理 P0 任务，消除安全风险
- Gitee Token 需要用户重新生成
