# AI Model Subscriptions Site

一个可上传到 GitHub 仓库并部署到 GitHub Pages 的静态网页项目。

## 功能

- 展示国际与中国主流 AI 语言模型的月度订阅费用
- 每天通过 GitHub Actions 定时执行更新
- 若某模型价格发生变化：
  - 更新数据
  - 页面显示红色 `NEW`
- 若无变化：
  - 保持前一日数据
  - 页面显示绿色 `SAME`

## 重要说明

本项目当前 **不使用 Tavily API**。

同时要明确一点：
**GitHub 免费额度并不等于通用的免费网页搜索 API。**

所以本项目采用的是更稳的方案：

- 使用 **GitHub Actions 免费运行时** 定时任务
- 直接抓取你指定的 **官方来源页面**
- 在仓库内比对 JSON 数据并重新生成静态网页

这意味着：
- 不依赖 Tavily
- 不依赖 Gemini CLI 的联网搜索
- 也不假设 GitHub 自带“免费全网搜索接口”

## 本地运行

```bash
node scripts/update-pricing.mjs
node scripts/build-site.mjs
```

然后直接打开：

```bash
open index.html
```

## 部署到 GitHub Pages

1. 新建 GitHub 仓库
2. 上传整个 `ai-model-subscriptions-site/` 目录内容
3. 在仓库 Settings → Pages 中启用 GitHub Pages
4. GitHub Actions 会每天自动执行 `.github/workflows/update-site.yml`

## 后续要做的关键增强

当前项目骨架已经具备：
- 数据文件 `data/models.json`
- 页面生成器 `scripts/build-site.mjs`
- 每日更新器 `scripts/update-pricing.mjs`
- 定时任务 `.github/workflows/update-site.yml`

但 `update-pricing.mjs` 里的“价格抓取逻辑”现在还是占位框架。

下一步需要为每个模型补：

- 官方来源 URL
- 页面抓取规则
- 从页面中提取月费字段的 parser

例如：
- OpenAI → 抓官方 pricing/help 页面
- Claude → 抓官方 support 页面
- Gemini → 抓官方 AI plan 页面
- DeepSeek / Qwen / 豆包 / Kimi / MiniMax → 抓各自公开产品页或正式公告页

## 建议工作流

如果你继续让我做，最稳的方式是：

1. 先确定每个模型的官方来源页面
2. 我逐个写 parser
3. 本地测试抓取结果
4. 再提交到 GitHub 仓库

这样项目就会真正进入“每天自动检查价格变化”的状态。
