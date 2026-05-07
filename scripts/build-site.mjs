import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const models = JSON.parse(await fs.readFile(path.join(dataDir, 'models.json'), 'utf8'));
const meta = JSON.parse(await fs.readFile(path.join(dataDir, 'meta.json'), 'utf8'));

meta.lastBuildAt = new Date().toISOString();
await fs.writeFile(path.join(dataDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

const badge = (status) => {
  if (status === 'new') return '<span class="badge badge-new">NEW</span>';
  return '<span class="badge badge-same">SAME</span>';
};

const sectionTitle = {
  international: '国际主流 AI 语言模型',
  china: '中国主流 AI 语言模型'
};

const grouped = {
  international: models.filter(m => m.region === 'international'),
  china: models.filter(m => m.region === 'china')
};

const cardHtml = (m) => `
<article class="card ${m.region === 'china' ? 'china' : 'top'}">
  <div class="card-head">
    <div>
      <div class="provider">${m.provider}</div>
      <h3>${m.name}</h3>
    </div>
    ${badge(m.status)}
  </div>
  <div class="price">${m.price}</div>
  <div class="charging-status">${m.chargingStatus}</div>
  <p class="desc">${m.description}</p>
  <div class="notes">${m.notes}</div>
  <div class="meta-line">最近检查：${m.lastChecked ? new Date(m.lastChecked).toLocaleString('zh-CN', { hour12: false }) : '尚未检查'}</div>
  ${m.changeSummary ? `<div class="change">变化说明：${m.changeSummary}</div>` : ''}
</article>`;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.siteTitle}</title>
  <style>
    :root {
      --bg:#060816;--panel:rgba(15,22,48,.76);--line:rgba(255,255,255,.1);--text:#eef3ff;--muted:#aab7d6;
      --cyan:#62e6ff;--violet:#8b7bff;--pink:#ff5fd2;--green:#7ef0a7;--red:#ff5f7a;
    }
    *{box-sizing:border-box} body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;color:var(--text);background:
    radial-gradient(circle at 10% 10%, rgba(98,230,255,.18), transparent 28%),
    radial-gradient(circle at 85% 12%, rgba(255,95,210,.16), transparent 28%),
    radial-gradient(circle at 55% 85%, rgba(139,123,255,.16), transparent 30%),
    linear-gradient(180deg,#050814 0%,#0a1021 55%,#05070f 100%);} .wrap{width:min(1280px,calc(100% - 32px));margin:0 auto;padding:28px 0 56px}
    .hero,.section,.footer{border:1px solid var(--line);background:var(--panel);backdrop-filter:blur(18px);border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.35)}
    .hero{padding:32px}.eyebrow{display:inline-block;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);font-size:13px}
    h1{font-size:clamp(34px,6vw,68px);line-height:.98;letter-spacing:-.03em;margin:16px 0 14px}.gradient{background:linear-gradient(90deg,#fff 0%,#93f3ff 35%,#b295ff 68%,#ffd36a 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
    .lead{max-width:900px;color:var(--muted);font-size:17px;line-height:1.8}.sub{margin-top:12px;color:var(--muted);font-size:14px;line-height:1.8}
    .section{margin-top:26px;padding:24px}.section h2{margin:0 0 10px;font-size:clamp(24px,4vw,38px)} .section p{margin:0 0 18px;color:var(--muted);line-height:1.8}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.card{position:relative;overflow:hidden;padding:22px;border-radius:24px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(16,23,49,.88),rgba(11,16,34,.92))}
    .card-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.provider{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em}.card h3{margin:6px 0 0;font-size:28px;letter-spacing:-.03em}
    .badge{display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid rgba(255,255,255,.12)} .badge-new{background:rgba(255,95,122,.12);color:#ffd7de;border-color:rgba(255,95,122,.35)} .badge-same{background:rgba(126,240,167,.12);color:#ddffe8;border-color:rgba(126,240,167,.35)}
    .price{margin:18px 0 8px;font-size:clamp(28px,5vw,48px);font-weight:900;letter-spacing:-.04em}.charging-status{display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);font-size:13px;color:#dce8ff;margin-bottom:14px}
    .desc,.notes,.meta-line,.change{font-size:14px;line-height:1.85}.desc{color:#d8e2fb}.notes,.meta-line{color:var(--muted)} .change{margin-top:10px;color:#ffd7de}
    .footer{margin-top:26px;padding:20px 24px;color:var(--muted);line-height:1.9;font-size:14px}
    @media (max-width:980px){.grid{grid-template-columns:1fr}.hero,.section,.footer{padding:20px}}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <div class="eyebrow">可部署到 GitHub Pages · 自动每日检查价格变化</div>
      <h1><span class="gradient">${meta.siteTitle}</span></h1>
      <p class="lead">这不是一张 API 价目表，而是一张面向真实用户的 AI 月费图鉴：只看订阅，不看 token；只看语言模型，不看图像、音频、视频。</p>
      <p class="sub">最近构建：${new Date(meta.lastBuildAt).toLocaleString('zh-CN', { hour12: false })} ｜ 最近数据检查：${meta.lastDataCheckAt ? new Date(meta.lastDataCheckAt).toLocaleString('zh-CN', { hour12: false }) : '尚未检查'} ｜ 红色 NEW = 今天发现价格变化 ｜ 绿色 SAME = 与前一天一致</p>
    </section>
    ${Object.entries(grouped).map(([key, items]) => `
      <section class="section">
        <h2>${sectionTitle[key]}</h2>
        <p>${key === 'international' ? '国际产品的月费体系已经相对成熟，20 美元附近是主流入门档，100~250 美元是重度工作流档。' : '中国市场还在从免费增长走向商业化验证，有的已经开始会员化，有的仍以平台和企业方案为主。'}</p>
        <div class="grid">
          ${items.map(cardHtml).join('')}
        </div>
      </section>
    `).join('')}
    <section class="footer">
      <strong style="color:#fff">说明：</strong>${meta.disclaimer}<br>
      本项目设计为可上传 GitHub 仓库：GitHub Actions 每天定时抓取已配置来源页面，比较价格字段是否变化，若变化则写入新值并标记 <strong style="color:#fff">NEW</strong>；若无变化，则维持前一日数据并显示 <strong style="color:#fff">SAME</strong>。
    </section>
  </div>
</body>
</html>`;

await fs.writeFile(path.join(root, 'index.html'), html);
console.log('Built index.html');
