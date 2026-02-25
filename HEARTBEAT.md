# HEARTBEAT.md

# 8个轮询任务 (每30分钟一次心跳，每次做1-2个)

## 任务清单 (按顺序循环)

### 1. 系统状态检查
- 检查 Gateway 状态 (`openclaw gateway status`)
- 检查 Monitor Timer 是否运行
- 检查是否有错误日志

### 2. 文档学习
- 读 OpenClaw docs/ 下的文档
- 学一个之前不会的功能

### 3. 项目探索
- 探索 workspace 下的项目 (vision-cli, 等)
- 了解代码结构和用途

### 4. 工具测试
- 测试 OCR 工具或 MCP 工具
- 验证功能是否正常工作

### 5. Memory 整理
- 查看 memory/ 下的日记
- 更新 MEMORY.md 重要内容

### 6. 问题排查
- 尝试解决一个已知问题
- Gateway token / Chrome DevTools / 飞书权限

### 7. 技术研究
- 研究新的 MCP 服务
- 研究如何改进工作流

### 8. 主动工作
- 提交代码 (git add -A && git commit)
- 更新文档
- 或做你之前交代过的事

---

### 任务7结果 (13:50)
- 研究 MCP 服务: mcporter
- 服务器状态:
  - chrome-devtools: ✅ 26工具正常
  - minimax: ❌ 离线
- 状态: ✅ 完成

### 任务1结果 (12:55)
- Gateway: 运行中 (pid 229322)
- 问题: CLI 和 service 配置路径不一致导致 token mismatch
- 建议: 运行 `openclaw doctor --repair`
- 状态: ✅ 已记录
