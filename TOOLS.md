# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## ⚠️ MCP 管理 - mcporter（重要！）

**mcporter 是 OpenClaw 使用 MCP 的唯一途径**

### 配置文件位置
- **项目配置**: `~/.openclaw/workspace/config/mcporter.json`
- **系统配置**: `~/.mcporter/mcporter.json`（可选）

### 核心命令

| 命令 | 用途 |
|------|------|
| `mcporter list` | 列出所有 MCP 服务器 |
| `mcporter list <name> --schema` | 查看服务器工具文档 |
| `mcporter call <server.tool> key=value` | 调用工具 |
| `mcporter config list` | 查看配置来源 |
| `mcporter daemon start` | 启动守护进程（仅 HTTP 传输需要） |

### 当前配置的 MCP 服务器

#### chrome-devtools（浏览器自动化）
- **状态**: 待配置
- **用途**: 浏览器自动化、性能分析、网络调试

### 注意事项

- **stdio 传输**: 无需 daemon，每次调用自动启动
- **HTTP 传输**: 需要 `mcporter daemon start` 保持常驻

---

### minimax MCP（搜索 + 图片理解）
- **状态**: ✅ 已配置
- **工具**: `web_search`, `understand_image`
- **调用方式**（必须在 workspace 目录执行）:
  ```bash
  cd ~/.openclaw/workspace
  mcporter call minimax.web_search query="关键词"
  mcporter call minimax.understand_image prompt="描述" image_source="图片路径"
  ```

### Gitee

- **Token**: af382479a92193a8a4f73c5aa71941bd (ruochong-liang)

### Chrome DevTools MCP 配置状态

```json
// ~/.openclaw/workspace/config/mcporter.json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--headless"]
    }
  }
}
```
