// שרת סטטי קטן לתיקיית הפרויקט (מודולי ES לא נטענים מ-file://)
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.png': 'image/png', '.jpg': 'image/jpeg' };

function serve(port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(ROOT, rel === '/' ? '/src/index.html' : rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        return res.end('not found');
      }
      const size = fs.statSync(file).size;
      const head = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
      // תמיכה ב-Range, כדי שאפשר יהיה לקפוץ בזמן בפסקול בתצוגה המקדימה
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (m) {
        const start = m[1] ? Number(m[1]) : 0;
        const end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
        res.writeHead(206, { ...head, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
      res.writeHead(200, { ...head, 'Content-Length': size });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
}
module.exports = { serve, ROOT };

if (require.main === module) serve(Number(process.env.PORT) || 4173).then(({ url }) => console.log(`תצוגה מקדימה: ${url}/src/index.html`));
