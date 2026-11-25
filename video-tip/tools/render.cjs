// מרנדר את הסרטון: כל פריים מצולם מהדפדפן ונשלח ישר ל-ffmpeg יחד עם הפסקול.
// הרצה: node tools/render.cjs [--fps=60] [--workers=4] [--from=0] [--to=41.4] [--out=out/video.mp4]
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { serve, ROOT } = require('./serve.cjs');

const arg = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=')[1] : def;
};

(async () => {
  const { server, url } = await serve();
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
  const workers = Number(arg('workers', 4));

  const pages = [];
  for (let i = 0; i < workers; i++) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.error('[page exception]', e.message));
    await page.goto(`${url}/src/index.html?render=1`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });
    const cdp = await page.context().newCDPSession(page);
    pages.push({ page, cdp });
  }
  const meta = await pages[0].page.evaluate(() => ({ duration: window.__duration, fps: window.__fps }));
  const fps = Number(arg('fps', meta.fps));
  const from = Number(arg('from', 0));
  const to = Number(arg('to', meta.duration));
  const first = Math.round(from * fps);
  const last = Math.round(to * fps); // לא כולל
  const total = last - first;
  const out = path.resolve(ROOT, arg('out', 'out/video.mp4'));
  const audio = path.join(ROOT, 'out', 'soundtrack.wav');
  if (!fs.existsSync(audio)) throw new Error('חסר פסקול: הריצו קודם node tools/audio.mjs');

  const ff = spawn(
    'ffmpeg',
    [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-ss', String(from), '-t', String(to - from), '-i', audio,
      '-map', '0:v', '-map', '1:a',
      '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', arg('crf', '15'), '-profile:v', 'high', '-level', '4.2',
      '-g', String(fps * 2), '-bf', '2',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
      '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
      '-t', String(to - from), '-movflags', '+faststart',
      out,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );
  const ffDone = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error('ffmpeg exit ' + code)))));

  // העובדים מרנדרים במקביל, והפריימים נכתבים ל-ffmpeg לפי הסדר
  const ready = new Map();
  let nextTake = first;
  let nextWrite = first;
  let writing = false;
  const t0 = Date.now();
  async function flush() {
    if (writing) return;
    writing = true;
    while (ready.has(nextWrite)) {
      const buf = ready.get(nextWrite);
      ready.delete(nextWrite);
      nextWrite++;
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      const done = nextWrite - first;
      if (done % 120 === 0 || done === total) {
        const el = (Date.now() - t0) / 1000;
        process.stdout.write(`\r${done}/${total} פריימים  (${(done / el).toFixed(1)} fps)   `);
      }
    }
    writing = false;
  }
  async function work({ page, cdp }) {
    for (;;) {
      const i = nextTake++;
      if (i >= last) return;
      while (i - nextWrite > 48) await new Promise((r) => setTimeout(r, 4));
      await page.evaluate((t) => window.__seek(t), i / fps);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false });
      ready.set(i, Buffer.from(data, 'base64'));
      flush();
    }
  }
  await Promise.all(pages.map(work));
  while (nextWrite < last) {
    await flush();
    await new Promise((r) => setTimeout(r, 5));
  }
  ff.stdin.end();
  await ffDone;
  await browser.close();
  server.close();
  const mb = fs.statSync(out).size / 1e6;
  console.log(`\nנשמר: ${out}  (${mb.toFixed(1)}MB, ${((Date.now() - t0) / 1000).toFixed(0)} שניות)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
