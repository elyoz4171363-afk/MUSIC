// גיטרה אקוסטית בקווים, מבט מלמעלה. יחידות: 400x1040, חור התהודה ב-(200,660).

export const G = {
  cx: 200,
  holeY: 660,
  holeR: 48,
  nutY: 150,
  bridgeY: 850,
  nutX: (i) => 200 + (i - 2.5) * 7.6,
  bridgeX: (i) => 200 + (i - 2.5) * 10.4,
};

const SCALE_LEN = G.bridgeY - G.nutY;
const fretY = (n) => G.nutY + SCALE_LEN * (1 - Math.pow(2, -n / 12));

export function guitarMarkup() {
  const p = [];
  const d = (cls, tag, attrs) => p.push(`<${tag} class="${cls}" pathLength="1" ${attrs} />`);

  // גוף
  const body =
    'M172 526 C120 520 78 550 76 610 C74 660 100 680 100 715 C100 750 40 770 38 850 ' +
    'C36 940 110 986 200 986 C290 986 364 940 362 850 C360 770 300 750 300 715 ' +
    'C300 680 326 660 324 610 C322 550 280 520 228 526 Z';
  p.push(`<path class="gf" d="${body}" />`);
  d('gd g-main', 'path', `d="${body}"`);
  // קו פנימי של הגוף
  const inner =
    'M174 540 C128 536 92 562 90 610 C88 654 114 676 114 715 C114 756 54 778 52 850 ' +
    'C50 930 118 972 200 972 C282 972 350 930 348 850 C346 778 286 756 286 715 ' +
    'C286 676 312 654 310 610 C308 562 272 536 226 540';
  d('gd g-thin', 'path', `d="${inner}"`);

  // חור התהודה והרוזטה
  p.push(`<circle class="gf g-hole" cx="200" cy="660" r="48" />`);
  d('gd g-thin', 'circle', 'cx="200" cy="660" r="64"');
  d('gd g-thin', 'circle', 'cx="200" cy="660" r="58"');
  d('gd g-main', 'circle', 'cx="200" cy="660" r="48" id="g-hole-ring"');

  // מגן פריטה
  d('gd g-thin', 'path', 'd="M246 640 C276 660 288 716 268 760 C246 756 238 734 246 716 C256 694 256 668 246 640 Z"');

  // גשר
  d('gd g-main', 'rect', 'x="142" y="840" width="116" height="24" rx="8"');
  d('gd g-thin', 'path', 'd="M170 849 L230 849"');
  for (let i = 0; i < 6; i++) p.push(`<circle class="gdot" cx="${G.bridgeX(i).toFixed(1)}" cy="857" r="2.4" />`);

  // צוואר ושחיף
  const neckEnd = 608;
  d('gd g-main', 'path', `d="M175 150 L225 150 L231 ${neckEnd} L169 ${neckEnd} Z"`);
  for (let n = 1; n <= 18; n++) {
    const y = fretY(n);
    if (y > neckEnd - 4) break;
    const w = 25 + ((y - 150) / (neckEnd - 150)) * 6;
    d('gd g-fret', 'path', `d="M${(200 - w).toFixed(1)} ${y.toFixed(1)} L${(200 + w).toFixed(1)} ${y.toFixed(1)}"`);
  }
  for (const n of [3, 5, 7, 9]) {
    const y = (fretY(n) + fretY(n - 1)) / 2;
    p.push(`<circle class="gdot" cx="200" cy="${y.toFixed(1)}" r="3" />`);
  }
  const y12 = (fretY(12) + fretY(11)) / 2;
  p.push(`<circle class="gdot" cx="190" cy="${y12.toFixed(1)}" r="3" /><circle class="gdot" cx="210" cy="${y12.toFixed(1)}" r="3" />`);

  // ראש ומפתחות הכיוון
  d('gd g-main', 'path', 'd="M175 150 L166 130 C158 108 156 62 162 36 Q200 20 238 36 C244 62 242 108 234 130 L225 150"');
  const posts = [118, 88, 58];
  for (const y of posts) {
    for (const side of [-1, 1]) {
      const px = 200 + side * 19;
      const kx = 200 + side * 54;
      d('gd g-thin', 'path', `d="M${200 + side * 39} ${y} L${kx - side * 8} ${y}"`);
      d('gd g-main', 'ellipse', `cx="${kx}" cy="${y}" rx="9" ry="6.5"`);
      p.push(`<circle class="gdot" cx="${px}" cy="${y}" r="3.2" />`);
    }
  }

  // מיתרים: מהגשר עד האום (מתעדכנים בכל פריים), ומהאום אל המפתחות
  const postOf = [
    [181, 118],
    [181, 88],
    [181, 58],
    [219, 58],
    [219, 88],
    [219, 118],
  ];
  for (let i = 0; i < 6; i++) {
    p.push(`<path class="gs" data-i="${i}" pathLength="1" d="M${G.nutX(i)} ${G.nutY} L${G.bridgeX(i)} ${G.bridgeY}" style="stroke-width:calc(${(2.3 - i * 0.24).toFixed(2)}px * var(--inv, 1))" />`);
    p.push(`<path class="gs gs-head" pathLength="1" d="M${G.nutX(i)} ${G.nutY} L${postOf[i][0]} ${postOf[i][1]}" style="stroke-width:calc(${(2.0 - i * 0.2).toFixed(2)}px * var(--inv, 1))" />`);
  }
  // אום
  d('gd g-main', 'path', 'd="M174 150 L226 150"');

  // קורי עכביש בפינה שבין הצוואר לגוף
  const web = [];
  const cxw = 232, cyw = 524;
  const angs = [-86, -62, -38, -14].map((a) => (a * Math.PI) / 180);
  for (const a of angs) web.push(`M${cxw} ${cyw} L${(cxw + Math.cos(a) * 92).toFixed(1)} ${(cyw + Math.sin(a) * 92).toFixed(1)}`);
  for (const r of [30, 52, 74]) {
    let s = '';
    angs.forEach((a, k) => {
      const x = cxw + Math.cos(a) * r, y = cyw + Math.sin(a) * r;
      if (k === 0) s += `M${x.toFixed(1)} ${y.toFixed(1)}`;
      else {
        const am = (a + angs[k - 1]) / 2;
        const qx = cxw + Math.cos(am) * r * 0.8, qy = cyw + Math.sin(am) * r * 0.8;
        s += ` Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    });
    web.push(s);
  }
  p.push(`<path class="gweb" pathLength="1" d="${web.join(' ')}" />`);

  return p.join('\n');
}
