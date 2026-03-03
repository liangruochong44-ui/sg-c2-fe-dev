# Session: 2026-03-03 06:05:35 UTC

- **Session Key**: agent:main:main
- **Session ID**: 0e30f42d-1d6b-40b2-bab3-cd48d1294656
- **Source**: webchat

## Conversation Summary

user: A new session was started via /new or /reset. Execute your Session Startup sequence now - read the required files before responding to the user. Then greet the user in your configured persona, if one is provided. Be yourself - use your defined voice, mannerisms, and mood. Keep it to 1-3 sentences and ask what they want to do. If the runtime model differs from default_model in the system prompt, mention the default model. Do not mention internal steps, files, tools, or reasoning.
assistant: [[reply_to_current]] 冲哥，0128 在，今天继续稳扎稳打。你现在最想先推进哪件事——AI内容、游戏开发，还是先处理个具体小问题？
user: [Tue 2026-03-03 13:59 GMT+8] 告诉我open claw的skill的注册的规范
assistant: [[reply_to_current]] 可以，给你一版 **OpenClaw Skill 注册/接入规范（实用版）**：

### 1) 本地被 OpenClaw 识别（“注册”）的最低要求
把 Skill 放在工作区目录下（通常）：
`~/.openclaw/workspace/skills/<skill-name>/`

且目录里必须有 `SKILL.md`，格式是：

```md
---
name: your-skill-name
description: 这个 skill 做什么、在什么场景触发
---

# 指令正文
...
```

**硬性点：**
- 必须有 `name`、`description`（frontmatter）
- `description` 要写清“何时使用”，这是触发关键
- 新增后需要 **刷新 skills 或重启 gateway**，新会话才会稳定生效

---

### 2) 目录结构规范（推荐）
```text
<skill-name>/
├── SKILL.md          # 必需
├── scripts/          # 可选：可执行脚本
├── references/       # 可选：参考文档
└── assets/           # 可选：模板/素材
```

---

### 3) 命名与内容规范（建议按这个来）
- 名称建议：小写 + 连字符（`kebab-case`），如 `game-design-helper`
- `SKILL.md` 保持精简，核心流程写在正文
- 大段细节放 `references/`，避免主文件过长
- 不要塞一堆无关文档（README/CHANGELOG 这类对模型执行无直接价值的文件）

---

### 4) 如果你说的“注册”是发布到公共仓库 ClawHub
发布命令（示例）：
```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0 --tags latest
```

**发布侧关键规范：**
- 技能包可被解析出 `SKILL.md` 与元数据
- 版本号用 semver（如 `1.0.0`）
- slug 唯一、可持续迭代
- 公开可见（ClawHub 是公开注册表）

---

如果你要，我可以下一步直接给你一个“可提交的最小合规 skill 模板”，你粘进去就能用。
user: [Tue 2026-03-03 14:01 GMT+8] 列出你的所有的skill
assistant: [[reply_to_current]] 我当前可用的 skills 有这些（15 个）：

1. 1password  
2. apple-notes  
3. apple-reminders  
4. clawhub  
5. coding-agent  
6. healthcheck  
7. mcporter  
8. model-usage  
9. obsidian  
10. peekaboo  
11. session-logs  
12. skill-creator  
13. weather  
14. worldbuilding-nightly  

要不要我顺便按“你现在最常用场景（AI内容/游戏开发）”给你推荐前 3 个最值得先用的？
user: [Tue 2026-03-03 14:02 GMT+8] /Users/lrc/.openclaw/skills/qqmail-send，修改配置文件让openclaw能识别这个skill
user: [Tue 2026-03-03 14:03 GMT+8] 现在什么情况了
assistant: [[reply_to_current]] 现在进展是：

- ✅ 我已经把配置改好了：`/Users/lrc/.openclaw/skills` 已加入 `skills.load.extraDirs`，`qqmail-send` 这个 skill 所在目录现在在扫描范围内。  
- ⚠️ 目前卡在 **Gateway token mismatch**（网关令牌不一致），所以我这边没法正常完成重启后的连通验证。

要不要我继续直接帮你把 token 对齐并重启网关？我可以一把处理完。
user: [Tue 2026-03-03 14:04 GMT+8] 我已经完成了网管的重启
assistant: [[reply_to_current]] 好的，已确认现在状态正常：

- 网关已可达（`openclaw status` 正常）
- `qqmail-send` 目录存在，且 `SKILL.md` 存在
- 配置里也已经包含 `/Users/lrc/.openclaw/skills`

下一步你只要**开一个新会话**（或执行一次“refresh skills”）就会被识别进可用 skills 列表。  
要不要我接着帮你做一次触发测试（比如给一条会命中 `qqmail-send` 的测试指令）？
