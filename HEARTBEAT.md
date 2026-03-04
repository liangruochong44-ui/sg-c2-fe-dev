# HEARTBEAT.md

## ⚠️ 重要：执行完成后必须输出完整报告

**每次心跳执行完成后，必须输出一份完整的报告，包含：**
- 所有任务执行状态
- 任何异常/错误信息
- 有价值的信息发现
- **最后必须通过QQ邮箱发送给自己**

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

### 5. 热门网站头条爬取（增强版）
- 使用 web_fetch 爬取网站的 RSS 或页面内容
- 网站列表：
  1. 36kr: https://www.36kr.com/information/rss/
  2. 虎嗅: https://www.huxiu.com/
  3. 知乎: https://www.zhihu.com/
  4. 少数派: https://sspai.com/
  5. 腾讯新闻: https://news.qq.com/
  6. 微博: https://weibo.com/
  7. BBC: https://www.bbc.com/news/rss.xml
  8. TechCrunch: https://techcrunch.com/feed/
  9. The Verge: https://www.theverge.com/rss/index.xml
  10. Hacker News: https://news.ycombinator.com/rss
- **每网站至少获取5-10条最新头条**，使用 maxChars=15000 获得更多内容
- 对每个网站优先尝试RSS feed，如果没有RSS再爬取网页
- **⚠️ 重要：不要直接罗列标题+链接，要提炼成人类易读的一句话资讯！**

### 6. BlogWatcher 网站监控
- 执行 `blogwatcher scan` 扫描已配置的网站
- 执行 `blogwatcher articles -a | head -30` 查看最新文章
- **提炼成一句话资讯**，不要简单罗列标题
- 输出到报告

### 7. 生成报告并发送邮件
- 报告格式：**提炼型中文资讯简报**
- **核心原则：不罗列链接，只输出有价值的一句话总结**
- 包含：
  - 📊 执行概览（任务状态，一句话总结）
  - 🔥 今日热门资讯（提炼后的关键信息，每条不超过20字）
  - 💡 值得关注的趋势/事件（如有）
  - 📧 邮箱状态（简报）
  - ⚠️ 异常/错误（如有）
- **md文档保存到**: `memory/heartbeat-report-YYYY-MM-DD.md`
- **使用 qqmail-skill 发送邮件给自己（正文形式，不要附件）**
- 命令: `python3 ~/.openclaw/skills/qqmail-skill/scripts/mail.py send -f 1090712389@qq.com -p "nkfsfogixreoihjb" -t 1090712389@qq.com -s "[心跳] YYYY-MM-DD 日报" -b "完整报告内容"`
- 邮件主题: `[心跳] YYYY-MM-DD 日报`
- 正文: **直接写入完整报告内容，不要使用附件**

---
