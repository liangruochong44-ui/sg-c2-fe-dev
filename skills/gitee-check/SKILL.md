# gitee-check Skill

用于检查 Gitee 仓库的 issues，作为每日任务规划的一部分。

## 冲哥的 Gitee 配置

- **Token**: `af382479a92193a8a4f73c5aa71941bd`
- **用户名**: `ruochong-liang`
- **主要仓库**:
  - `ruochong-liang/doc` - 文档仓库
  - `ruochong-liang/game419` - 游戏项目

## 检查 issues

使用 curl 直接调用 Gitee API：

```bash
# 检查 doc 仓库的 open issues
curl -s "https://gitee.com/api/v5/repos/ruochong-liang/doc/issues?state=open&access_token=af382479a92193a8a4f73c5aa71941bd"

# 检查 game419 仓库的 open issues
curl -s "https://gitee.com/api/v5/repos/ruochong-liang/game419/issues?state=open&access_token=af382479a92193a8a4f73c5aa71941bd"
```

## 输出格式

检查后输出：

```
## 📋 Gitee Issues 检查

### doc 仓库
- #ID: [标签] 标题
- ...

### game419 仓库
- #ID: [标签] 标题
- ...

共 X 个 open issues
```

## 在 Cron 中使用

在每日任务规划流程中添加：

1. 调用上述 API 检查两个仓库
2. 汇总输出到任务规划中
