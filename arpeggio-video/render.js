// מרנדר את index.html לסרטון MP4 אנכי (1080x1920, 30fps) עם סאונד.
// שימוש:  node render.js [out.mp4] [--frames t1,t2,...]   (האחרון שומר רק תמונות בדיקה)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const args = process.argv.slice(2);
const out = path.resolve(args.find(a => a.endsWith('.mp4')) || 'arpeggio-hook.mp4');
const fi = args.indexOf('--frames');
const FPS = 30;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?render=1');
  await page.evaluate(() => window.fontsReady());
  const DUR = await page.evaluate(() => window.DUR);
  const canvas = await page.$('#c');

  if (fi >= 0) {                                   // תמונות בדיקה בלבד
    const dir = path.resolve(__dirname, '.frames'); fs.mkdirSync(dir, { recursive: true });
    for (const t of args[fi + 1].split(',').map(Number)) {
      await page.evaluate(t => window.renderFrame(t), t);
      await canvas.screenshot({ path: path.join(dir, `f_${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }

  const wav = path.join(require('os').tmpdir(), 'arpeggio.wav');
  fs.writeFileSync(wav, Buffer.from(await page.evaluate(() => window.exportWav()), 'base64'));

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', '-',
    '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.renderFrame(t), i / FPS);
    const buf = await canvas.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\r${i}/${n}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close(); console.log('\nנוצר:', out);
})();
