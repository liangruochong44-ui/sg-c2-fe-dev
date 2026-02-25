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

### Gitee

- **Token**: af382479a92193a8a4f73c5aa71941bd (ruochong-liang)

### MCP Servers

- **chrome-devtools-mcp**: Chrome 浏览器自动化 (需要独立配置)
  - 状态: 待配置 (WSL2 环境 Chrome 路径问题)
  - 用途: 浏览器自动化、性能分析、网络调试

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

注意: WSL2 环境下需要确保 Windows Chrome 可访问，或在本地运行 Chrome。
