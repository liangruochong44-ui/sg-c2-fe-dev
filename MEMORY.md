# MEMORY.md - 长期记忆

## 用户信息

- **用户**: 梁若冲 (冲哥)
- **主要方向**: AI 相关内容 + 游戏开发
- **时区**: Asia/Shanghai

## 系统配置

- **Gateway**: 正常运行 (systemd)
- **模型**: minimax/MiniMax-M2.5-highspeed (40k context)
- **MCP**: chrome-devtools 已配置 (26个工具)
- **搜索**: MiniMax coding-plan API (默认)

## 待完成

- Chrome DevTools 需要通过 Extension Relay 连接
- 飞书权限需要发布生效（99991672 错误）

## 已完成

- IDENTITY.md 已填写（名字: 0128）
- Monitor 优化已完成（自动恢复逻辑）
- Codex CLI 已安装 (v0.104.0)

## 技术笔记

### WSL2 + Chrome 问题
- WSL2 无法直接启动 Windows Chrome (Puppeteer 错误 21)
- Windows Chrome 调试端口无法从 WSL2 访问
- 解决：使用 Chrome Extension Relay 或在 Windows 安装独立 Chromium
