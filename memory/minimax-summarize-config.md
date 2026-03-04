# MiniMax 模型驱动 summarize 配置指南

## 概述

本文档介绍如何配置 `summarize` CLI 工具使用 MiniMax 模型进行 AI 总结。

## 前置要求

- 已安装 `summarize` CLI 工具
- 拥有 MiniMax API Key（支持 OpenAI 兼容格式）

## 配置步骤

### 1. 环境变量

在终端中设置以下环境变量：

```bash
# 替换为你的 MiniMax API Key
export OPENAI_API_KEY="sk-cp-xxxxxxxxxxxxx"

# MiniMax API 端点（OpenAI 兼容格式）
export OPENAI_BASE_URL="https://api.minimaxi.com/v1"
```

**注意**：是 `OPENAI_BASE_URL`，不是 `OPENAI_API_BASE`。

### 2. 模型名称格式

使用 LiteLLM 统一的命名格式：

```
openai/<model-id>
```

常用 MiniMax 模型：

| 模型名 | 说明 |
|--------|------|
| `openai/abab6.5s-chat` | MiniMax abab6.5s 对话模型 |
| `openai/MiniMax-M2.5` | MiniMax M2.5 模型 |
| `openai/MiniMax-M2.5-highspeed` | MiniMax M2.5 高速版本 |

### 3. 验证配置

```bash
# 测试 API 是否正常工作
curl -s "https://api.minimaxi.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的APIKEY" \
  -d '{"model": "abab6.5s-chat", "messages": [{"role": "user", "content": "hello"}], "max_tokens": 10}'
```

### 4. 使用示例

```bash
# 总结网页
OPENAI_API_KEY="sk-cp-xxx" OPENAI_BASE_URL="https://api.minimaxi.com/v1" \
  summarize "https://example.com" --force-summary --model "openai/abab6.5s-chat"

# 总结 YouTube 视频
OPENAI_API_KEY="sk-cp-xxx" OPENAI_BASE_URL="https://api.minimaxi.com/v1" \
  summarize "https://youtu.be/xxxx" --youtube auto --model "openai/abab6.5s-chat"

# 总结本地 PDF
OPENAI_API_KEY="sk-cp-xxx" OPENAI_BASE_URL="https://api.minimaxi.com/v1" \
  summarize "/path/to/file.pdf" --model "openai/abab6.5s-chat"
```

## 持久化配置（推荐）

### 方法 1：写入配置文件

创建 `~/.summarize/config.json`：

```bash
mkdir -p ~/.summarize
cat > ~/.summarize/config.json << 'EOF'
{
  "model": "openai/abab6.5s-chat"
}
EOF
```

然后每次只需设置环境变量即可：

```bash
export OPENAI_API_KEY="sk-cp-xxx"
export OPENAI_BASE_URL="https://api.minimaxi.com/v1"
summarize "https://example.com" --force-summary
```

### 方法 2：写入 shell 配置文件

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# MiniMax API 配置
export OPENAI_API_KEY="sk-cp-xxxxxxxxxxxxx"
export OPENAI_BASE_URL="https://api.minimaxi.com/v1"
```

然后执行 `source ~/.zshrc` 生效。

## 常见问题

### Q: 报错 "LLM returned an empty summary"

可能原因：
1. API Key 错误或过期
2. 模型名不兼容
3. 网络问题

排查步骤：
```bash
# 1. 验证 API Key
curl -s "https://api.minimaxi.com/v1/models" \
  -H "Authorization: Bearer 你的APIKEY"

# 2. 查看详细日志
summarize "https://example.com" --verbose
```

### Q: 报错 "Unsupported model provider"

LiteLLM 不支持该模型前缀。确保使用 `openai/` 前缀。

### Q: 内容太短不调用 AI

summarize 默认对短内容直接返回原文。使用 `--force-summary` 强制调用 AI。

## 完整命令速查

```bash
# 常用场景
summarize "URL" --force-summary --model "openai/abab6.5s-chat"

# 指定总结长度
summarize "URL" --length medium --force-summary --model "openai/abab6.5s-chat"

# 只提取内容，不总结
summarize "URL" --extract

# JSON 格式输出
summarize "URL" --json --model "openai/abab6.5s-chat"
```

## 相关文档

- [summarize GitHub](https://github.com/steipete/summarize)
- [LiteLLM 文档](https://docs.litellm.ai/)
- [MiniMax API 文档](https://platform.minimaxi.com/document)
