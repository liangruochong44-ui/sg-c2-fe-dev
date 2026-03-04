# HEARTBEAT.md

## ⚠️ 重要：执行完成后必须输出完整报告

**每次心跳执行完成后，必须输出一份完整的报告，包含：**
- 所有任务执行状态
- 任何异常/错误信息
- 有价值的信息发现
- 如果没有异常，也需要确认"一切正常"

## 任务清单 

### 1. 进行工作区的git提交
- 以你的名字进行git的提交
- 并且整理工作区，将散落的文件整理到文件夹中

### 2. 项目探索
- 探索 workspace 下的项目 (vision-cli, 等)
- 了解代码结构和用途

### 3. Memory 整理
- 查看 memory/ 下的日记
- 更新 MEMORY.md 重要内容


### 4. 检查新邮件
- 使用 qqmail-skill 检查 QQ 邮箱收件箱
- 命令: `python3 ~/.openclaw/skills/qqmail-skill/scripts/mail.py list -f 1090712389@qq.com -p "nkfsfogixreoihjb" -n 5`
- 如有新邮件，提取发件人、主题发送给用户

### 5. 热门网站头条爬取
- 使用 web_fetch 爬取10个热门网站的最新头条
- 网站列表：
  1. 36kr: https://www.36kr.com/
  2. 虎嗅: https://www.huxiu.com/
  3. 知乎: https://www.zhihu.com/
  4. 少数派: https://sspai.com/
  5. 腾讯新闻: https://news.qq.com/
  6. 微博: https://weibo.com/
  7. BBC: https://www.bbc.com/news
  8. TechCrunch: https://techcrunch.com/
  9. The Verge: https://www.theverge.com/
  10. Hacker News: https://news.ycombinator.com/
- 每网站提取3-5条最新头条
- 输出为 md 文档保存到 memory/heartbeat-news-YYYY-MM-DD.md

### 6. BlogWatcher 网站监控
- 执行 `blogwatcher scan` 扫描已配置的网站
- 执行 `blogwatcher articles -a | head -30` 查看最新文章
- 如有新文章，提取标题、博客名、URL
- 输出到上面的 md 文档中

---
