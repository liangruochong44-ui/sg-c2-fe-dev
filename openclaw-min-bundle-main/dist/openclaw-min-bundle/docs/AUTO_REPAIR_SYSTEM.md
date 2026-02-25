# OpenClaw 自动修复系统

## 概述

OpenClaw 自动修复系统用于监控 Gateway 服务健康状态，并在服务出现配置错误或故障时自动进行修复。该系统能够检测 JSON 配置文件损坏、服务假死等问题，并尝试自动修复。

## 系统组成

```
┌─────────────────────────────────────────────────────────────────────┐
│                        自动修复系统架构                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                    │
│  │  openclaw-monitor│────▶│  openclaw-fix    │                    │
│  │     .sh          │     │     .sh          │                    │
│  │  (每分钟检查)    │     │  (修复脚本)      │                    │
│  └────────┬─────────┘     └────────┬─────────┘                    │
│           │                        │                               │
│           ▼                        ▼                               │
│  ┌─────────────────────────────────────────────┐                   │
│  │           systemd user services             │                   │
│  │  • openclaw-monitor.timer (定时器)          │                   │
│  │  • openclaw-fix.service (修复服务)         │                   │
│  │  • openclaw-gateway.service.d/auto-fix.conf│                   │
│  └─────────────────────────────────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 文件清单

### 1. 核心脚本 (需手动安装)

| 文件路径 | 说明 | 是否在 OpenClaw 目录 |
|----------|------|---------------------|
| `~/.local/bin/openclaw-fix.sh` | 修复脚本 | ❌ 需从源码复制 |
| `~/.local/bin/openclaw-monitor.sh` | 监控脚本 | ❌ 需从源码复制 |

**源码位置**: `.../dist/openclaw-min-bundle/scripts/`

### 2. systemd 配置 (需手动安装)

| 文件路径 | 说明 |
|----------|------|
| `~/.config/systemd/user/openclaw-fix.service` | 修复服务单元 |
| `~/.config/systemd/user/openclaw-monitor.service` | 监控服务单元 |
| `~/.config/systemd/user/openclaw-monitor.timer` | 定时器 (每分钟运行) |
| `~/.config/systemd/user/openclaw-gateway.service.d/auto-fix.conf` | Gateway 触发配置 |

### 3. systemd 配置源码

源码位置: `.../dist/openclaw-min-bundle/systemd-user/`

## 安装步骤 (迁移时需要执行)

### 步骤 1: 复制脚本到 ~/.local/bin/

```bash
# 创建目录
mkdir -p ~/.local/bin

# 复制修复脚本
cp /path/to/openclaw-min-bundle/scripts/openclaw-fix.sh ~/.local/bin/
cp /path/to/openclaw-min-bundle/scripts/openclaw-monitor.sh ~/.local/bin/

# 设置执行权限
chmod +x ~/.local/bin/openclaw-fix.sh
chmod +x ~/.local/bin/openclaw-monitor.sh
```

### 步骤 2: 安装 systemd 配置

```bash
# 创建配置目录
mkdir -p ~/.config/systemd/user
mkdir -p ~/.config/systemd/user/openclaw-gateway.service.d

# 复制 systemd 配置
cp /path/to/openclaw-min-bundle/systemd-user/openclaw-fix.service ~/.config/systemd/user/
cp /path/to/openclaw-min-bundle/systemd-user/openclaw-monitor.service ~/.config/systemd/user/
cp /path/to/openclaw-min-bundle/systemd-user/openclaw-monitor.timer ~/.config/systemd/user/
cp /path/to/openclaw-min-bundle/systemd-user/openclaw-gateway.service.d/auto-fix.conf ~/.config/systemd/user/openclaw-gateway.service.d/

# 重新加载 systemd
systemctl --user daemon-reload
```

### 步骤 3: 启用服务

```bash
# 启动 Gateway
systemctl --user start openclaw-gateway

# 启用定时监控
systemctl --user enable --now openclaw-monitor.timer
```

## 配置说明

### auto-fix.conf 关键配置

```ini
[Unit]
OnFailure=openclaw-fix.service        # 服务失败时触发修复
StartLimitIntervalSec=60              # 60秒内
StartLimitBurst=2                    # 失败2次则触发 OnFailure

[Service]
Restart=always                       # 总是自动重启
```

### 监控检测的错误类型

- `SyntaxError` - JSON 语法错误
- `JSON5` - JSON5 解析失败
- `Failed to read config` - 配置文件读取失败
- `Config invalid` - 配置无效

## 工作流程

```
1. openclaw-monitor.timer 每分钟触发 openclaw-monitor.sh

2. openclaw-monitor.sh 检测:
   ├── journal 日志中是否有配置错误
   ├── systemctl 服务是否 active
   ├── 端口 18789 是否监听
   └── HTTP 健康端点是否响应

3. 如果检测到问题:
   ├── 等待 10 秒后重试
   ├── 尝试重启服务最多 5 次
   └── 重启失败则调用 openclaw-fix.sh

4. openclaw-fix.sh:
   ├── 检测 JSON 配置是否有效
   ├── 如无效，使用 opencode 修复 JSON
   ├── 修复后重启 Gateway 服务
   └── 验证服务正常运行
```

## 故障排查

### 手动启动修复脚本

```bash
# 完整修复模式 (检测并修复 JSON，重启服务)
~/.local/bin/openclaw-fix.sh

# 仅检查模式 (不修复，只检查)
~/.local/bin/openclaw-fix.sh --check-only

# 手动触发监控 (立即检测一次)
~/.local/bin/openclaw-monitor.sh

# 通过 systemd 触发修复 (模拟服务失败)
systemctl --user start openclaw-fix.service
```

### 查看监控日志

```bash
tail -f ~/.local/share/openclaw/logs/monitor.log
```

### 查看修复脚本日志

修复脚本日志保存在 `/tmp/openclaw-1000/` 目录：

```bash
# 查看今天的日志
tail -f /tmp/openclaw-1000/openclaw-$(date +%Y-%m-%d).log

# 或查看所有日志
ls -la /tmp/openclaw-1000/
```

### 查看 Gateway 日志

```bash
journalctl --user -u openclaw-gateway -f
```

### 查看修复服务日志

```bash
journalctl --user -u openclaw-fix.service -f
```

### 手动运行修复脚本

```bash
# 完整修复模式
~/.local/bin/openclaw-fix.sh

# 仅检查模式
~/.local/bin/openclaw-fix.sh --check-only

# 手动触发监控
~/.local/bin/openclaw-monitor.sh
```

### 重置失败状态

```bash
# 重置 Gateway 失败计数
systemctl --user reset-failed openclaw-gateway

# 重新加载配置
systemctl --user daemon-reload
```

## 迁移检查清单 (WSL → Mac)

- [ ] `~/.local/bin/openclaw-fix.sh`
- [ ] `~/.local/bin/openclaw-monitor.sh`
- [ ] `~/.config/systemd/user/openclaw-fix.service`
- [ ] `~/.config/systemd/user/openclaw-monitor.service`
- [ ] `~/.config/systemd/user/openclaw-monitor.timer`
- [ ] `~/.config/systemd/user/openclaw-gateway.service.d/auto-fix.conf`

## 注意事项

1. **opencode 依赖**: 修复脚本需要 `opencode` (Codex CLI) 来自动修复 JSON 配置
2. **端口**: 默认使用 18789 端口
3. **日志保留**: 监控日志保存在 `~/.local/share/openclaw/logs/`
4. **锁文件**: 使用 `flock` 防止脚本重复运行
