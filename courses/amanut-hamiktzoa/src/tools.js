/* ============ INTERACTIVE TOOLS ============ */
const TOOLS = {};

const nf = n => new Intl.NumberFormat('he-IL', {maximumFractionDigits:2}).format(n);
const money = n => '₪' + new Intl.NumberFormat('he-IL', {maximumFractionDigits:0}).format(Math.round(n));

/* ---------- Split Sheet calculator (ch. 8) ---------- */
TOOLS.splitSheet = function(el){
  const ROLES = ['מלחין (לחן)','כותב מילים','מעבד','מפיק','אמן מבצע','נגן','אחר'];
  el.innerHTML = `
    <div class="tool-h">מחשבון חלוקת זכויות — Split Sheet</div>
    <div class="tool-sub">מלאו את כל המשתתפים ביצירה. הסכום חייב להגיע ל־100% בדיוק, אחרת אין הסכם.</div>
    <div class="fld"><label>שם השיר</label><input type="text" id="ss-song" placeholder="שם היצירה"></div>
    <div id="ss-rows"></div>
    <div class="btn-row">
      <button class="btn ghost" id="ss-add">+ הוספת משתתף</button>
      <button class="btn ghost" id="ss-even">חלוקה שווה</button>
      <button class="btn" id="ss-copy">העתקת הטופס כטקסט</button>
    </div>
    <div class="out" id="ss-out"></div>`;

  const rowsEl = el.querySelector('#ss-rows');
  const outEl = el.querySelector('#ss-out');

  function addRow(name = '', role = ROLES[0], pct = ''){
    const d = document.createElement('div');
    d.className = 'split-row';
    d.innerHTML = `
      <input type="text" class="sr-name" placeholder="שם מלא" value="${name}">
      <select class="sr-role">${ROLES.map(r => `<option ${r === role ? 'selected' : ''}>${r}</option>`).join('')}</select>
      <input type="number" class="sr-pct" min="0" max="100" step="0.01" placeholder="%" value="${pct}">
      <button class="sr-del" title="מחיקה" aria-label="מחיקת שורה">✕</button>`;
    d.querySelector('.sr-del').onclick = () => { d.remove(); calc(); };
    d.querySelectorAll('input,select').forEach(i => i.oninput = calc);
    rowsEl.appendChild(d);
    calc();
  }

  function rows(){
    return [...rowsEl.querySelectorAll('.split-row')].map(r => ({
      name: r.querySelector('.sr-name').value.trim(),
      role: r.querySelector('.sr-role').value,
      pct: parseFloat(r.querySelector('.sr-pct').value) || 0
    }));
  }

  function calc(){
    const rs = rows();
    const total = rs.reduce((s, r) => s + r.pct, 0);
    const diff = +(100 - total).toFixed(2);
    const unnamed = rs.filter(r => r.pct > 0 && !r.name).length;
    let cls = 'out', msg;
    if(Math.abs(diff) < 0.005 && rs.length){
      cls = 'out ok';
      msg = `<span class="big">100%</span> — החלוקה סגורה.<br>עכשיו: להדפיס, לחתום על ידי <b>כל</b> המשתתפים, ולשמור עותק חתום אצל כל אחד.`;
      if(unnamed) { cls = 'out warn'; msg = `הסכום 100%, אבל ${unnamed} שורות בלי שם. הסכם חלוקה בלי שמות מלאים לא שווה כלום.`; }
    } else if(!rs.length){
      msg = 'הוסיפו משתתפים כדי להתחיל.';
    } else if(diff > 0){
      cls = 'out warn';
      msg = `סך הכל <span class="big">${nf(total)}%</span> — חסרים <b>${nf(diff)}%</b>. כל אחוז שלא הוקצה הוא אחוז שמישהו יטען עליו בעתיד.`;
    } else {
      cls = 'out warn';
      msg = `סך הכל <span class="big">${nf(total)}%</span> — חריגה של <b>${nf(-diff)}%</b>. אי אפשר לחלק יותר ממאה.`;
    }
    outEl.className = cls;
    outEl.innerHTML = msg;
  }

  el.querySelector('#ss-add').onclick = () => addRow();
  el.querySelector('#ss-even').onclick = () => {
    const n = rowsEl.querySelectorAll('.split-row').length;
    if(!n) return;
    const base = Math.floor(10000 / n) / 100;
    const rest = +(100 - base * n).toFixed(2);
    rowsEl.querySelectorAll('.sr-pct').forEach((i, k) => i.value = (k === 0 ? +(base + rest).toFixed(2) : base));
    calc();
  };
  el.querySelector('#ss-copy').onclick = () => {
    const song = el.querySelector('#ss-song').value.trim() || '(ללא שם)';
    const rs = rows().filter(r => r.name || r.pct);
    const total = rs.reduce((s, r) => s + r.pct, 0);
    const txt = [
      'הסכם חלוקת זכויות ביצירה (Split Sheet)',
      'שם היצירה: ' + song,
      'תאריך: ' + new Date().toLocaleDateString('he-IL'),
      '',
      ...rs.map(r => `${r.name || '____________'} — ${r.role} — ${nf(r.pct)}%   חתימה: ____________`),
      '',
      `סך הכל: ${nf(total)}%`,
      '',
      'החתימה מאשרת שהחלוקה לעיל מוסכמת על כל הצדדים.'
    ].join('\n');
    navigator.clipboard?.writeText(txt).then(
      () => { outEl.className = 'out ok'; outEl.textContent = 'הטופס הועתק. הדביקו במסמך, הדפיסו והחתימו.'; },
      () => { outEl.className = 'out'; outEl.innerHTML = '<pre style="white-space:pre-wrap;font-family:inherit">' + txt + '</pre>'; }
    );
  };

  addRow(); addRow();
};

/* ---------- Pricing calculator (ch. 19) ---------- */
TOOLS.pricing = function(el){
  el.innerHTML = `
    <div class="tool-h">מחשבון תמחור פרויקט</div>
    <div class="tool-sub">המספר שיוצא הוא רצפה, לא תקרה. הוא אומר לכם מתחת לאיזה מחיר אתם מפסידים כסף.</div>
    <div class="fld"><label>כמה אתם רוצים להרוויח בחודש (נטו, לפני מס)</label><input type="number" id="p-goal" value="12000" min="0" step="500"></div>
    <div class="fld"><label>הוצאות קבועות לחודש (סטודיו, תוכנות, ציוד, אינטרנט)</label><input type="number" id="p-fixed" value="2500" min="0" step="100"></div>
    <div class="fld"><label>שעות עבודה בפועל בחודש (רק שעות מחויבות — לא שיווק ולא מיילים)</label><input type="number" id="p-hours" value="90" min="1" step="5"></div>
    <div class="fld"><label>שעות עבודה שהפרויקט הזה ייקח (כולל תיקונים ופגישות)</label><input type="number" id="p-proj" value="25" min="1" step="1"></div>
    <div class="fld"><label>מורכבות / דחיפות</label>
      <select id="p-mult">
        <option value="1">רגיל — לוח זמנים סביר</option>
        <option value="1.25">מורכב — הרבה תיקונים צפויים</option>
        <option value="1.5">דחוף — דדליין קצר, דוחף פרויקטים אחרים</option>
        <option value="2">אקספרס — סופ״ש / לילות</option>
      </select>
    </div>
    <div class="out" id="p-out"></div>`;

  const out = el.querySelector('#p-out');
  function calc(){
    const goal = +el.querySelector('#p-goal').value || 0;
    const fixed = +el.querySelector('#p-fixed').value || 0;
    const hours = Math.max(1, +el.querySelector('#p-hours').value || 1);
    const proj = Math.max(1, +el.querySelector('#p-proj').value || 1);
    const mult = +el.querySelector('#p-mult').value;
    const rate = (goal + fixed) / hours;
    const price = rate * proj * mult;
    out.className = 'out ok';
    out.innerHTML = `
      תעריף השעה שלכם: <b>${money(rate)}</b> לשעה<br>
      מחיר הפרויקט: <span class="big">${money(price)}</span><br><br>
      מקדמה מומלצת (50%): <b>${money(price * 0.5)}</b> · תשלום סופי לפני מסירה: <b>${money(price * 0.5)}</b><br>
      <span style="color:var(--ink2);font-size:15px">כלול: ${Math.round(proj)} שעות ו-2 סבבי תיקונים. סבב נוסף: ${money(rate * 2)}.</span>`;
  }
  el.querySelectorAll('input,select').forEach(i => i.oninput = calc);
  calc();
};

/* ---------- Recoupment / royalty calculator (ch. 12) ---------- */
TOOLS.recoup = function(el){
  el.innerHTML = `
    <div class="tool-h">מחשבון מקדמה והחזר השקעה</div>
    <div class="tool-sub">המקדמה היא לא מתנה — היא הלוואה על חשבון התמלוגים שלכם. זה המחשבון שמראה מתי היא נגמרת.</div>
    <div class="fld"><label>מקדמה שקיבלתם (Advance)</label><input type="number" id="r-adv" value="20000" min="0" step="1000"></div>
    <div class="fld"><label>עלויות נוספות שניתנות לקיזוז (הקלטות, קליפ, שיווק)</label><input type="number" id="r-cost" value="15000" min="0" step="1000"></div>
    <div class="fld"><label>אחוז התמלוגים שלכם מההכנסות (Producer Points)</label><input type="number" id="r-pts" value="4" min="0" max="50" step="0.5"></div>
    <div class="fld"><label>הכנסה צפויה מהשיר (ברוטו, לאורך חיי העסקה)</label><input type="number" id="r-rev" value="400000" min="0" step="10000"></div>
    <div class="out" id="r-out"></div>`;

  const out = el.querySelector('#r-out');
  function calc(){
    const adv = +el.querySelector('#r-adv').value || 0;
    const cost = +el.querySelector('#r-cost').value || 0;
    const pts = (+el.querySelector('#r-pts').value || 0) / 100;
    const rev = +el.querySelector('#r-rev').value || 0;
    const pool = adv + cost;
    const earned = rev * pts;
    const net = earned - pool;
    const breakeven = pts > 0 ? pool / pts : Infinity;
    if(net >= 0){
      out.className = 'out ok';
      out.innerHTML = `
        החשבון התאזן. סך התמלוגים שנצברו: <b>${money(earned)}</b>, מול ${money(pool)} שצריך להחזיר.<br>
        מה שיגיע אליכם בפועל מעבר למקדמה: <span class="big">${money(net)}</span><br>
        <span style="color:var(--ink2);font-size:15px">נקודת האיזון (Break-even): הכנסה של ${money(breakeven)} מהשיר.</span>`;
    } else {
      out.className = 'out warn';
      out.innerHTML = `
        עדיין לא הוחזרה ההשקעה (Unrecouped). נצברו <b>${money(earned)}</b> מתוך ${money(pool)} שצריך להחזיר.<br>
        חסר עוד: <span class="big">${money(-net)}</span><br>
        <span style="color:var(--ink2);font-size:15px">כלומר צריך הכנסה של ${money(breakeven)} מהשיר לפני שתראו שקל נוסף מעבר למקדמה. ${adv ? 'המקדמה כבר בכיס — זה לא כסף אבוד, זה כסף שכבר קיבלתם.' : ''}</span>`;
    }
  }
  el.querySelectorAll('input').forEach(i => i.oninput = calc);
  calc();
};

/* ---------- Red flags meter (ch. 26) ---------- */
TOOLS.redFlags = function(el){
  const FLAGS = [
    ['אין חוזה, ו"נסדר את זה אחר כך"', 3],
    ['מסרב לשלם מקדמה', 3],
    ['"אני אשלם לך כשהשיר ייצא"', 3],
    ['מציע חשיפה במקום תשלום', 2],
    ['לא מוכן להגדיר בכתב מה כלול בעבודה', 3],
    ['לא מסכים להגביל את מספר סבבי התיקונים', 2],
    ['משנה כיוון אמנותי כל פגישה', 2],
    ['לא מוכן לחתום על Split Sheet', 3],
    ['התמקח על המחיר לפני ששמע מה העבודה כוללת', 1],
    ['מדבר רע על כל מי שעבד איתו לפניכם', 2],
    ['מבקש קבצי פרויקט מלאים בלי שסוכם על כך', 2],
    ['מבקש להשתמש בסמפל שהוא "בטוח שזה בסדר"', 2],
    ['דורש בלעדיות בלי תמורה מתאימה', 2],
    ['לוח זמנים בלתי אפשרי ולא מוכן לזוז ממנו', 2],
    ['לא עונה לימים ואז דורש תשובה מיידית', 1]
  ];
  el.innerHTML = `
    <div class="tool-h">מד סימני אזהרה — לפני שאתם אומרים כן</div>
    <div class="tool-sub">סמנו כל מה שקורה בפועל בפרויקט שעל הפרק. אין כאן ציון עובר — יש כאן החלטה.</div>
    <div id="rf-rows"></div>
    <div class="out" id="rf-out"></div>`;

  const rowsEl = el.querySelector('#rf-rows');
  const out = el.querySelector('#rf-out');
  FLAGS.forEach(([txt, w], i) => {
    const d = document.createElement('div');
    d.className = 'chk-row'; d.dataset.w = w; d.tabIndex = 0;
    d.innerHTML = `<div class="chk-box">✓</div><div class="chk-tx">${txt}</div>`;
    const t = () => { d.classList.toggle('on'); calc(); };
    d.onclick = t;
    d.onkeydown = e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); t(); } };
    rowsEl.appendChild(d);
  });

  function calc(){
    const on = [...rowsEl.querySelectorAll('.chk-row.on')];
    const score = on.reduce((s, r) => s + +r.dataset.w, 0);
    const critical = on.filter(r => +r.dataset.w === 3).length;
    let cls, msg;
    if(score === 0){ cls = 'out ok'; msg = 'נקי לגמרי. תעלו את זה על הכתב ותתחילו לעבוד.'; }
    else if(critical >= 2 || score >= 9){ cls = 'out warn'; msg = `<span class="big">${score} נקודות · ${critical} דגלים אדומים</span><br>זה לא פרויקט שכדאי לקחת כמו שהוא. או שהתנאים משתנים בכתב, או שאתם מוותרים — ואין בזה שום דבר אישי.`; }
    else if(critical >= 1 || score >= 5){ cls = 'out warn'; msg = `<span class="big">${score} נקודות</span><br>יש כאן משהו לתקן לפני שמתחילים. אל תתחילו לעבוד עד שכל סעיף שסימנתם סגור בכתב.`; }
    else { cls = 'out'; msg = `<span class="big">${score} נקודות</span><br>סביר. שימו לב לנקודות שסימנתם, סגרו אותן בהודעה כתובה, ותתקדמו.`; }
    out.className = cls; out.innerHTML = msg;
  }
  calc();
};

/* ---------- Delivery folder generator (ch. 16) ---------- */
TOOLS.delivery = function(el){
  el.innerHTML = `
    <div class="tool-h">מחולל תיקיית מסירה</div>
    <div class="tool-sub">הזינו את פרטי הפרויקט וקבלו מבנה תיקיות ושמות קבצים אחידים — אותו דבר בכל פרויקט, בלי לחשוב על זה שוב.</div>
    <div class="fld"><label>שם האמן</label><input type="text" id="d-art" value="Artist Name"></div>
    <div class="fld"><label>שם השיר</label><input type="text" id="d-song" value="Song Title"></div>
    <div class="fld"><label>גרסה</label><input type="text" id="d-ver" value="v1.0"></div>
    <div class="out" id="d-out"></div>
    <div class="btn-row"><button class="btn" id="d-copy">העתקת המבנה</button></div>`;

  const out = el.querySelector('#d-out');
  const clean = s => s.trim().replace(/\s+/g, '_').replace(/[^\w֐-׿_-]/g, '') || 'Untitled';

  function build(){
    const a = clean(el.querySelector('#d-art').value);
    const s = clean(el.querySelector('#d-song').value);
    const v = clean(el.querySelector('#d-ver').value);
    const base = `${a}_-_${s}_${v}`;
    return [
      `${base}/`,
      `├─ 01_MASTERS/`,
      `│   ├─ ${base}_MASTER_24bit_48k.wav`,
      `│   ├─ ${base}_MASTER_16bit_44k.wav`,
      `│   ├─ ${base}_MASTER_320.mp3`,
      `│   ├─ ${base}_INSTRUMENTAL.wav`,
      `│   ├─ ${base}_ACAPELLA.wav`,
      `│   ├─ ${base}_CLEAN.wav`,
      `│   └─ ${base}_TV_MIX.wav`,
      `├─ 02_STEMS/`,
      `│   ├─ ${base}_STEM_Drums.wav`,
      `│   ├─ ${base}_STEM_Bass.wav`,
      `│   ├─ ${base}_STEM_Keys.wav`,
      `│   ├─ ${base}_STEM_Guitars.wav`,
      `│   ├─ ${base}_STEM_LeadVox.wav`,
      `│   ├─ ${base}_STEM_BackVox.wav`,
      `│   └─ ${base}_STEM_FX.wav`,
      `├─ 03_SOURCE/`,
      `│   ├─ ${base}_DryVocals.wav`,
      `│   ├─ ${base}_MIDI.mid`,
      `│   └─ ${base}_PROJECT/   (רק אם סוכם בכתב שהוא נמסר)`,
      `├─ 04_ARTWORK/`,
      `│   └─ ${base}_COVER_3000x3000.jpg`,
      `└─ 05_DOCS/`,
      `    ├─ ${base}_CREDITS.txt`,
      `    ├─ ${base}_METADATA.txt   (ISRC, UPC, כותבים, שנה)`,
      `    ├─ ${base}_LYRICS.txt`,
      `    ├─ ${base}_SAMPLES.txt    (כל סמפל, מקורו והרישיון שלו)`,
      `    └─ ${base}_SPLIT_SHEET.pdf (חתום)`
    ].join('\n');
  }
  function render(){
    out.className = 'out';
    out.innerHTML = '<pre style="white-space:pre;overflow-x:auto;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;line-height:1.7;direction:ltr;text-align:left">' +
      build().replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) + '</pre>';
  }
  el.querySelectorAll('input').forEach(i => i.oninput = render);
  el.querySelector('#d-copy').onclick = () => navigator.clipboard?.writeText(build());
  render();
};
