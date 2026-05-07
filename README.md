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


## 本地运行

```bash
node scripts/update-pricing.mjs
node scripts/build-site.mjs
```

然后直接打开：

```bash
open index.html

