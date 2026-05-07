import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const modelsPath = path.join(dataDir, 'models.json');
const metaPath = path.join(dataDir, 'meta.json');

const todayIso = new Date().toISOString();
const models = JSON.parse(await fs.readFile(modelsPath, 'utf8'));
const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));

// 说明：
// 这里采用“官方页面抓取 + 规则解析”的思路，而不是 Tavily。
// 当前先提供稳定项目骨架与状态流转：
// - price 未变 => SAME
// - 若你后续补充具体 parser，则 price 变更后自动标记 NEW
//
// 可扩展方式：
// 1. 为每个模型增加 fetchUrl / parserType
// 2. 使用 fetch + 正则 / DOMParser / cheerio 提取月费字段
// 3. 对比旧值，发生变化时写回 new price 与 changeSummary

for (const model of models) {
  const oldPrice = model.price;

  // TODO: 在这里按 model.id 编写官方页面抓取逻辑
  // const latestPrice = await detectLatestPrice(model)
  const latestPrice = oldPrice;

  model.lastChecked = todayIso;

  if (latestPrice !== oldPrice) {
    model.price = latestPrice;
    model.status = 'new';
    model.lastChanged = todayIso;
    model.changeSummary = `价格由 ${oldPrice} 更新为 ${latestPrice}`;
  } else {
    model.status = 'same';
    model.changeSummary = '';
  }
}

meta.lastDataCheckAt = todayIso;

await fs.writeFile(modelsPath, JSON.stringify(models, null, 2) + '\n');
await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + '\n');

console.log('Pricing data checked.');
