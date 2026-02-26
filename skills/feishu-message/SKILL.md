# feishu-message Skill

用于给冲哥发送飞书消息。

## 前提

- Gateway 运行中
- Feishu 渠道已配置（appId/appSecret 已设置）

## 冲哥的信息

- **飞书 openId**: `ou_644237d2984f70248d68e105893be6fa`
- 用途：直接发送 DM（私聊）给冲哥

## 发送消息

使用 `message` 工具：

```json
{
  "action": "send",
  "channel": "feishu",
  "target": "user:ou_644237d2984f70248d68e105893be6fa",
  "message": "内容"
}
```

## Cron 定时发送

创建定时任务示例（2分钟后）：

```bash
# 计算未来时间
date -d "+2 minutes" -Iseconds
# 创建任务
openclaw cron create --name "feishu-test" --at "2026-02-25T16:44:47+08:00" --message "发送测试消息到飞书" --channel feishu --session isolated
```

参数说明：
- `--name`: 任务名称
- `--at`: 执行时间（ISO 格式）
- `--message`: 要说的话（会被发送到 isolated session 处理）
- `--channel feishu`: 通过飞书发送结果
- `--session isolated`: 在独立会话中执行（不影响主会话）

## 处理流程

当 cron 触发时：
1. 启动 isolated session
2. Session 读取此 skill 或执行指定 message
3. 使用 message 工具发送到 feishu
4. 结果通过 --channel 指定的渠道返回

## 测试

- 创建测试任务后，到时间检查飞书 DM 是否收到
- 如果失败，查看 Gateway 日志排查
