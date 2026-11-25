// האנימציה כולה. הכול נגזר מהזמן t בלבד (בלי אנימציות CSS ובלי שעון אמיתי),
// כך שאפשר לקפוץ לכל פריים ולקבל בדיוק אותה תמונה: seek(t).

import * as T from './timing.js';
import { G, guitarMarkup } from './guitar.js';

const gsap = window.gsap;
const RENDER = new URLSearchParams(location.search).has('render');
if (RENDER) document.body.classList.add('render');

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const { SC, HOOK, GUITAR, CTA, TUNE, TUNE_DONE } = T;

const C = {
  ink: '#0c0a08',
  cream: '#f6ecd9',
  muted: '#8f8573',
  amber: '#ffa32b',
  mint: '#8dffc0',
};

// ---------- כלי עזר ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TAU = Math.PI * 2;

function splitWords(el) {
  const parts = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return parts.map((word, i) => {
    const w = document.createElement('span');
    w.className = 'w';
    const wi = document.createElement('span');
    wi.className = 'wi';
    wi.textContent = word;
    w.appendChild(wi);
    el.appendChild(w);
    if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
    return wi;
  });
}
function splitChars(el) {
  const txt = el.textContent.trim();
  el.textContent = '';
  return [...txt].map((c) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
    return s;
  });
}
// מגדיל את האות כך שהשורה תתפוס בדיוק את הרוחב המבוקש
function fit(el, width, max = 999) {
  el.style.width = 'max-content';
  el.style.fontSize = '200px';
  const w = el.offsetWidth;
  const size = Math.min(max, (200 * width) / w);
  el.style.fontSize = size.toFixed(1) + 'px';
  return size;
}
function fitSame(els, width, max = 999) {
  const size = Math.min(...els.map((e) => fit(e, width, max)));
  els.forEach((e) => (e.style.fontSize = size.toFixed(1) + 'px'));
  return size;
}

const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', lazy: false, overwrite: false } });
const updaters = [];
const onFrame = (fn) => updaters.push(fn);

const show = (sel, from, to) => {
  tl.set(sel, { autoAlpha: 1 }, from);
  if (to != null) tl.set(sel, { autoAlpha: 0 }, to);
};
const rise = (els, at, o = {}) =>
  tl.fromTo(els, { yPercent: 118 }, { yPercent: 0, duration: o.dur ?? 0.6, ease: 'expo.out', stagger: o.stagger ?? 0.055 }, at);
const sink = (els, at, o = {}) => tl.to(els, { yPercent: -118, duration: o.dur ?? 0.28, ease: 'power3.in', stagger: o.stagger ?? 0.02 }, at);
// מילה ש"נוחתת" על המסך בדיוק ברגע impact
function slam(el, impact, o = {}) {
  const dur = o.dur ?? 0.17;
  const start = Math.max(0, impact - dur);
  tl.fromTo(el, { scale: o.from ?? 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: impact - start, ease: 'power3.in' }, start);
  tl.to(el, { scale: 0.955, duration: 0.05, ease: 'power1.out' }, impact);
  tl.to(el, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, impact + 0.05);
}
function shake(target, at, mag = 16) {
  tl.to(
    target,
    {
      keyframes: [
        { x: -mag, y: mag * 0.55, duration: 0.034 },
        { x: mag * 0.8, y: -mag * 0.4, duration: 0.04 },
        { x: -mag * 0.5, y: mag * 0.25, duration: 0.045 },
        { x: mag * 0.25, y: -mag * 0.1, duration: 0.05 },
        { x: 0, y: 0, duration: 0.07 },
      ],
      ease: 'none',
    },
    at
  );
}
// "מכה" חוזרת על אלמנט שכבר על המסך: מצב ההתחלה נכנס לתוקף רק ברגע at
const hit = (target, from, to, at) => tl.fromTo(target, from, { ...to, immediateRender: false }, at);
const flash = (at, strength = 0.5) => hit('#flash', { opacity: strength }, { opacity: 0, duration: 0.34, ease: 'power2.out' }, at);
// מסך כתום שחוצה את הפריים ומחליף סצנה ברגע at
function wipe(at, axis = 'y') {
  const a = axis === 'y' ? 'yPercent' : 'xPercent';
  const other = axis === 'y' ? 'xPercent' : 'yPercent';
  tl.set('#wipe', { [a]: 101, [other]: 0, visibility: 'visible' }, at - 0.27);
  tl.to('#wipe', { [a]: 0, duration: 0.26, ease: 'power3.in' }, at - 0.26);
  tl.to('#wipe', { [a]: -101, duration: 0.36, ease: 'power3.out' }, at);
  tl.set('#wipe', { visibility: 'hidden' }, at + 0.37);
}
function swapHead(a, bWords, at) {
  tl.to(a, { y: -40, opacity: 0, duration: 0.24, ease: 'power2.in' }, at - 0.2);
  tl.set(bWords[0].closest('.head'), { autoAlpha: 1 }, at);
  rise(bWords, at, { stagger: 0.045 });
}

// ---------- מיתרים רוטטים (קנבס) ----------
// כל מיתר נע כמו מיתר אמיתי: גל עומד עם כמה אופנים, בעוצמה שנגזרת מהפריטות שבפסקול
function stringOffset(s, u, t, amp) {
  const f = 10.5 + s * 1.9;
  return (
    amp *
    (Math.sin(Math.PI * u) * Math.sin(TAU * f * t + s * 1.7) +
      0.34 * Math.sin(2 * Math.PI * u) * Math.sin(TAU * f * 1.93 * t + s) +
      0.14 * Math.sin(3 * Math.PI * u) * Math.sin(TAU * f * 2.9 * t))
  );
}
const STRING_W = [8.5, 7.2, 6, 4.8, 3.8, 3];
function drawStrings(ctx, t, o) {
  ctx.clearRect(0, 0, T.W, T.H);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const SEG = 48;
  const pt = (s, u, off) => {
    const along = o.from + (o.to - o.from) * u;
    return o.dir === 'h' ? [along, o.pos(s) + off] : [o.pos(s) + off, along];
  };
  for (let s = 0; s < 6; s++) {
    const st = o.style(s, t);
    if (!st || st.alpha <= 0.002) continue;
    const amp = st.amp;
    const w = STRING_W[s] * (o.wScale ?? 1);
    ctx.strokeStyle = st.color;
    ctx.fillStyle = st.color;
    if (amp > 1.2) {
      // המעטפת: האזור שהמיתר "מטשטש" כשהוא רוטט
      ctx.beginPath();
      for (let k = 0; k <= SEG; k++) {
        const u = k / SEG;
        const [x, y] = pt(s, u, amp * 0.92 * Math.sin(Math.PI * u) + w / 2);
        k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let k = SEG; k >= 0; k--) {
        const u = k / SEG;
        const [x, y] = pt(s, u, -amp * 0.92 * Math.sin(Math.PI * u) - w / 2);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.globalAlpha = st.alpha * 0.2 * Math.min(1, amp / 10);
      ctx.fill();
    }
    ctx.beginPath();
    for (let k = 0; k <= SEG; k++) {
      const u = k / SEG;
      const [x, y] = pt(s, u, amp > 0.05 ? stringOffset(s, u, t, amp) : 0);
      k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.globalAlpha = st.alpha;
    ctx.lineWidth = w;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// =====================================================================
//  בניית הסצנות
// =====================================================================
function build() {
  // ---------- 1 · הפתיחה ----------
  const complaints = [
    ['אין לי זמן', 600, 338, -5, 'r'],
    ['מאוחר מדי להתחיל', 84, 404, 4, 'l'],
    ['אין לי ציוד', 664, 480, 3, 'r'],
    ['אין לי כישרון', 120, 1262, -4, 'l'],
    ['הגיטרה שלי ישנה', 566, 1300, 5, 'r'],
    ['אין לי השראה', 96, 1412, 3, 'l'],
    ['אני לא מספיק טוב', 520, 1444, -3, 'r'],
  ];
  const bubbles = complaints.map(([txt, x, y, rot, side]) => {
    const b = document.createElement('div');
    b.className = 'bubble' + (side === 'l' ? ' l' : '');
    b.textContent = txt;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    $('#bubbles').appendChild(b);
    gsap.set(b, { rotation: rot });
    return b;
  });

  fit($('#h1'), 900);
  fit($('#h2'), 900);
  fit($('#h3'), 900, 400);
  fit($('#h4'), 900, 400);
  // קו המחיקה יושב על השורה השנייה
  const placeStrike = (strike, line) => {
    const r = line.offsetTop + line.offsetHeight / 2;
    strike.style.top = r - 150 + 'px';
  };
  placeStrike($('#strike1'), $('#h2'));

  show('#s1', 0, SC.guitar + 0.3);
  bubbles.forEach((b, i) => {
    const at = HOOK.bubbles[i];
    if (at < 0) gsap.set(b, { opacity: 1 });
    else tl.fromTo(b, { scale: 0.3, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2.2)' }, at);
    tl.to(b, { y: i % 2 ? -14 : 12, duration: 1.4, ease: 'sine.inOut' }, Math.max(0, at + 0.3));
    // לפני הפיצוץ: התלונות נשאבות פנימה ונעלמות
    const cx = 540 - (complaints[i][1] + 170);
    const cy = 890 - (complaints[i][2] + 40);
    tl.to(b, { x: cx * 0.42, y: cy * 0.42, scale: 0.2, opacity: 0, rotation: '+=' + (i % 2 ? 26 : -26), duration: 0.42, ease: 'power3.in' }, HOOK.strike + 0.14 + i * 0.012);
  });
  slam('#h1', HOOK.w1);
  slam('#h2', HOOK.w2);
  shake('#s1-dark', HOOK.w1, 14);
  shake('#s1-dark', HOOK.w2, 20);
  tl.to('#strike1 path', { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, HOOK.strike);
  shake('#h2', HOOK.strike + 0.16, 8);
  tl.to(['#h1', '#h2'], { color: '#6e6658', duration: 0.25 }, HOOK.strike + 0.12);
  tl.to('#s1-dark', { scale: 0.9, duration: 0.42, ease: 'power2.in' }, HOOK.strike + 0.18);

  // הפיצוץ הכתום
  tl.to('#amber1', { clipPath: 'circle(1260px at 540px 900px)', duration: 0.5, ease: 'expo.out' }, HOOK.boom - 0.02);
  tl.set('#chrome', { color: C.ink }, HOOK.boom + 0.07);
  tl.set('#s1-dark, #bubbles', { autoAlpha: 0 }, HOOK.boom + 0.5); // מוסתרים מאחורי הכתום, שלא ייחשפו ביציאה
  tl.fromTo('#h3', { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, ease: 'expo.out' }, HOOK.boom - 0.01);
  tl.set('#h4', { opacity: 0 }, 0);
  slam('#h4', HOOK.w4, { from: 3, dur: 0.15 });
  shake('#amber1 .poster', HOOK.boom, 18);
  shake('#amber1 .poster', HOOK.w4, 24);
  tl.to('#amber1 .poster', { scale: 1.05, duration: 1.6, ease: 'none' }, HOOK.w4 + 0.4);
  // יציאה: הפאנל מחליק למעלה וחושף את הגיטרה
  tl.to('#amber1', { yPercent: -101, duration: 0.5, ease: 'power4.inOut' }, SC.guitar - 0.3);
  tl.set('#chrome', { color: C.cream }, SC.guitar + 0.12);

  const stringsOnAmber = (id, a, b) => {
    const ctx = $(id).getContext('2d');
    onFrame((t) => {
      if (t < a - 0.1 || t > b) return;
      drawStrings(ctx, t, {
        dir: 'h',
        from: -20,
        to: T.W + 20,
        pos: (s) => 380 + s * 212,
        style: (s, tt) => ({ color: C.ink, alpha: 0.42, amp: T.stringAmp(s, tt) * 46 }),
      });
    });
  };
  stringsOnAmber('#strings1', HOOK.boom, SC.guitar + 0.3);

  // ---------- 2 · הגיטרה הישנה ----------
  const HOLE = { x: 678, y: 1090 };
  const LIE = { rot: -86, scale: 1.0 };
  const svg2 = $('#guitar-svg');
  svg2.innerHTML = `
    <defs>
      <radialGradient id="g-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <ellipse id="g-shade" cx="560" cy="1130" rx="560" ry="230" fill="url(#g-shadow)" />
    <g id="dust"></g>
    <g id="gtr">${guitarMarkup()}</g>
    <g id="puff"></g>`;
  const css = document.createElement('style');
  css.textContent = `
    #gtr .gd, #gtr .gs, #gtr .gweb { fill:none; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:1; stroke-dashoffset:1; }
    #gtr .g-main { stroke:${C.cream}; stroke-width:calc(3.6px * var(--inv, 1)); }
    #gtr .g-thin { stroke:${C.cream}; stroke-opacity:.5; stroke-width:calc(1.8px * var(--inv, 1)); }
    #gtr .g-fret { stroke:${C.cream}; stroke-opacity:.42; stroke-width:calc(1.6px * var(--inv, 1)); }
    #gtr .gs { stroke:${C.amber}; }
    #gtr .gs-head { stroke-opacity:.8; }
    #gtr .gweb { stroke:${C.cream}; stroke-opacity:.34; stroke-width:calc(1.1px * var(--inv, 1)); }
    #gtr .gf { fill:#1a130d; opacity:0; }
    #gtr .g-hole { fill:#070504; }
    #gtr .gdot { fill:${C.cream}; opacity:0; }
  `;
  document.head.appendChild(css);
  gsap.set('#gtr', { svgOrigin: `${G.cx} ${G.holeY}`, x: HOLE.x - G.cx, y: HOLE.y - G.holeY, rotation: LIE.rot, scale: LIE.scale });

  const a1 = splitWords($('#s2a1'));
  const a2 = splitWords($('#s2a2'));
  fitSame([$('#s2a1'), $('#s2a2')], 900, 190);
  const b1 = splitWords($('#s2b1'));
  const b2 = splitWords($('#s2b2'));
  const b3 = splitWords($('#s2b3'));
  fitSame([$('#s2b1'), $('#s2b2'), $('#s2b3')], 900, 176);
  gsap.set('#s2b', { autoAlpha: 0 });

  show('#s2', SC.guitar - 0.3, SC.tune + 0.5);
  rise(a1, SC.guitar + 0.05);
  rise(a2, SC.guitar + 0.4);
  tl.fromTo('#g-shade', { opacity: 0 }, { opacity: 1, duration: 1 }, GUITAR.draw);
  tl.to('#gtr .gd', { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.012 }, GUITAR.draw);
  tl.to('#gtr .gs', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', stagger: 0.03 }, GUITAR.draw + 0.5);
  tl.to('#gtr .gweb', { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, GUITAR.draw + 0.9);
  tl.to('#gtr .gf', { opacity: 1, duration: 0.6 }, GUITAR.draw + 0.5);
  tl.to('#gtr .gdot', { opacity: 0.8, duration: 0.3, stagger: 0.01 }, GUITAR.draw + 0.9);
  // אחרי הציור מבטלים את המקווקו כדי שהזום לא ישבור אותו
  tl.set('#gtr .gd, #gtr .gs, #gtr .gweb', { strokeDasharray: 'none' }, GUITAR.draw + 2.0);
  // גלישה איטית של "מצלמה"
  tl.to('#gtr', { rotation: LIE.rot + 3, x: '+=14', duration: GUITAR.zoom - GUITAR.draw, ease: 'sine.inOut' }, GUITAR.draw);
  // הפריטה החמוצה: הגיטרה נרעדת והאבק עף
  tl.to('#gtr', { keyframes: [{ y: '+=7', duration: 0.05 }, { y: '-=11', duration: 0.07 }, { y: '+=6', duration: 0.09 }, { y: '-=2', duration: 0.12 }], ease: 'sine.inOut' }, GUITAR.sour);

  // החלפת הטקסט
  sink([...a1, ...a2], GUITAR.swap - 0.28);
  tl.set('#s2a', { autoAlpha: 0 }, GUITAR.swap + 0.02);
  tl.set('#s2b', { autoAlpha: 1 }, GUITAR.swap);
  rise(b1, GUITAR.swap);
  rise(b2, GUITAR.swap + 0.55);
  rise(b3, GUITAR.swap + 0.75);

  // זום אל חור התהודה, שהופך לטבעת של הטיונר
  const RING = { x: 540, y: 930, r: 300 };
  sink([...b1, ...b2, ...b3], GUITAR.zoom - 0.12, { dur: 0.3 });
  tl.to('#g-shade, #dust, #gtr .gweb', { opacity: 0, duration: 0.3 }, GUITAR.zoom);
  tl.to('#gtr', { x: RING.x - G.cx, y: RING.y - G.holeY, rotation: 0, scale: RING.r / G.holeR, duration: SC.tune - GUITAR.zoom + 0.1, ease: 'expo.inOut' }, GUITAR.zoom);
  tl.to('#gtr', { opacity: 0, duration: 0.3, ease: 'power1.in' }, SC.tune + 0.12);

  // מיתרי הגיטרה, אבק ועובי קו
  const gStrings = $$('#gtr .gs[data-i]');
  const gtr = $('#gtr');
  const r2 = rng(7);
  const dust = Array.from({ length: 30 }, (_, i) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('fill', C.cream);
    $('#dust').appendChild(c);
    return { c, x: 70 + r2() * 940, y: 800 + r2() * 620, r: 1.4 + r2() * 3.2, a: 0.1 + r2() * 0.3, sp: 0.2 + r2() * 0.5, ph: r2() * TAU };
  });
  const puff = Array.from({ length: 22 }, () => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('fill', '#d9c9a8');
    $('#puff').appendChild(c);
    const ang = -Math.PI * (0.1 + r2() * 0.8);
    return { c, x: 400 + r2() * 560, y: 1030 + r2() * 120, vx: Math.cos(ang) * (60 + r2() * 150), vy: Math.sin(ang) * (80 + r2() * 190), r: 2 + r2() * 5, d: r2() * 0.12 };
  });
  onFrame((t) => {
    if (t < SC.guitar - 0.4 || t > SC.tune + 0.6) return;
    const sc = gsap.getProperty(gtr, 'scaleX') || 1;
    gtr.style.setProperty('--inv', (1 / sc).toFixed(4));
    gStrings.forEach((p, i) => {
      const amp = T.stringAmp(i, t) * 9;
      const off = amp > 0.05 ? amp * Math.sin(TAU * (9 + i * 1.6) * t + i * 2) : 0;
      const mx = (G.nutX(i) + G.bridgeX(i)) / 2 + off * 2;
      p.setAttribute('d', `M${G.nutX(i)} ${G.nutY} Q${mx.toFixed(2)} ${(G.nutY + G.bridgeY) / 2} ${G.bridgeX(i)} ${G.bridgeY}`);
    });
    const fadeIn = clamp((t - GUITAR.draw - 0.4) / 0.8, 0, 1);
    for (const d of dust) {
      d.c.setAttribute('cx', (d.x + Math.sin(t * d.sp + d.ph) * 26).toFixed(1));
      d.c.setAttribute('cy', (d.y + Math.cos(t * d.sp * 0.8 + d.ph) * 18 - (t - SC.guitar) * 5).toFixed(1));
      d.c.setAttribute('r', d.r);
      d.c.setAttribute('opacity', (d.a * fadeIn * (0.6 + 0.4 * Math.sin(t * 1.3 + d.ph))).toFixed(3));
    }
    for (const p of puff) {
      const dt = t - GUITAR.sour - p.d;
      if (dt < 0 || dt > 1.7) {
        p.c.setAttribute('opacity', 0);
        continue;
      }
      const e = 1 - Math.exp(-dt * 2.6);
      p.c.setAttribute('cx', (p.x + p.vx * e).toFixed(1));
      p.c.setAttribute('cy', (p.y + p.vy * e + dt * dt * 26).toFixed(1));
      p.c.setAttribute('r', (p.r * (1 + dt * 1.3)).toFixed(1));
      p.c.setAttribute('opacity', (0.5 * Math.min(1, dt / 0.05) * Math.pow(1 - dt / 1.7, 1.5)).toFixed(3));
    }
  });

  // ---------- 3 · מכוונים ----------
  const SX = (i) => 165 + i * 150;
  const tuner = $('#tuner');
  const pol = (deg, r) => [RING.x + Math.sin((deg * Math.PI) / 180) * r, RING.y - Math.cos((deg * Math.PI) / 180) * r];
  let ticks = '';
  for (let k = -10; k <= 10; k++) {
    const a = k * 7;
    const major = k % 5 === 0;
    const [x1, y1] = pol(a, major ? 240 : 256);
    const [x2, y2] = pol(a, 276);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.cream}" stroke-opacity="${major ? 0.7 : 0.3}" stroke-width="${major ? 4 : 3}" stroke-linecap="round"/>`;
  }
  tuner.innerHTML = `
    <circle id="tn-disc" cx="${RING.x}" cy="${RING.y}" r="${RING.r}" fill="#100c09" />
    <circle id="tn-pulse" cx="${RING.x}" cy="${RING.y}" r="${RING.r}" fill="none" stroke="${C.mint}" stroke-width="5" opacity="0" />
    <circle id="tn-ring" cx="${RING.x}" cy="${RING.y}" r="${RING.r}" fill="none" stroke="${C.cream}" stroke-width="3.6" />
    <g id="tn-ticks">${ticks}</g>
    <path id="tn-target" d="M${RING.x - 20} ${RING.y - RING.r - 52} L${RING.x + 20} ${RING.y - RING.r - 52} L${RING.x} ${RING.y - RING.r - 20} Z" fill="${C.cream}" />
    <path id="tn-arc" fill="none" stroke="${C.amber}" stroke-width="12" stroke-linecap="round" />
    <g id="tn-ind">
      <line x1="${RING.x}" y1="${RING.y - RING.r + 40}" x2="${RING.x}" y2="${RING.y - RING.r - 40}" stroke="${C.amber}" stroke-width="10" stroke-linecap="round" />
      <circle cx="${RING.x}" cy="${RING.y - RING.r}" r="17" fill="${C.amber}" />
    </g>
    <path id="tn-check" d="M${RING.x - 118} ${RING.y + 8} L${RING.x - 34} ${RING.y + 92} L${RING.x + 128} ${RING.y - 86}" fill="none" stroke="${C.mint}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />`;
  const chips = T.STRING_NAMES.map(([lat, heb], i) => {
    const c = document.createElement('div');
    c.className = 'chip';
    c.style.left = SX(i) + 'px';
    c.innerHTML = `<b>${lat}</b><span>${heb}</span>`;
    $('#chips').appendChild(c);
    return c;
  });
  const t3 = splitWords($('#s3t'));
  fit($('#s3t'), 900, 190);
  const s3s1 = splitWords($('#s3s1'));
  const s3s2 = splitWords($('#s3s2'));
  gsap.set('#s3alt', { autoAlpha: 0 });

  const view3 = { spacing: 63, alpha: 0 };
  show('#s3', SC.tune - 0.4, SC.chords);
  tl.fromTo('#tuner, #note', { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'none' }, SC.tune + 0.02);
  tl.fromTo('#tn-ticks, #tn-target, #tn-ind', { opacity: 0 }, { opacity: 1, duration: 0.3 }, SC.tune + 0.1);
  tl.to(view3, { alpha: 1, duration: 0.3, ease: 'none' }, SC.tune - 0.2);
  tl.to(view3, { spacing: 150, duration: 0.7, ease: 'expo.out' }, SC.tune);
  tl.fromTo('#s3h .step', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, SC.tune + 0.02);
  rise(t3, SC.tune + 0.06);
  tl.fromTo(chips, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.04 }, SC.tune + 0.12);

  TUNE.forEach((seg, i) => {
    const lockT = seg.t + seg.lock;
    const pop = i === 0 ? tl.fromTo.bind(tl) : hit;
    pop('#note-letter', { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26, ease: 'back.out(2.4)' }, i === 0 ? SC.tune + 0.1 : seg.t - 0.02);
    pop('#note-heb, #note-num', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.2 }, i === 0 ? SC.tune + 0.16 : seg.t);
    tl.to(chips[i], { borderColor: C.amber, color: C.cream, scale: 1.08, duration: 0.16 }, seg.t);
    // נעילה: המיתר מכוון
    tl.to(chips[i], { backgroundColor: C.mint, borderColor: C.mint, color: C.ink, duration: 0.12 }, lockT);
    hit(chips[i], { scale: 1.24 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, lockT);
    hit('#tn-pulse', { attr: { r: RING.r }, opacity: 0.9 }, { attr: { r: RING.r + 80 }, opacity: 0, duration: 0.55, ease: 'power2.out' }, lockT);
    hit('#note-letter', { scale: 1.16 }, { scale: 1, duration: 0.34, ease: 'back.out(2)' }, lockT);
  });
  // הכול מכוון
  tl.to('#note', { scale: 0.6, opacity: 0, duration: 0.18, ease: 'power2.in' }, TUNE_DONE - 0.16);
  tl.to('#tn-ind, #tn-ticks, #tn-target, #tn-arc', { opacity: 0, duration: 0.2 }, TUNE_DONE - 0.1);
  tl.to('#tn-check', { strokeDashoffset: 0, duration: 0.34, ease: 'power3.out' }, TUNE_DONE);
  tl.to('#tn-ring', { stroke: C.mint, attr: { 'stroke-width': 7 }, duration: 0.2 }, TUNE_DONE);
  hit('#tn-pulse', { attr: { r: RING.r }, opacity: 1 }, { attr: { r: RING.r + 190 }, opacity: 0, duration: 0.8, ease: 'power2.out' }, TUNE_DONE);
  hit(chips, { y: 0 }, { y: -22, duration: 0.14, ease: 'power2.out', stagger: 0.035, yoyo: true, repeat: 1 }, TUNE_DONE);
  swapHead('#s3h', [...s3s1, ...s3s2], TUNE_DONE + 0.12);
  // פעימה קלה של הטבעת על כל פריטה לפני הכניסה לגרוב
  for (const tt of [16.8, 17.4]) hit('#tuner', { scale: 1.035 }, { scale: 1, duration: 0.3, transformOrigin: `${RING.x}px ${RING.y}px` }, tt);
  tl.to('#s3 > *', { opacity: 0, scale: 1.06, duration: 0.16, ease: 'power2.in' }, SC.chords - 0.16);

  const noteEl = $('#note');
  const letter = $('#note-letter');
  const ind = $('#tn-ind');
  const arc = $('#tn-arc');
  let shown = -1;
  onFrame((t) => {
    if (t < SC.tune - 0.5 || t > SC.chords + 0.1) return;
    let idx = 0;
    for (let i = 0; i < TUNE.length; i++) if (t >= TUNE[i].t - 0.02) idx = i;
    const seg = TUNE[idx];
    if (shown !== idx) {
      shown = idx;
      letter.textContent = T.STRING_NAMES[idx][0];
      $('#note-heb').textContent = T.STRING_NAMES[idx][1];
      $('#note-num').textContent = 'מיתר ' + (6 - idx);
    }
    const locked = t >= seg.t + seg.lock;
    const cents = T.tuneCents(seg, t);
    const deg = clamp(cents, -100, 100) * 0.7;
    const col = locked ? C.mint : C.amber;
    noteEl.style.color = locked ? C.mint : C.cream;
    ind.setAttribute('transform', `rotate(${deg.toFixed(2)} ${RING.x} ${RING.y})`);
    ind.firstElementChild.setAttribute('stroke', col);
    ind.lastElementChild.setAttribute('fill', col);
    if (Math.abs(deg) > 0.8) {
      const [x1, y1] = pol(deg, RING.r);
      const [x2, y2] = pol(0, RING.r);
      arc.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A${RING.r} ${RING.r} 0 0 ${deg < 0 ? 1 : 0} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
    } else arc.setAttribute('d', '');
  });
  const ctx3 = $('#strings3').getContext('2d');
  onFrame((t) => {
    if (t < SC.tune - 0.5 || t > SC.chords + 0.1) return;
    drawStrings(ctx3, t, {
      dir: 'v',
      from: -20,
      to: T.H + 20,
      pos: (s) => 540 + (s - 2.5) * view3.spacing,
      style: (s, tt) => {
        const seg = TUNE[s];
        const lockT = seg.t + seg.lock;
        let color = C.cream, alpha = 0.16;
        let amp = T.stringAmp(s, tt) * 34;
        if (tt >= TUNE_DONE) {
          color = C.cream;
          alpha = 0.62;
          amp = T.stringAmp(s, tt) * 40;
        } else if (tt >= lockT) {
          color = C.mint;
          alpha = 0.5 + 0.5 * Math.exp(-(tt - lockT) / 0.35);
        } else if (tt >= seg.t - 0.02) {
          color = C.amber;
          alpha = 1;
          // מיתר לא מכוון רוטט בצורה לא יציבה
          const c = Math.abs(T.tuneCents(seg, tt));
          amp *= 1 + 0.5 * Math.sin(TAU * (2 + c / 14) * tt) * Math.min(1, c / 40);
        }
        return { color, alpha: alpha * view3.alpha, amp };
      },
    });
  });

  // ---------- 4 · ארבעה אקורדים ----------
  const DX = (i) => 290 + i * 100;
  const NUT = 880;
  const FRET = 132;
  const dotPos = (s, f) => ({ x: DX(s), y: NUT + (f - 0.5) * FRET });
  // אותן שלוש נקודות נודדות בין האקורדים
  const DOTS = {
    G: [[0, 3], [1, 2], [5, 3]],
    D: [[3, 2], [4, 3], [5, 2]],
    Em: [[1, 2], [2, 2], null],
    C: [[1, 3], [2, 2], [4, 1]],
  };
  let dg = `<defs><linearGradient id="dotg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc24a"/><stop offset="1" stop-color="#ff6a1a"/></linearGradient></defs>`;
  for (let k = 1; k <= 4; k++) dg += `<line class="d-fret" x1="${DX(0) - 6}" x2="${DX(5) + 6}" y1="${NUT + k * FRET}" y2="${NUT + k * FRET}" stroke="${C.cream}" stroke-opacity=".26" stroke-width="4" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) dg += `<path class="d-str" data-i="${i}" fill="none" stroke="${C.cream}" stroke-opacity=".85" stroke-width="${(7 - i * 0.9).toFixed(1)}" stroke-linecap="round"/>`;
  dg += `<rect id="d-nut" x="${DX(0) - 12}" y="${NUT - 16}" width="${DX(5) - DX(0) + 24}" height="18" rx="6" fill="${C.cream}"/>`;
  for (let i = 0; i < 6; i++) {
    dg += `<circle class="d-open" data-i="${i}" cx="${DX(i)}" cy="${NUT - 58}" r="15" fill="none" stroke="${C.cream}" stroke-width="5"/>`;
    dg += `<path class="d-mute" data-i="${i}" d="M${DX(i) - 14} ${NUT - 72} l28 28 m0 -28 l-28 28" fill="none" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
  }
  for (let k = 0; k < 3; k++) dg += `<circle class="d-dot" cx="0" cy="0" r="43" fill="url(#dotg)"/>`;
  $('#diagram').innerHTML = dg;
  const dots = $$('.d-dot');
  gsap.set(dots, { svgOrigin: '0 0', scale: 0 });
  const ccs = T.PROG.map((name) => {
    const c = document.createElement('div');
    c.className = 'cc';
    c.innerHTML = `<i></i><span>${name}</span>`;
    $('#chordrow').appendChild(c);
    return c;
  });
  const t4 = splitWords($('#s4t'));
  fit($('#s4t'), 900, 190);
  const s4s1 = splitWords($('#s4s1'));
  const s4s2 = splitWords($('#s4s2'));
  gsap.set('#s4alt', { autoAlpha: 0 });

  show('#s4', SC.chords, SC.daily);
  flash(SC.chords, 0.24);
  tl.fromTo('#s4h .step', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, SC.chords);
  rise(t4, SC.chords + 0.02, { dur: 0.5 });
  tl.fromTo(ccs, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', stagger: 0.045 }, SC.chords);
  tl.fromTo('#diagram', { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', transformOrigin: '540px 1140px' }, SC.chords);
  for (let k = 0; k < 5; k++) {
    const at = SC.chords + k * T.CHORD_LEN;
    const name = T.PROG[k % 4];
    const first = k === 0;
    DOTS[name].forEach((d, j) => {
      const dot = dots[j];
      if (!d) {
        tl.to(dot, { scale: 0, duration: 0.2, ease: 'power2.in' }, at - 0.1);
        return;
      }
      const p = dotPos(d[0], d[1]);
      if (first) {
        gsap.set(dot, p);
        tl.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, at + 0.02 + j * 0.03);
      } else {
        tl.to(dot, { ...p, duration: 0.3, ease: 'back.out(1.3)' }, at - 0.1 + j * 0.02);
        tl.to(dot, { scale: 1, duration: 0.2, ease: 'back.out(2)' }, at - 0.04);
      }
    });
    // האקורד הפעיל
    const cur = ccs[k % 4];
    if (k < 4) {
      tl.to(cur.querySelector('i'), { opacity: 1, duration: 0.08 }, at);
      tl.to(cur, { color: C.ink, borderColor: 'rgba(0,0,0,0)', duration: 0.08 }, at);
      hit(cur, { scale: 1.2 }, { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, at);
      if (k < 3) {
        tl.to(cur.querySelector('i'), { opacity: 0, duration: 0.14 }, at + T.CHORD_LEN - 0.06);
        tl.to(cur, { color: C.muted, borderColor: 'rgba(246,236,217,0.16)', duration: 0.14 }, at + T.CHORD_LEN - 0.06);
      }
    } else {
      // הסיבוב השני: כולם נדלקים יחד
      ccs.forEach((c, j) => {
        tl.to(c.querySelector('i'), { opacity: 1, duration: 0.1 }, at + j * 0.07);
        tl.to(c, { color: C.ink, borderColor: 'rgba(0,0,0,0)', duration: 0.1 }, at + j * 0.07);
        hit(c, { scale: 1.18 }, { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, at + j * 0.07);
      });
    }
  }
  swapHead('#s4h', [...s4s1, ...s4s2], SC.chords + 4 * T.CHORD_LEN);

  const dStr = $$('.d-str');
  const dOpen = $$('.d-open');
  const dMute = $$('.d-mute');
  const yEnd = NUT + 4 * FRET + 46;
  onFrame((t) => {
    if (t < SC.chords - 0.1 || t > SC.daily + 0.1) return;
    const k = clamp(Math.floor((t - SC.chords + 0.04) / T.CHORD_LEN), 0, 4);
    const frets = T.CHORDS[T.PROG[k % 4]];
    for (let i = 0; i < 6; i++) {
      const amp = T.stringAmp(i, t) * 15;
      const off = amp > 0.05 ? amp * Math.sin(TAU * (10 + i * 1.8) * t + i) : 0;
      dStr[i].setAttribute('d', `M${DX(i)} ${NUT} Q${(DX(i) + off * 2).toFixed(2)} ${(NUT + yEnd) / 2} ${DX(i)} ${yEnd}`);
      dStr[i].setAttribute('stroke-opacity', frets[i] < 0 ? 0.25 : 0.85);
      dOpen[i].setAttribute('opacity', frets[i] === 0 ? 1 : 0);
      dMute[i].setAttribute('opacity', frets[i] < 0 ? 1 : 0);
    }
  });

  // ---------- 5 · עשר דקות ביום ----------
  const TM = { x: 540, y: 930, r: 280 };
  let tk = '';
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * TAU;
    const r1 = TM.r + 34, r2b = TM.r + (i % 5 === 0 ? 62 : 48);
    tk += `<line x1="${(TM.x + Math.sin(a) * r1).toFixed(1)}" y1="${(TM.y - Math.cos(a) * r1).toFixed(1)}" x2="${(TM.x + Math.sin(a) * r2b).toFixed(1)}" y2="${(TM.y - Math.cos(a) * r2b).toFixed(1)}" stroke="${C.cream}" stroke-opacity="${i % 5 === 0 ? 0.5 : 0.2}" stroke-width="3" stroke-linecap="round"/>`;
  }
  $('#timer').innerHTML = `
    <defs><linearGradient id="tmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc24a"/><stop offset="1" stop-color="#ff6a1a"/></linearGradient></defs>
    <g id="tm-ticks">${tk}</g>
    <circle cx="${TM.x}" cy="${TM.y}" r="${TM.r}" fill="none" stroke="${C.cream}" stroke-opacity=".1" stroke-width="22" />
    <circle id="tm-arc" cx="${TM.x}" cy="${TM.y}" r="${TM.r}" fill="none" stroke="url(#tmg)" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 ${TM.x} ${TM.y})" />
    <circle id="tm-pulse" cx="${TM.x}" cy="${TM.y}" r="${TM.r}" fill="none" stroke="${C.amber}" stroke-width="6" opacity="0" />
    <circle id="tm-knob" cx="${TM.x}" cy="${TM.y - TM.r}" r="24" fill="${C.cream}" />`;
  const days = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'].map((d) => {
    const e = document.createElement('div');
    e.className = 'day';
    e.innerHTML = `<i></i><span>${d}</span>`;
    $('#week').appendChild(e);
    return e;
  });
  const t5 = splitWords($('#s5t'));
  fit($('#s5t'), 900, 190);
  const s5s1 = splitWords($('#s5s1'));
  const s5s2 = splitWords($('#s5s2'));
  gsap.set('#s5alt', { autoAlpha: 0 });
  const timerP = { v: 0 };

  wipe(SC.daily, 'y');
  show('#s5', SC.daily, SC.rec);
  tl.fromTo('#s5h .step', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, SC.daily + 0.08);
  rise(t5, SC.daily + 0.1, { dur: 0.5 });
  tl.fromTo('#timer, #clock, #clock-sub', { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out', transformOrigin: `${TM.x}px ${TM.y}px` }, SC.daily + 0.06);
  tl.fromTo(days, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: { each: 0.035 } }, SC.daily + 0.2);
  tl.to(timerP, { v: 1, duration: 1.75, ease: 'power2.inOut' }, SC.daily + 0.3);
  const doneT = SC.daily + 2.05;
  hit('#tm-pulse', { attr: { r: TM.r }, opacity: 0.9 }, { attr: { r: TM.r + 120 }, opacity: 0, duration: 0.7, ease: 'power2.out' }, doneT);
  hit('#clock', { scale: 1.14 }, { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, doneT);
  tl.to('#clock', { color: C.amber, duration: 0.15 }, doneT);
  const weekT = SC.daily + 2 * T.CHORD_LEN;
  days.forEach((d, i) => {
    const at = weekT + i * 0.15;
    tl.to(d.querySelector('i'), { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, at);
    tl.to(d, { color: C.ink, borderColor: 'rgba(0,0,0,0)', duration: 0.1 }, at + 0.04);
    hit(d, { y: 0 }, { y: -18, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 }, at);
  });
  swapHead('#s5h', [...s5s1, ...s5s2], weekT);

  const clockDigits = $$('#clock .dg');
  const tmArc = $('#tm-arc');
  const tmKnob = $('#tm-knob');
  onFrame((t) => {
    if (t < SC.daily - 0.4 || t > SC.rec + 0.1) return;
    const v = timerP.v;
    tmArc.setAttribute('stroke-dashoffset', (1 - v).toFixed(4));
    const a = v * TAU;
    tmKnob.setAttribute('cx', (TM.x + Math.sin(a) * TM.r).toFixed(1));
    tmKnob.setAttribute('cy', (TM.y - Math.cos(a) * TM.r).toFixed(1));
    const secs = Math.round(v * 600);
    const txt = String(Math.floor(secs / 60)).padStart(2, '0') + String(secs % 60).padStart(2, '0');
    clockDigits.forEach((d, i) => (d.textContent = txt[i]));
  });

  // ---------- 6 · תקליטו ----------
  fitSame([$('#r1'), $('#r2')], 900, 270);
  const r3 = splitWords($('#r3'));
  wipe(SC.rec, 'x');
  show('#s6', SC.rec, SC.insp);
  tl.fromTo('#s6h .step', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, SC.rec + 0.08);
  tl.fromTo('#recpill', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, SC.rec + 0.1);
  slam('#r1', SC.rec + 0.22, { from: 2.2 });
  slam('#r2', SC.rec + 0.6, { from: 2.2 });
  shake('#s6p', SC.rec + 0.6, 12);
  rise(r3, SC.rec + T.CHORD_LEN, { stagger: 0.05 });
  tl.to('#s6 > *', { opacity: 0, duration: 0.14, ease: 'power2.in' }, SC.insp - 0.14);

  // גל ההקלטה: העמודות נשארות במקומן וראש ההקלטה נע מימין לשמאל (כמו שאר הסרטון),
  // כך שאין גלילה מהירה שמהבהבת ב-60 פריימים לשנייה
  const wctx = $('#wave').getContext('2d');
  const WV = { x1: 1000, x0: 80, pitch: 22, bw: 12, cy: 1300, start: SC.rec + 0.1, end: SC.insp - 0.15 };
  WV.n = Math.floor((WV.x1 - WV.x0) / WV.pitch) + 1;
  WV.step = (WV.end - WV.start) / WV.n;
  const barH = Array.from({ length: WV.n }, (_, k) => {
    const tt = WV.start + k * WV.step;
    const e = (T.energy(tt) + T.energy(tt + WV.step * 0.33) + T.energy(tt + WV.step * 0.66)) / 3;
    return 18 + (0.1 + 0.9 * Math.pow(e, 0.8)) * (0.4 + 0.6 * hash(k)) * 310;
  });
  const backOut = (u) => 1 + 2.4 * Math.pow(u - 1, 3) + 1.4 * Math.pow(u - 1, 2);
  onFrame((t) => {
    if (t < SC.rec - 0.4 || t > SC.insp + 0.1) return;
    const secs = Math.max(0, Math.floor(t - SC.rec));
    $('#rectime').textContent = '00:0' + secs;
    $('#recdot').style.opacity = ((t - SC.rec) % 0.6) < 0.36 ? 1 : 0.25;
    wctx.clearRect(0, 0, T.W, T.H);
    const p = clamp((t - WV.start) / WV.step, 0, WV.n);
    const grad = wctx.createLinearGradient(0, WV.cy - 170, 0, WV.cy + 170);
    grad.addColorStop(0, '#ffc24a');
    grad.addColorStop(1, '#ff6a1a');
    for (let k = 0; k < WV.n; k++) {
      const x = WV.x1 - k * WV.pitch;
      const g = clamp((p - k) / 2.2, 0, 1);
      const live = g > 0;
      const hh = live ? Math.max(10, barH[k] * backOut(g)) : 10;
      wctx.globalAlpha = live ? 1 : 0.22;
      wctx.fillStyle = live ? grad : C.cream;
      wctx.beginPath();
      wctx.roundRect(x - WV.bw / 2, WV.cy - hh / 2, WV.bw, hh, WV.bw / 2);
      wctx.fill();
    }
    const px = WV.x1 + WV.pitch / 2 - p * WV.pitch;
    wctx.globalAlpha = 0.9;
    wctx.fillStyle = C.cream;
    wctx.fillRect(px - 2, WV.cy - 190, 4, 380);
    wctx.beginPath();
    wctx.arc(px, WV.cy - 190, 11, 0, TAU);
    wctx.fill();
    wctx.globalAlpha = 1;
  });

  // ---------- 7 · השראה ----------
  const q1 = splitWords($('#q1'));
  fit($('#q2'), 900);
  const q2 = splitChars($('#q2'));
  fitSame([$('#qa1'), $('#qa2')], 900, 128);
  fitSame([$('#qb1'), $('#qb2')], 900, 146);
  const qT = SC.insp + T.CHORD_LEN; // 32.4 - הגרוב חוזר
  const qT2 = qT + T.CHORD_LEN; // 33.6
  show('#s7', SC.insp, SC.cta);
  rise(q1, SC.insp + 0.02, { dur: 0.45 });
  tl.fromTo(q2, { yPercent: 60, opacity: 0, rotation: () => 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: { each: 0.035, from: 'start' } }, SC.insp + 0.1);
  tl.fromTo('#q', { scale: 0.96 }, { scale: 1.04, duration: T.CHORD_LEN, ease: 'none' }, SC.insp);
  tl.to('#q', { y: -260, opacity: 0, scale: 0.8, duration: 0.24, ease: 'power3.in' }, qT - 0.22);
  tl.set('#quote', { autoAlpha: 0 }, 0);
  tl.set('#quote', { autoAlpha: 1 }, qT - 0.02);
  flash(qT, 0.13);
  tl.fromTo(['#qa1', '#qa2'], { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.12 }, qT);
  tl.set('#qb', { opacity: 0 }, 0);
  tl.set('#qb', { opacity: 1 }, qT2 - 0.02);
  tl.fromTo(['#qb1', '#qb2'], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.14 }, qT2);
  tl.to('#qa', { opacity: 0.4, duration: 0.4 }, qT2);
  tl.to('#qb-line path', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, qT2 + 0.62);
  tl.fromTo('#quote', { scale: 1 }, { scale: 1.035, duration: SC.cta - qT, ease: 'none', transformOrigin: '50% 40%' }, qT);
  tl.to('#s7 > *', { opacity: 0, duration: 0.12, ease: 'power2.in' }, SC.cta - 0.12);

  const ctx7 = $('#strings7').getContext('2d');
  onFrame((t) => {
    if (t < qT - 0.1 || t > SC.cta + 0.1) return;
    const a = clamp((t - qT) / 0.3, 0, 1);
    drawStrings(ctx7, t, {
      dir: 'h',
      from: -20,
      to: T.W + 20,
      pos: (s) => 1330 + s * 54,
      wScale: 0.6,
      style: (s, tt) => ({ color: C.amber, alpha: 0.55 * a, amp: T.stringAmp(s, tt) * 20 }),
    });
  });

  // ---------- 8 · הסיום ----------
  fit($('#c1'), 900);
  fit($('#c2'), 900);
  fit($('#c3'), 900, 400);
  fit($('#c4'), 900, 400);
  placeStrike($('#strike2'), $('#c2'));
  gsap.set('#amber2 .poster', { height: 1640 });
  const share = $$('.share-line').flatMap((l) => splitWords(l));

  show('#s8', SC.cta, null);
  slam('#c1', CTA.w1 + 0.02, { dur: 0.02 });
  tl.fromTo('#c2', { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'power3.in' }, CTA.w1 + 0.14);
  shake('#s8-dark', CTA.w1 + 0.3, 16);
  tl.to('#strike2 path', { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, CTA.strike);
  tl.to(['#c1', '#c2'], { color: '#6e6658', duration: 0.25 }, CTA.strike + 0.12);
  tl.to('#s8-dark', { scale: 0.9, duration: 0.42, ease: 'power2.in' }, CTA.strike + 0.18);
  tl.to('#amber2', { clipPath: 'circle(1260px at 540px 900px)', duration: 0.5, ease: 'expo.out' }, CTA.boom - 0.02);
  tl.set('#chrome', { color: C.ink }, CTA.boom + 0.07);
  tl.fromTo('#c3', { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, ease: 'expo.out' }, CTA.boom - 0.01);
  tl.set('#c4', { opacity: 0 }, 0);
  slam('#c4', CTA.w4, { from: 3, dur: 0.15 });
  shake('#amber2 .poster', CTA.boom, 18);
  shake('#amber2 .poster', CTA.w4, 24);
  tl.to('#amber2 .poster', { scale: 1.04, duration: T.DURATION - CTA.w4, ease: 'none' }, CTA.w4 + 0.4);
  rise(share, CTA.share, { stagger: 0.04 });
  stringsOnAmber('#strings8', CTA.boom, T.DURATION + 1);

  // ---------- שכבות קבועות ----------
  tl.fromTo('#chrome', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.05);
  const glow = $('#glow');
  const fill = $('#bar-fill');
  onFrame((t) => {
    fill.style.transform = `scaleX(${(t / T.DURATION).toFixed(4)})`;
    // זוהר שמגיב למוזיקה (מוחלק, ונשאר דטרמיניסטי גם בקפיצות)
    let e = 0, wsum = 0;
    for (let k = 0; k < 6; k++) {
      const w = Math.exp(-k * 0.5);
      e += T.energy(t - k * 0.03) * w;
      wsum += w;
    }
    glow.style.opacity = (0.26 + 0.6 * (e / wsum)).toFixed(3);
  });

  // גרעיניות פילם
  const gc = $('#grain');
  const gctx = gc.getContext('2d');
  const tiles = [];
  const gr = rng(99);
  for (let n = 0; n < 5; n++) {
    const img = gctx.createImageData(gc.width, gc.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 128 + (gr() + gr() + gr() - 1.5) * 110;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    tiles.push(img);
  }
  onFrame((t) => {
    // הגרעין מתחלף 30 פעם בשנייה (כמו פילם), גם כשהסרטון ב-60
    const f = Math.floor(t * 30 + 0.001);
    gctx.putImageData(tiles[f % tiles.length], 0, 0);
    // על הכתום הגרעין בולט הרבה יותר, אז מחלישים אותו שם
    const onAmber = (t > HOOK.boom && t < SC.guitar + 0.1) || t > CTA.boom;
    gc.style.opacity = onAmber ? 0.065 : 0.12;
  });

  tl.set({}, {}, T.DURATION);
}

// =====================================================================
function seek(t) {
  t = clamp(t, 0, T.DURATION);
  tl.time(Math.max(t, 0.0005), false);
  for (const u of updaters) u(t);
}

async function init() {
  await document.fonts.ready;
  await Promise.all(
    ['900 100px Poster', '800 50px Text', '500 50px Text', '900 100px Quote'].map((f) => document.fonts.load(f, 'אבג ABC 123'))
  );
  build();
  seek(0);

  if (!RENDER) {
    const stage = $('#stage');
    const fitStage = () => {
      const s = Math.min(innerWidth / T.W, (innerHeight - 48) / T.H);
      stage.style.transform = `scale(${s})`;
    };
    addEventListener('resize', fitStage);
    fitStage();
    const audio = $('#audio');
    const scrub = $('#scrub');
    const tc = $('#tc');
    const btn = $('#play');
    let playing = false;
    const loop = () => {
      if (playing) {
        const t = audio.currentTime;
        seek(t);
        scrub.value = (t / T.DURATION) * 1000;
        tc.textContent = t.toFixed(2);
        if (t >= T.DURATION || audio.ended) {
          playing = false;
          btn.textContent = '▶ נגן';
        }
      }
      requestAnimationFrame(loop);
    };
    btn.onclick = () => {
      playing = !playing;
      if (playing) {
        if (audio.currentTime >= T.DURATION - 0.05) audio.currentTime = 0;
        audio.play();
      } else audio.pause();
      btn.textContent = playing ? '❚❚ עצור' : '▶ נגן';
    };
    scrub.oninput = () => {
      const t = (scrub.value / 1000) * T.DURATION;
      audio.currentTime = t;
      seek(t);
      tc.textContent = t.toFixed(2);
    };
    loop();
  }
  window.__seek = seek;
  window.__duration = T.DURATION;
  window.__fps = T.FPS;
  window.__ready = true;
}
init();
