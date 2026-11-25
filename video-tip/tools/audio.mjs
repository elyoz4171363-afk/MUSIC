// מסנתז את הפסקול של הסרטון מאפס: גיטרה (Karplus-Strong), תופים, בס ואפקטים.
// הרצה: node tools/audio.mjs  ->  out/soundtrack.wav

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as T from '../src/timing.js';

const SR = 48000;
const TAIL = 0.6;
const N = Math.ceil((T.DURATION + TAIL) * SR);

// ---------- כלי עזר ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
  };
}
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const gtr = bus(); // גיטרה
const drums = bus();
const bassBus = bus();
const fx = bus();

function add(b, buf, t, gain = 1, pan = 0) {
  const n0 = Math.round(t * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < buf.length; i++) {
    const n = n0 + i;
    if (n < 0 || n >= N) continue;
    b.L[n] += buf[i] * gl;
    b.R[n] += buf[i] * gr;
  }
}

// ביקוואד (RBJ)
function biquad(type, f, q, gainDb = 0) {
  const w = (2 * Math.PI * f) / SR;
  const c = Math.cos(w);
  const s = Math.sin(w);
  const alpha = s / (2 * q);
  const A = Math.pow(10, gainDb / 40);
  let b0, b1, b2, a0, a1, a2;
  if (type === 'lp') {
    b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; a0 = 1 + alpha; a1 = -2 * c; a2 = 1 - alpha;
  } else if (type === 'hp') {
    b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; a0 = 1 + alpha; a1 = -2 * c; a2 = 1 - alpha;
  } else if (type === 'bp') {
    b0 = alpha; b1 = 0; b2 = -alpha; a0 = 1 + alpha; a1 = -2 * c; a2 = 1 - alpha;
  } else if (type === 'peak') {
    b0 = 1 + alpha * A; b1 = -2 * c; b2 = 1 - alpha * A; a0 = 1 + alpha / A; a1 = -2 * c; a2 = 1 - alpha / A;
  } else if (type === 'hs') {
    const sq = 2 * Math.sqrt(A) * alpha;
    b0 = A * (A + 1 + (A - 1) * c + sq); b1 = -2 * A * (A - 1 + (A + 1) * c); b2 = A * (A + 1 + (A - 1) * c - sq);
    a0 = A + 1 - (A - 1) * c + sq; a1 = 2 * (A - 1 - (A + 1) * c); a2 = A + 1 - (A - 1) * c - sq;
  }
  return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
}
function filt(buf, co) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    const y = co.b0 * x + co.b1 * x1 + co.b2 * x2 - co.a1 * y1 - co.a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    buf[i] = y;
  }
  return buf;
}
const filtBus = (b, co) => { filt(b.L, co); filt(b.R, co); };

// ---------- מיתר (Karplus-Strong מורחב) ----------
// plucks: [{at, vel}] ביחס לתחילת הצליל. cents(tt): כיוון משתנה בזמן (לסצנת הכיוון)
let seedCounter = 1;
function stringVoice({ f, dur, plucks, bright = 0.5, t60 = 3.5, cents = null, stopAt = null }) {
  const len = Math.ceil(dur * SR);
  const out = new Float32Array(len);
  const rand = rng(1000 + seedCounter++ * 7919);
  const fMin = f * (cents ? 0.9 : 1);
  const size = Math.ceil(SR / fMin) + 8;
  const line = new Float32Array(size);
  let wp = 0;
  let prev = 0;
  // b: כמה ממוצע נכנס ללולאה. גבוה = עמום יותר ודעיכה מהירה של הגבוהים
  const b = 0.5 - 0.42 * bright;

  // העירור: פרץ רעש באורך מחזור אחד, מרוכך לפי עוצמת הפריטה, עם "מיקום מפרט"
  const exc = new Float32Array(len);
  for (const p of plucks) {
    const P = Math.round(SR / f);
    const n0 = Math.round(p.at * SR);
    const burst = new Float32Array(P);
    // שני מסננים מעבירי-נמוכים ברצף: מפרט רך, בלי הצליל ה"מתכתי" של רעש לבן
    let lp = 0, lp2 = 0;
    const k = 0.07 + 0.2 * bright * (0.5 + 0.5 * p.vel);
    for (let i = -80; i < P; i++) {
      lp += k * (rand() - lp);
      lp2 += k * (lp - lp2);
      if (i >= 0) burst[i] = lp2;
    }
    const pick = Math.max(1, Math.round(P * 0.17));
    let mean = 0;
    for (let i = 0; i < P; i++) mean += burst[i];
    mean /= P;
    const shaped = new Float32Array(P);
    let energy = 0;
    for (let i = 0; i < P; i++) {
      shaped[i] = burst[i] - mean - (i >= pick ? burst[i - pick] - mean : 0);
      energy += shaped[i] * shaped[i];
    }
    const gain = (0.5 * p.vel) / Math.sqrt(energy / P + 1e-9);
    for (let i = 0; i < P; i++) if (n0 + i < len) exc[n0 + i] += shaped[i] * gain;
  }

  const stopN = stopAt == null ? Infinity : Math.round(stopAt * SR);
  for (let i = 0; i < len; i++) {
    const fc = cents ? f * Math.pow(2, cents(i / SR) / 1200) : f;
    const g = Math.pow(0.001, 1 / (fc * t60));
    const D = SR / fc - b - 0.02;
    let rp = wp - D;
    while (rp < 0) rp += size;
    const i0 = Math.floor(rp);
    const fr = rp - i0;
    const a = line[i0 % size];
    const c = line[(i0 + 1) % size];
    const y = a + (c - a) * fr;
    const lpf = (1 - b) * y + b * prev;
    prev = y;
    const w = exc[i] + g * lpf;
    line[wp] = w;
    wp = (wp + 1) % size;
    // כשהאקורד מתחלף האצבע עוזבת את המיתר, והוא נעצר תוך כמה אלפיות שנייה
    out[i] = i > stopN ? w * Math.exp(-(i - stopN) / (0.028 * SR)) : w;
  }
  return out;
}

// כל התווים של הגיטרה, לפי מיתר, כדי שתו חדש יעצור את הקודם על אותו מיתר
const notes = [];
for (const ev of T.STRUMS) {
  for (const n of T.strumNotes(ev)) notes.push({ ...n, kind: 'strum' });
}
const perString = [[], [], [], [], [], []];
for (const n of notes) perString[n.s].push(n);
// האקורד שלפני "ומה עם השראה?" ושלפני הסיום מצלצל עד שמשתיקים אותו
const HARD_STOPS = [T.SC.guitar - 0.15, T.SC.tune - 0.5];

const PAN = [-0.32, -0.2, -0.08, 0.08, 0.2, 0.32];
for (let s = 0; s < 6; s++) {
  const list = perString[s].sort((a, b) => a.t - b.t);
  for (let i = 0; i < list.length; i++) {
    const n = list[i];
    const next = list[i + 1];
    let stop = next ? next.t - n.t : null;
    for (const hs of HARD_STOPS) if (hs > n.t && (stop == null || hs - n.t < stop)) stop = hs - n.t;
    const dur = Math.min(stop != null ? stop + 0.25 : 7, T.DURATION + TAIL - n.t);
    const v = stringVoice({
      f: n.f,
      dur,
      plucks: [{ at: 0, vel: n.vel }],
      bright: n.sour ? 0.16 : 0.5 + 0.3 * n.vel,
      t60: n.sour ? 1.1 : 2.6 + (5 - s) * 0.5,
      stopAt: stop,
    });
    add(gtr, v, n.t, n.sour ? 0.62 : 0.36, PAN[s]);
  }
}

// סצנת הכיוון: כל מיתר נפרט פעמיים ומחליק אל הצליל הנכון
for (const seg of T.TUNE) {
  const f = T.OPEN[seg.s];
  const v = stringVoice({
    f,
    dur: seg.d + 1.6,
    plucks: [
      { at: 0, vel: 0.85 },
      { at: seg.lock * 0.52, vel: 0.75 },
      { at: seg.lock, vel: 0.6 },
    ],
    bright: 0.55,
    t60: 2.2,
    cents: (tt) => T.tuneCents(seg, seg.t + tt),
    stopAt: seg.d + 0.9,
  });
  add(gtr, v, seg.t, 0.72, PAN[seg.s] * 0.6);
}

// תיבת התהודה: כמה שיאים נמוכים שנותנים "עץ", וריכוך של הקצה העליון
filtBus(gtr, biquad('hp', 70, 0.7));
filtBus(gtr, biquad('peak', 105, 2.2, 3.5));
filtBus(gtr, biquad('peak', 215, 2.5, 2.5));
filtBus(gtr, biquad('peak', 420, 1.4, 1.5));
filtBus(gtr, biquad('hs', 4500, 0.7, 3));
filtBus(gtr, biquad('lp', 8000, 0.7));

// ---------- תופים ----------
function kick(vel) {
  const len = Math.round(0.42 * SR);
  const o = new Float32Array(len);
  let ph = 0;
  const r = rng(11);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 46 + 130 * Math.exp(-t / 0.035);
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.16);
    const knock = Math.sin(ph * 2.02) * Math.exp(-t / 0.03) * 0.35; // נוכחות גם ברמקול של טלפון
    const click = r() * Math.exp(-t / 0.0025) * 0.35;
    o[i] = Math.tanh((body + knock + click) * 1.6) * vel;
  }
  return o;
}
function clap(vel) {
  const len = Math.round(0.26 * SR);
  const o = new Float32Array(len);
  const r = rng(23);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let env = 0;
    for (const d of [0, 0.011, 0.023]) if (t >= d) env += Math.exp(-(t - d) / 0.008) * 0.55;
    if (t >= 0.03) env += Math.exp(-(t - 0.03) / 0.07);
    o[i] = r() * env * vel;
  }
  filt(o, biquad('bp', 1500, 0.9));
  filt(o, biquad('hp', 600, 0.7));
  return o;
}
function shaker(vel, seed) {
  const len = Math.round(0.09 * SR);
  const o = new Float32Array(len);
  const r = rng(seed);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.012) * Math.exp(-t / 0.028);
    o[i] = r() * env * vel;
  }
  filt(o, biquad('hp', 5200, 0.8));
  return o;
}
let sh = 0;
for (const d of T.DRUMS) {
  if (d.type === 'kick') add(drums, kick(d.vel), d.t, 0.54, 0);
  if (d.type === 'clap') add(drums, clap(d.vel), d.t, 0.42, 0.06);
  if (d.type === 'shaker') add(drums, shaker(d.vel, 300 + sh++), d.t, 0.2, sh % 2 ? 0.3 : -0.3);
}

// ---------- בס ----------
function bassNote(f, dur, vel) {
  const len = Math.round((dur + 0.2) * SR);
  const o = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f) / SR;
    // יסוד + הרמוניות, כדי שהבס יורגש גם ברמקולים קטנים
    let s = Math.sin(ph) + 0.5 * Math.sin(2 * ph) + 0.28 * Math.sin(3 * ph) + 0.12 * Math.sin(4 * ph);
    const env = Math.min(1, t / 0.008) * (t < dur ? Math.exp(-t / 0.9) : Math.exp(-dur / 0.9) * Math.exp(-(t - dur) / 0.04));
    o[i] = Math.tanh(s * 0.9) * env * vel;
  }
  return o;
}
for (const b of T.BASS) add(bassBus, bassNote(b.f, b.dur, b.vel), b.t, 0.3, 0);

// ---------- אפקטים ----------
function thud(vel) {
  const len = Math.round(0.5 * SR);
  const o = new Float32Array(len);
  let ph = 0;
  const r = rng(41);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 52 + 90 * Math.exp(-t / 0.03);
    ph += (2 * Math.PI * f) / SR;
    lp += 0.08 * (r() - lp);
    // שכבת "נקישה" באמצע הספקטרום, כדי שהמכה תישמע גם ברמקול של טלפון
    const knock = Math.sin(2 * Math.PI * (190 + 260 * Math.exp(-t / 0.018)) * t) * Math.exp(-t / 0.05) * 0.7;
    o[i] = Math.tanh((Math.sin(ph) * Math.exp(-t / 0.13) + Math.sin(ph * 3) * Math.exp(-t / 0.04) * 0.3 + knock + lp * Math.exp(-t / 0.03) * 2.2) * 1.5) * vel;
  }
  return o;
}
function boom(vel) {
  const len = Math.round(1.8 * SR);
  const o = new Float32Array(len);
  let ph = 0;
  const r = rng(53);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 38 + 60 * Math.exp(-t / 0.08);
    ph += (2 * Math.PI * f) / SR;
    lp += 0.02 * (r() - lp);
    const mid = Math.sin(2 * Math.PI * (110 + 170 * Math.exp(-t / 0.03)) * t) * Math.exp(-t / 0.14) * 0.6;
    o[i] = (Math.sin(ph) * Math.exp(-t / 0.5) + 0.3 * Math.sin(2 * ph) * Math.exp(-t / 0.25) + mid + lp * Math.exp(-t / 0.35) * 5) * vel;
  }
  // "קראש" אוורירי מעל המכה
  const air = new Float32Array(len);
  const r2 = rng(59);
  for (let i = 0; i < len; i++) air[i] = r2() * Math.exp(-i / SR / 0.3) * Math.min(1, i / SR / 0.004) * 0.22 * vel;
  filt(air, biquad('bp', 3200, 0.6));
  for (let i = 0; i < len; i++) o[i] += air[i];
  return o;
}
// קליק רך כשטקסט נכנס
function tick() {
  const len = Math.round(0.04 * SR);
  const o = new Float32Array(len);
  const r = rng(71);
  for (let i = 0; i < len; i++) o[i] = r() * Math.exp(-i / SR / 0.005);
  filt(o, biquad('bp', 2100, 1.8));
  return o;
}
// צליל קצר וחיובי (ימים שמתמלאים, טיימר שמסתיים)
function blip(f) {
  const len = Math.round(0.3 * SR);
  const o = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    o[i] = Math.min(1, t / 0.003) * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.07) + 0.3 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t / 0.04));
  }
  return o;
}
// הזמזום הצורם של "התלונות": שני צלילים במרחק חצי טון שמתגברים עד שהאקורד קוטע אותם
function drone(dur) {
  const len = Math.round(dur * SR);
  const o = new Float32Array(len);
  const parts = [[110, 1], [116.54, 1], [220, 0.7], [233.08, 0.7], [323.6, 0.45], [466.2, 0.25]];
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const u = t / dur;
    let s = 0;
    for (const [f, a] of parts) s += a * Math.sin(2 * Math.PI * f * t + f);
    const env = Math.pow(u, 1.7) * Math.min(1, (dur - t) / 0.012);
    o[i] = Math.tanh(s * 0.5) * env;
  }
  return o;
}
// רעש שעובר דרך מסנן נע: מעברים בין סצנות
function whoosh(dur, up) {
  const len = Math.round(dur * SR);
  const L = new Float32Array(len), R = new Float32Array(len);
  const r = rng(67 + Math.round(dur * 100));
  let l1 = 0, b1 = 0;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const sweep = up ? u : 1 - Math.abs(2 * u - 1);
    const fc = 350 * Math.pow(12, sweep);
    const fcoef = 2 * Math.sin((Math.PI * fc) / SR);
    const x = r();
    const h = x - l1 - 0.7 * b1;
    b1 += fcoef * h;
    l1 += fcoef * b1;
    const env = up ? Math.pow(u, 2.2) * (1 - Math.pow(u, 14)) : Math.pow(Math.sin(Math.PI * u), 1.6);
    const pan = up ? 0 : (u - 0.5) * 1.4;
    L[i] = b1 * env * Math.cos(((pan + 1) * Math.PI) / 4);
    R[i] = b1 * env * Math.sin(((pan + 1) * Math.PI) / 4);
  }
  return { L, R };
}
function addStereo(b, st, t, gain) {
  const n0 = Math.round(t * SR);
  for (let i = 0; i < st.L.length; i++) {
    const n = n0 + i;
    if (n < 0 || n >= N) continue;
    b.L[n] += st.L[i] * gain;
    b.R[n] += st.R[i] * gain;
  }
}
function pop(f) {
  const len = Math.round(0.12 * SR);
  const o = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f * (0.62 + 0.38 * Math.exp(-t / 0.03))) / SR;
    o[i] = Math.sin(ph) * Math.min(1, t / 0.003) * Math.exp(-t / 0.035);
  }
  return o;
}
function swish() {
  const len = Math.round(0.22 * SR);
  const o = new Float32Array(len);
  const r = rng(91);
  for (let i = 0; i < len; i++) {
    const u = i / len;
    o[i] = r() * Math.pow(Math.sin(Math.PI * u), 2);
  }
  filt(o, biquad('bp', 3200, 1.4));
  filt(o, biquad('hp', 1500, 0.7));
  return o;
}
// צלצול קטן כשמיתר מתיישב על הצליל
function ding(f) {
  const len = Math.round(1.1 * SR);
  const o = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const a = Math.min(1, t / 0.002);
    o[i] = a * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.3) + 0.4 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t / 0.16) + 0.16 * Math.sin(2 * Math.PI * f * 3.01 * t) * Math.exp(-t / 0.08));
  }
  return o;
}
function recBeep() {
  const len = Math.round(0.34 * SR);
  const o = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const on = t < 0.09 || (t > 0.15 && t < 0.3);
    const f = t < 0.12 ? 880 : 1318.5;
    o[i] = on ? Math.sin(2 * Math.PI * f * t) * 0.8 * Math.min(1, t / 0.004) : 0;
  }
  filt(o, biquad('lp', 5000, 0.7));
  return o;
}

for (const e of T.SFX) {
  if (e.type === 'pop') add(fx, pop(e.f), e.t, 0.2, ((e.f * 7) % 10) / 10 - 0.5);
  if (e.type === 'thud') add(fx, thud(e.vel), e.t, 0.7, 0);
  if (e.type === 'boom') add(fx, boom(e.vel), e.t, 0.55, 0);
  if (e.type === 'swish') add(fx, swish(), e.t, 0.45, 0);
  if (e.type === 'whoosh') addStereo(fx, whoosh(e.dur, !!e.up), e.t, 0.32);
  if (e.type === 'riser') addStereo(fx, whoosh(e.dur, true), e.t, 0.3);
  if (e.type === 'rec') add(fx, recBeep(), e.t, 0.1, 0);
  if (e.type === 'tick') add(fx, tick(), e.t, 0.5 * (e.vel ?? 1), e.pan ?? 0.15);
  if (e.type === 'blip') add(fx, blip(e.f), e.t, 0.11 * (e.vel ?? 1), e.pan ?? 0);
  if (e.type === 'drone') add(fx, drone(e.dur), e.t, 0.16, 0);
}
// הצלצול של כל מיתר: אותו תו, כמה אוקטבות למעלה
const DING = [659.26, 880.0, 587.33, 783.99, 987.77, 1318.51];
for (const seg of T.TUNE) add(fx, ding(DING[seg.s]), seg.t + seg.lock, 0.14, PAN[seg.s]);

// ---------- ריוורב (Freeverb) ----------
function reverb(inL, inR, { room = 0.8, damp = 0.35 } = {}) {
  const k = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const alls = [556, 441, 341, 225];
  const run = (input, spread) => {
    const out = new Float32Array(N);
    for (const c of combs) {
      const size = Math.round((c + spread) * k);
      const buf = new Float32Array(size);
      let p = 0, store = 0;
      for (let i = 0; i < N; i++) {
        const y = buf[p];
        store = y * (1 - damp) + store * damp;
        buf[p] = input[i] + store * room;
        p = (p + 1) % size;
        out[i] += y;
      }
    }
    for (const a of alls) {
      const size = Math.round((a + spread) * k);
      const buf = new Float32Array(size);
      let p = 0;
      for (let i = 0; i < N; i++) {
        const b = buf[p];
        const x = out[i];
        buf[p] = x + b * 0.5;
        out[i] = b - x;
        p = (p + 1) % size;
      }
    }
    return out;
  };
  const mono = new Float32Array(N);
  for (let i = 0; i < N; i++) mono[i] = (inL[i] + inR[i]) * 0.5 * 0.015;
  return { L: run(mono, 0), R: run(mono, 23) };
}

const send = bus();
for (let i = 0; i < N; i++) {
  send.L[i] = gtr.L[i] * 1.0 + drums.L[i] * 0.25 + fx.L[i] * 0.5;
  send.R[i] = gtr.R[i] * 1.0 + drums.R[i] * 0.25 + fx.R[i] * 0.5;
}
const wet = reverb(send.L, send.R, { room: 0.82, damp: 0.4 });
filt(wet.L, biquad('hp', 220, 0.7));
filt(wet.R, biquad('hp', 220, 0.7));

// ---------- מיקס ומאסטר ----------
const outL = new Float32Array(N), outR = new Float32Array(N);
const WET = 0.55;
for (let i = 0; i < N; i++) {
  outL[i] = gtr.L[i] + drums.L[i] + bassBus.L[i] + fx.L[i] + wet.L[i] * WET;
  outR[i] = gtr.R[i] + drums.R[i] + bassBus.R[i] + fx.R[i] + wet.R[i] * WET;
}
// דעיכה בסוף
const fadeN = Math.round(1.4 * SR);
const endN = Math.round(T.DURATION * SR);
for (let i = 0; i < N; i++) {
  let g = 1;
  if (i > endN - fadeN) g = Math.max(0, (endN - i) / fadeN);
  g = g * g;
  outL[i] *= g;
  outR[i] *= g;
}
// איזון בין הערוצים (לדיבוג): node tools/audio.mjs --stats
if (process.argv.includes('--stats')) {
  const db = (b, t0, t1) => {
    let s = 0, pk = 0;
    for (let i = Math.round(t0 * SR); i < Math.round(t1 * SR); i++) {
      s += b.L[i] * b.L[i] + b.R[i] * b.R[i];
      pk = Math.max(pk, Math.abs(b.L[i]), Math.abs(b.R[i]));
    }
    return `rms ${(10 * Math.log10(s / (2 * (t1 - t0) * SR) + 1e-12)).toFixed(1)} dB, peak ${pk.toFixed(2)}`;
  };
  for (const [name, b] of [['gtr', gtr], ['drums', drums], ['bass', bassBus], ['fx', fx], ['wet', wet], ['mix', { L: outL, R: outR }]])
    console.log(name.padEnd(6), 'groove:', db(b, 18, 28.8), '| hook:', db(b, 0, 4.2));
}

// מאסטר: רוויה עדינה מאוד, ואחריה לימיטר עם מבט קדימה
const DRIVE = 0.9;
for (let i = 0; i < N; i++) {
  outL[i] = Math.tanh(outL[i] * DRIVE) / DRIVE;
  outR[i] = Math.tanh(outR[i] * DRIVE) / DRIVE;
}
const PRE = 1.12; // כמה דוחפים לתוך הלימיטר
const CEIL = 0.84; // -1.5 dBFS
const LOOK = Math.round(0.005 * SR);
const gainEnv = new Float32Array(N);
{
  const want = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(outL[i]), Math.abs(outR[i])) * PRE;
    want[i] = p > CEIL ? CEIL / p : 1;
  }
  // מינימום בחלון המבט קדימה, שחרור איטי, ואז החלקה
  const held = new Float32Array(N);
  let rel = 1;
  const relCoef = Math.exp(-1 / (0.09 * SR));
  for (let i = 0; i < N; i++) {
    let m = 1;
    const end = Math.min(N, i + LOOK);
    for (let j = i; j < end; j++) if (want[j] < m) m = want[j];
    rel = m < rel ? m : 1 - (1 - rel) * relCoef;
    if (rel > 1) rel = 1;
    held[i] = Math.min(m, rel);
  }
  let acc = 0;
  for (let i = 0; i < N; i++) {
    acc += held[i] - (i >= LOOK ? held[i - LOOK] : 1);
    gainEnv[i] = i >= LOOK ? acc / LOOK + 1 : held[i];
  }
}
let peak = 0, minGain = 1;
for (let i = 0; i < N; i++) {
  const g = Math.min(1, gainEnv[i]) * PRE;
  outL[i] *= g;
  outR[i] *= g;
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
  minGain = Math.min(minGain, gainEnv[i]);
}
const norm = peak > CEIL ? CEIL / peak : 1;

const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(36 + N * 4, 4);
pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outL[i] * norm)) * 32767), 44 + i * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outR[i] * norm)) * 32767), 46 + i * 4);
}
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
mkdirSync(outDir, { recursive: true });
const outArg = process.argv.find((a) => a.startsWith('--out='));
const file = outArg ? path.resolve(outArg.slice(6)) : path.join(outDir, 'soundtrack.wav');
writeFileSync(file, pcm);
console.log(`soundtrack: ${file}  (${(N / SR).toFixed(2)}s, peak ${peak.toFixed(3)}, max limiting ${(20 * Math.log10(minGain)).toFixed(1)} dB)`);
