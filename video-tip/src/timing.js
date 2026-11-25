// ציר הזמן המשותף של הסרטון.
// גם האנימציה (main.js) וגם הפסקול (tools/audio.mjs) קוראים מכאן,
// כך שכל פריטה שנשמעת היא בדיוק הפריטה שרואים על המסך.

export const W = 1080;
export const H = 1920;
export const FPS = 60;

// 100 פעימות לדקה: שמינית = 0.3 שניות, אקורד מתחלף כל 1.2 שניות
export const BEAT = 0.6;
export const CHORD_LEN = 1.2;

// תחילת כל סצנה, בשניות
export const SC = {
  hook: 0.0, // תפסיקו להתלונן. תתחילו לנגן!
  guitar: 4.2, // הגיטרה הישנה ששוכבת לכם בבית
  tune: 9.6, // שלב 1: מכוונים
  chords: 18.0, // שלב 2: ארבעה אקורדים
  daily: 24.0, // שלב 3: עשר דקות ביום
  rec: 28.8, // תקליטו כל רעיון
  insp: 31.2, // ומה עם השראה?
  cta: 36.0, // אז תפסיקו להתלונן, ולכו לנגן!
};
export const DURATION = 41.4;

// ---------- הגיטרה ----------
// מיתרים פתוחים, מהעבה (6) לדק (1)
export const OPEN = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
export const STRING_NAMES = [
  ['E', 'מי'],
  ['A', 'לה'],
  ['D', 'רה'],
  ['G', 'סול'],
  ['B', 'סי'],
  ['E', 'מי'],
];
// סריג לכל מיתר (‎-1 = המיתר לא מנוגן)
export const CHORDS = {
  G: [3, 2, 0, 0, 0, 3],
  D: [-1, -1, 0, 2, 3, 2],
  Em: [0, 2, 2, 0, 0, 0],
  C: [-1, 3, 2, 0, 1, 0],
  Cadd9: [-1, 3, 2, 0, 3, 3],
  OPEN: [0, 0, 0, 0, 0, 0],
};
export const PROG = ['G', 'D', 'Em', 'C'];

// כמה כל מיתר "ברח" מהכיוון (בסנטים) בגיטרה הישנה
export const DETUNE = [-92, -58, 54, -74, 46, -86];

// ---------- סצנת הפתיחה ----------
export const HOOK = {
  bubbles: [-1, -1, 0.04, 0.3, 0.46, 0.84, 1.02], // שתי הראשונות כבר על המסך בפריים הראשון
  w1: 0.15,
  w2: 0.6,
  strike: 1.5,
  boom: 2.1,
  w4: 2.4,
};
export const GUITAR = {
  draw: SC.guitar + 0.15,
  sour: 5.7,
  swap: 6.9,
  zoom: 8.75,
};
export const CTA = {
  w1: SC.cta,
  strike: SC.cta + 0.6,
  boom: SC.cta + 1.2,
  w4: SC.cta + 1.5,
  share: SC.cta + 2.6,
};

// ---------- כיוון: מיתר אחרי מיתר ----------
// t = הפריטה הראשונה, lock = הרגע שבו המיתר מתיישב על הצליל, d = אורך הקטע
export const TUNE = [
  { s: 0, t: 10.2, d: 1.2, lock: 0.84 },
  { s: 1, t: 11.4, d: 0.9, lock: 0.58 },
  { s: 2, t: 12.3, d: 0.9, lock: 0.58 },
  { s: 3, t: 13.2, d: 0.9, lock: 0.58 },
  { s: 4, t: 14.1, d: 0.9, lock: 0.58 },
  { s: 5, t: 15.0, d: 0.9, lock: 0.58 },
];
export const TUNE_DONE = 15.9;

const easeInOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

// כמה סנטים המיתר רחוק מהצליל בזמן t (0 = מכוון)
export function tuneCents(seg, t) {
  const c0 = DETUNE[seg.s];
  const u = (t - seg.t) / seg.lock;
  if (u <= 0) return c0;
  if (u >= 1) return 0;
  // סיבוב המפתח: רוב הדרך מהר, ונחיתה עדינה עם חריגה קטנה
  const e = easeInOut(u);
  const overshoot = Math.sin(Math.PI * u) * u * 0.1;
  return c0 * (1 - e - overshoot);
}

// ---------- אירועי המוזיקה ----------
export const STRUMS = []; // {t, chord, dir, vel, spread, sour}
export const DRUMS = []; // {t, type, vel}
export const BASS = []; // {t, f, dur, vel}
export const SFX = []; // {t, type, ...}

const strum = (t, chord, dir = 'd', vel = 0.9, extra = {}) =>
  STRUMS.push({ t, chord, dir, vel, spread: dir === 'd' ? 0.013 : 0.009, ...extra });
const drum = (t, type, vel = 1) => DRUMS.push({ t, type, vel });

const BASS_ROOT = { G: 98.0, D: 73.42, Em: 82.41, C: 65.41 };

// הפתיחה: שתי פריטות גדולות על "תתחילו" ועל "לנגן!"
strum(HOOK.boom, 'G', 'd', 1.0, { spread: 0.016 });
strum(HOOK.w4, 'G', 'd', 1.0, { spread: 0.011 });
drum(HOOK.boom, 'kick', 1);
drum(HOOK.w4, 'kick', 0.9);
drum(HOOK.w4, 'clap', 0.7);

// הגיטרה הישנה: פריטה איטית וחמוצה על מיתרים לא מכוונים
strum(GUITAR.sour, 'OPEN', 'd', 0.8, { spread: 0.07, sour: true });

// אחרי הכיוון: C ואז D שמובילים לכניסה של הגרוב ב-G
strum(TUNE_DONE, 'Cadd9', 'd', 0.95, { spread: 0.02 });
strum(16.8, 'D', 'd', 0.75);
strum(17.1, 'D', 'u', 0.45);
strum(17.4, 'D', 'd', 0.85);
strum(17.7, 'D', 'u', 0.6);
drum(TUNE_DONE, 'kick', 0.8);
drum(17.4, 'kick', 0.7);
drum(17.55, 'clap', 0.35);
drum(17.7, 'clap', 0.55);
drum(17.85, 'clap', 0.7);

// הגרוב: G - D - Em - C, אקורד כל 1.2 שניות
const GROOVE_START = SC.chords;
const N_CHORDS = 16; // עד 37.2
for (let k = 0; k < N_CHORDS; k++) {
  const t = +(GROOVE_START + k * CHORD_LEN).toFixed(3);
  const chord = PROG[k % 4];
  const root = BASS_ROOT[chord];
  const breakdown = Math.abs(t - SC.insp) < 0.01; // "ומה עם השראה?" - הכול נעצר לרגע
  const stop = Math.abs(t - SC.cta) < 0.01; // "אז תפסיקו להתלונן," - אקורד אחד שמחכה

  if (breakdown || stop) {
    strum(t, chord, 'd', stop ? 0.95 : 0.8, { spread: 0.03 });
    if (stop) drum(t, 'kick', 0.9);
    BASS.push({ t, f: root, dur: 1.0, vel: 0.8 });
    continue;
  }

  strum(t, chord, 'd', 0.92);
  if (k % 2 === 0) strum(t + 0.3, chord, 'u', 0.3);
  strum(t + 0.6, chord, 'd', 0.7);
  strum(t + 0.9, chord, 'u', 0.5);

  drum(t, 'kick', 1);
  drum(t + 0.6, 'clap', 0.8);
  if (k % 2 === 1) drum(t + 0.9, 'kick', 0.65);
  drum(t, 'shaker', 0.3);
  drum(t + 0.3, 'shaker', 0.55);
  drum(t + 0.6, 'shaker', 0.3);
  drum(t + 0.9, 'shaker', 0.55);

  BASS.push({ t, f: root, dur: 0.5, vel: 1 });
  BASS.push({ t: t + 0.9, f: root, dur: 0.24, vel: 0.7 });
}

// הסיום: G אחרון שמצלצל עד הסוף
strum(CTA.boom, 'G', 'd', 1.0, { spread: 0.016 });
strum(CTA.w4, 'G', 'd', 1.0, { spread: 0.011 });
drum(CTA.boom, 'kick', 1);
drum(CTA.w4, 'kick', 0.9);
drum(CTA.w4, 'clap', 0.7);
BASS.push({ t: CTA.boom, f: 98.0, dur: 2.4, vel: 1 });

// ---------- אפקטים ----------
HOOK.bubbles.forEach((t, i) => t >= 0 && SFX.push({ t, type: 'pop', f: 520 - i * 38 }));
SFX.push({ t: HOOK.w1, type: 'thud', vel: 1 });
SFX.push({ t: HOOK.w2, type: 'thud', vel: 1.1 });
SFX.push({ t: HOOK.strike, type: 'swish' });
SFX.push({ t: 1.25, type: 'riser', dur: 0.85 });
SFX.push({ t: HOOK.boom, type: 'boom', vel: 1 });
SFX.push({ t: SC.guitar - 0.25, type: 'whoosh', dur: 0.6 });
SFX.push({ t: GUITAR.zoom, type: 'whoosh', dur: 0.95, up: true });
SFX.push({ t: SC.tune, type: 'thud', vel: 0.6 });
SFX.push({ t: TUNE_DONE, type: 'boom', vel: 0.6 });
SFX.push({ t: SC.chords - 0.5, type: 'riser', dur: 0.5 });
SFX.push({ t: SC.chords, type: 'boom', vel: 0.7 });
SFX.push({ t: SC.daily - 0.2, type: 'whoosh', dur: 0.45 });
SFX.push({ t: SC.rec - 0.2, type: 'whoosh', dur: 0.45 });
SFX.push({ t: SC.rec + 0.02, type: 'rec' });
SFX.push({ t: SC.insp - 0.25, type: 'whoosh', dur: 0.5 });
SFX.push({ t: SC.insp + CHORD_LEN - 0.45, type: 'riser', dur: 0.45 });
SFX.push({ t: SC.cta - 0.2, type: 'whoosh', dur: 0.4 });
SFX.push({ t: SC.cta, type: 'thud', vel: 1 });
SFX.push({ t: CTA.strike, type: 'swish' });
SFX.push({ t: CTA.boom - 0.55, type: 'riser', dur: 0.55 });
SFX.push({ t: CTA.boom, type: 'boom', vel: 1 });

// הזמזום הצורם של הפתיחה, שנקטע בדיוק על האקורד הראשון
SFX.push({ t: 0, type: 'drone', dur: HOOK.boom });
// קליקים רכים כששורות טקסט נכנסות
for (const t of [SC.guitar + 0.08, SC.guitar + 0.43, GUITAR.swap + 0.03, GUITAR.swap + 0.58, GUITAR.swap + 0.78]) SFX.push({ t, type: 'tick' });
for (const t of [TUNE_DONE + 0.15, SC.chords + 4 * CHORD_LEN + 0.03, SC.rec + CHORD_LEN + 0.03, CTA.share + 0.03]) SFX.push({ t, type: 'tick', vel: 0.7 });
// הטיימר מגיע לעשר דקות, ושבעת הימים מתמלאים בסולם עולה
SFX.push({ t: SC.daily + 2.05, type: 'blip', f: 1174.66, vel: 1.2 });
[783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 1567.98].forEach((f, i) =>
  SFX.push({ t: SC.daily + 2 * CHORD_LEN + i * 0.15, type: 'blip', f, pan: 0.5 - i * 0.16 })
);

// ---------- עזר לאנימציה ----------
// תדר של מיתר s באקורד נתון (או null אם לא מנוגן)
export function chordFreq(chord, s) {
  const fret = CHORDS[chord][s];
  return fret < 0 ? null : OPEN[s] * Math.pow(2, fret / 12);
}

// רגע הפריטה של כל מיתר בתוך פריטה אחת
export function strumNotes(ev) {
  const frets = CHORDS[ev.chord];
  const order = ev.dir === 'd' ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];
  const played = order.filter((s) => frets[s] >= 0);
  // פריטה למעלה תופסת בעיקר את המיתרים הדקים
  const list = ev.dir === 'u' ? played.slice(0, 4) : played;
  return list.map((s, i) => ({
    s,
    t: ev.t + i * ev.spread,
    f: OPEN[s] * Math.pow(2, frets[s] / 12) * (ev.sour ? Math.pow(2, DETUNE[s] / 1200) : 1),
    vel: ev.vel * (ev.dir === 'u' ? 0.85 : 1),
    sour: !!ev.sour,
  }));
}

// כמה חזק כל מיתר רוטט ברגע t (0..1), לפי כל מה שנוגן עד עכשיו
const ALL_NOTES = [];
for (const ev of STRUMS) for (const n of strumNotes(ev)) ALL_NOTES.push({ s: n.s, t: n.t, a: n.vel, tau: ev.sour ? 0.5 : 0.75 });
for (const seg of TUNE) {
  ALL_NOTES.push({ s: seg.s, t: seg.t, a: 0.9, tau: 0.5 });
  ALL_NOTES.push({ s: seg.s, t: seg.t + seg.lock * 0.52, a: 0.8, tau: 0.5 });
  ALL_NOTES.push({ s: seg.s, t: seg.t + seg.lock, a: 0.55, tau: 0.6 });
}
ALL_NOTES.sort((a, b) => a.t - b.t);

export function stringAmp(s, t) {
  let amp = 0;
  for (const n of ALL_NOTES) {
    if (n.t > t) break;
    if (n.s !== s) continue;
    const dt = t - n.t;
    if (dt > 4) continue;
    const attack = Math.min(1, dt / 0.012);
    amp = Math.max(amp, n.a * attack * Math.exp(-dt / n.tau));
  }
  return amp;
}

// עוצמה כללית של הנגינה (לאנימציות שמגיבות למוזיקה)
export function energy(t) {
  let e = 0;
  for (let s = 0; s < 6; s++) e += stringAmp(s, t);
  return Math.min(1, e / 3.2);
}
