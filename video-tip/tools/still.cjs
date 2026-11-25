// פריימים בודדים לבדיקה: node tools/still.cjs 0.5 2.3 10   ->  out/stills/sheet.jpg
// עם --full כל פריים נשמר גם בגודל מלא.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { serve, ROOT } = require('./serve.cjs');

(async () => {
  const args = process.argv.slice(2);
  const full = args.includes('--full');
  const name = (args.find((a) => a.startsWith('--name=')) || '--name=sheet').split('=')[1];
  const times = args.filter((a) => !a.startsWith('--')).map(Number);
  const outDir = path.join(ROOT, 'out', 'stills');
  fs.mkdirSync(outDir, { recursive: true });
  const { server, url } = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: full ? 1 : 0.4 });
  page.on('console', (m) => m.type() === 'error' && console.log('[page error]', m.text()));
  page.on('pageerror', (e) => console.log('[page exception]', e.message));
  await page.goto(`${url}/src/index.html?render=1`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 });
  const shots = [];
  for (const t of times) {
    await page.evaluate((tt) => window.__seek(tt), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: full ? 92 : 80 });
    if (full) fs.writeFileSync(path.join(outDir, `${name}_${t.toFixed(2)}.jpg`), buf);
    shots.push({ t, src: 'data:image/jpeg;base64,' + buf.toString('base64') });
  }
  if (!full) {
    const cols = Math.min(shots.length, 4);
    const sheet = await browser.newPage({ viewport: { width: cols * 400, height: 100 } });
    await sheet.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},400px)">${shots
      .map((s) => `<div style="position:relative"><img src="${s.src}" style="width:400px;display:block"><b style="position:absolute;left:4px;top:4px;background:#000c;color:#0f0;font:bold 16px monospace;padding:2px 6px">${s.t.toFixed(2)}s</b></div>`)
      .join('')}</body>`);
    await sheet.screenshot({ path: path.join(outDir, name + '.jpg'), fullPage: true, type: 'jpeg', quality: 82 });
  }
  await browser.close();
  server.close();
})();
