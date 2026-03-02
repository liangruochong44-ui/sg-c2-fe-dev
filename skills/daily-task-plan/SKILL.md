# 每日任务规划 - SKILL.md

## 概述

执行全面的系统诊断、搜索调研、信息汇总，生成结构化的每日任务规划。

## 执行步骤

### 步骤1: 全面诊断 OpenClaw 状态

#### 1.1 检查 Gateway 状态
```bash
openclaw gateway status
```
记录：
- 运行状态 (running/stopped)
- PID
- 监听端口
- 错误信息（如有）

#### 1.2 获取系统概览
```bash
openclaw status
```
记录：
- Gateway 连接状态
- 已配置的渠道 (channels)
- 已加载的插件 (plugins)
- 活跃 Session 数量
- 模型配置

#### 1.3 检查渠道状态
```bash
openclaw gateway status 2>&1 | grep -i channel
```
或检查各渠道健康状态：
- Feishu: 测试消息发送
- Telegram: 检查 bot 状态
- WebChat: 检查连接

#### 1.4 汇总诊断结果
```
### 🔍 系统诊断
- **Gateway**: [运行中/停止] (pid: XXX)
- **渠道**: [正常/异常] - 列出各渠道状态
- **Plugins**: [已加载 X 个]
- **Sessions**: [X 个活跃]
- **安全警告**: [列出发现的警告]
```

---

### 步骤2: 能力提升搜索调研

#### 2.1 使用 MiniMax 搜索 (minimax-tools)
执行以下搜索查询：
1. `OpenClaw AI assistant 能力提升 优化技巧 2025 2026`
2. `OpenClaw MCP server 集成 自定义 教程`
3. `OpenClaw 智能体 agent 配置 最佳实践`

#### 2.2 搜索结果提取
从每个搜索结果中提取：
- **可行性**: 高/中/低
- **实施难度**: 简单/中等/复杂
- **预期收益**: 功能增强/性能提升/安全性提高
- **具体建议**: 2-3 条可行的优化建议

#### 2.3 汇总能力提升建议
```
### 📈 能力提升建议
从搜索结果中提取：

1. **[建议1]**
   - 来源: [搜索查询]
   - 可行性: [高/中/低]
   - 具体措施: [描述]

2. **[建议2]**
   - 来源: [搜索查询]
   - 可行性: [高/中/低]
   - 具体措施: [描述]
```

---

### 步骤3: 检查 Gitee Issues

#### 3.1 检查 doc 仓库
```bash
# 检查 token 是否有效
curl -s "https://gitee.com/api/v5/repos/ruochong-liang/doc/issues?state=open&per_page=10" \
  -H "Authorization: token ${GITEE_TOKEN}" | jq 'length'
```
记录：
- Open issues 数量
- 最近的问题标题

#### 3.2 检查 game419 仓库
```bash
curl -s "https://gitee.com/api/v5/repos/ruochong-liang/game419/issues?state=open&per_page=10" \
  -H "Authorization: token ${GITEE_TOKEN}" | jq 'length'
```
记录：
- Open issues 数量
- 最近的问题标题

#### 3.3 汇总
```
### 📋 Gitee Issues
- **doc**: [X] 个 open issues
- **game419**: [X] 个 open issues
```

---

### 步骤4: 读取近期记忆

#### 4.1 读取近期日记
```bash
# 读取最近 3 天的日记
ls -t memory/*.md | head -3
```
对每个文件：
- 读取关键内容
- 提取：已完成事项、待办事项、问题/阻碍

#### 4.2 检查长期记忆
```bash
memory_recall(query="待办 任务 计划", limit=5)
```
提取：
- 之前规划的待办
- 未完成的任务

#### 4.3 汇总近期进展
```
### 📈 近期进展
- [已完成1]
- [已完成2]
- [进行中1]
```

---

### 步骤5: 生成任务规划

#### 5.1 优先级评估
根据以下因素评估任务优先级：
- **P0 (紧急)**: 安全问题、系统故障、功能阻断
- **P1 (重要)**: 能力提升、体验优化、文档完善
- **P2 (一般)**: 探索性任务、长期改进

#### 5.2 时间块规划
将任务分配到时间块：
- **上午** (9:00-12:00): 核心任务
- **下午** (14:00-18:00): 优化任务
- **晚上** (20:00-22:00): 自由任务/学习

#### 5.3 输出格式
```
### 🎯 今日目标
[1-2 句话总结今日核心目标]

### 📋 待办事项
1. [P0] [任务描述] - [预期成果]
2. [P0] [任务描述] - [预期成果]
3. [P1] [任务描述] - [预期成果]
4. [P2] [任务描述] - [预期成果]

### ⏰ 时间块
- **上午**: [任务1, 任务2]
- **下午**: [任务3, 任务4]
- **晚上**: [自由任务/学习]
```

---

## 输出要求

1. 格式统一，使用 Markdown
2. 每个步骤都要有明确的输出
3. 诊断信息要具体（包含数值）
4. 搜索建议要可执行
5. 任务规划要符合 SMART 原则

## 依赖工具

- `exec`: 运行命令
- `web_search`: 搜索能力提升建议
- `memory_recall`: 读取历史记忆
- `feishu_doc`: 飞书文档操作（可选）
