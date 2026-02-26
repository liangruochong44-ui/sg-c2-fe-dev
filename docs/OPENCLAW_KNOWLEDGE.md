# OpenClaw 知识库

> 内化自 https://docs.openclaw.ai/zh-CN
> 更新时间: 2026-02-24

---

## 1. 系统架构

### Gateway (核心守护进程)
- **职责**: 管理所有消息渠道连接 (WhatsApp/Telegram/Discord/Slack/Signal/WebChat等)
- **端口**: 默认 `127.0.0.1:18789` (WebSocket)
- **通信**: JSON 格式的 WebSocket 消息 (req/res/events)
- **状态**: `openclaw gateway` 启动, `openclaw gateway status` 查看

### 组件
- **Clients**: macOS app / CLI / Web UI → 通过 WebSocket 连接 Gateway
- **Nodes**: macOS/iOS/Android/headless 设备 → 配对后提供 camera/screen/location/run 等能力
- **Canvas**: `/__openclaw__/canvas/` (可编辑 HTML/CSS/JS) 和 `/__openclaw__/a2ui/`

### 连接流程
```
Client → Gateway: req:connect
Gateway → Client: res (ok) + snapshot (presence + health)
Gateway → Client: event:presence, event:tick
Client → Gateway: req:agent
Gateway → Client: res:agent (ack) + event:agent (streaming) + res:agent (final)
```

---

## 2. 消息渠道 (Channels)

### 内置渠道
| 渠道 | 说明 |
|------|------|
| WhatsApp | 使用 Baileys, 需要 QR 配对 |
| Telegram | Bot API (grammY), 支持群组 |
| Discord | Bot API + Gateway, 支持服务器/频道/DM |
| Slack | Bolt SDK, 工作区应用 |
| Signal | signal-cli |
| WebChat | Gateway WebChat UI over WebSocket |

### 插件渠道
- Feishu (飞书) / Google Chat / Mattermost / Microsoft Teams
- IRC / Matrix / Nostr / LINE / Synology Chat / Nextcloud Talk
- iMessage (推荐 BlueBubbles) / Twitch / Zalo / Tlon

---

## 3. 工具 (Tools)

### 核心工具
| 工具 | 功能 |
|------|------|
| `exec` | 运行 shell 命令 |
| `process` | 管理后台进程 |
| `read` / `write` / `edit` | 文件操作 |
| `browser` | 浏览器自动化 |
| `canvas` | 驱动 Node Canvas |
| `nodes` | 设备控制 (camera/screen/location/run) |
| `web_search` | MiniMax 搜索 (coding-plan) |
| `web_fetch` | URL 内容获取 |
| `message` | 跨平台发消息 |
| `cron` | 定时任务 |
| `gateway` | 网关控制 |
| `sessions_*` | 会话管理 |
| `memory_*` | 记忆搜索 |

### 工具配置
```json5
{
  tools: {
    deny: ["browser"],           // 全局禁用
    profile: "coding",          // 基础配置 (minimal/coding/messaging/full)
    allow: ["group:fs", "browser"],
    byProvider: {
      "google-antigravity": { profile: "minimal" }
    }
  }
}
```

### 工具组 (group:*)
- `group:runtime` → exec, bash, process
- `group:fs` → read, write, edit, apply_patch
- `group:sessions` → sessions_list, sessions_history, sessions_send, sessions_spawn, session_status
- `group:memory` → memory_search, memory_get
- `group:web` → **web_search (MiniMax)**, web_fetch
- `group:ui` → browser, canvas
- `group:automation` → cron, gateway
- `group:messaging` → message
- `group:nodes` → nodes
- `group:openclaw` → 所有内置工具

---

## 4. 自动化

### Heartbeat (心跳)
- 周期性轻量检查 (默认 ~30min)
- 用途: 邮件/日历/天气/社交通知
- 配置: `HEARTBEAT.md` 文件

### Cron (定时任务)
- 精确时间调度
- 用途: 定时提醒、精确调度任务
- 命令: `cron` 工具

### 对比
| 特性 | Heartbeat | Cron |
|------|-----------|------|
| 时间精度 | 宽松 (~30min) | 精确 |
| 上下文 | 会话历史 | 独立 |
| 用途 | 批量检查 | 定时提醒 |

---

## 5. 配置 (openclaw.json)

### 核心配置项
```json5
{
  // 模型提供商
  model: { provider: "minimax", model: "MiniMax-M2.5" },
  
  // 消息渠道
  channels: {
    telegram: { token: "xxx" },
    whatsapp: { phone: "xxx" }
  },
  
  // 工具策略
  tools: {
    profile: "full",
    deny: []
  },
  
  // Agent 配置
  agents: {
    defaults: { sandbox: false },
    list: [{ id: "support", tools: { profile: "messaging" } }]
  },
  
  // 自动化
  heartbeat: { prompt: "xxx" },
  cron: []
}
```

---

## 6. 安全

### 设备配对
- 新设备需要配对批准
- 本地设备 (loopback/tailnet) 可自动批准
- 非本地需手动授权

### 工具权限
- `tools.allow` / `tools.deny` 控制可用工具
- `tools.profile` 设置基础白名单
- 沙盒模式限制更严格

### 敏感操作
- 相机/屏幕录制需用户授权
- 避免直接 `system.run`
- 外发消息需用户确认

---

## 7. 常用命令

```bash
# Gateway 管理
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw status

# 节点管理
openclaw nodes list
openclaw nodes approve <id>

# 配置
openclaw configure --section providers
openclaw configure --section channels

# 工具
openclaw tools list
```

---

## 8. Skills (技能)

内置 Skills 位置: `~/.npm-global/lib/node_modules/openclaw/skills/`

| Skill | 用途 |
|-------|------|
| coding-agent | 委托编码任务给 Codex/Claude Code |
| healthcheck | 安全审计/主机加固 |
| skill-creator | 创建/更新 AgentSkills |
| tmux | tmux 会话控制 |
| weather | 天气查询 |

---

## 9. 协议要点

### WebSocket 消息格式
```json
// 请求
{ "type": "req", "id": "xxx", "method": "agent", "params": {...} }

// 响应
{ "type": "res", "id": "xxx", "ok": true, "payload": {...} }

// 事件
{ "type": "event", "event": "agent", "payload": {...} }
```

### 认证
- 可设置 `OPENCLAW_GATEWAY_TOKEN` 或 `--token`
- 设备配对需签名 `connect.challenge` nonce

---

## 10. 远程访问

- **首选**: Tailscale / VPN
- **备选**: SSH tunnel
  ```bash
  ssh -N -L 18789:127.0.0.1:18789 user@host
  ```

---

*更多文档: https://docs.openclaw.ai*
