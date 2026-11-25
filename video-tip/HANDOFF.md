# מסמך העברה: הסרטון "תפסיקו להתלונן. תתחילו לנגן!"

המסמך הזה מיועד לצ'אט אחר (או לכל מי שצריך לשחזר את הסרטון). הוא מכיל את המפרט המלא ואת כל קוד המקור, מילה במילה. מי שמריץ את הקוד שכאן מקבל את אותו סרטון בדיוק.

---

## 0. הוראות לצ'אט שמקבל את המסמך

**המשימה שלך:** להפיק את הסרטון המתואר כאן אחד לאחד. לא גרסה דומה, לא "בהשראת", לא שיפור.

כללים מחייבים:

1. **אל תכתוב את הקוד מחדש.** צור את הקבצים שבסעיף 10 בדיוק כפי שהם, תו בתו, ואמת כל קובץ מול ה־md5 שרשום לידו.
2. **אל תשנה שום דבר:** לא טקסט, לא צבע, לא פונט, לא תזמון, לא גרסת ספרייה, לא פרמטר קידוד. אם משהו נראה לך כמו טעות, דווח עליו ואל תתקן.
3. **אל תחליף כלים.** האנימציה היא דף HTML עם GSAP שמצולם פריים אחרי פריים בכרומיום (Playwright), והפסקול מסונתז ב־Node. לא Remotion, לא After Effects, לא מחולל וידאו, לא מוזיקה מוכנה.
4. **הרץ את בדיקות הקבלה שבסעיף 8** ודווח על המספרים שקיבלת בפועל.
5. **אם אין לך סביבה שמריצה קוד** (Node, דפדפן כרומיום ו־ffmpeg), אמור זאת מיד ועצור. תיאור מילולי או סרטון "דומה" אינם תחליף.
6. הסעיפים 2 עד 7 מתארים את הסרטון במילים כדי שתבין מה אתה בונה ותוכל לבדוק את התוצאה. **אם יש סתירה בין התיאור לקוד, הקוד קובע.**

### דרישות סביבה

| רכיב | הגרסה שבה הסרטון נוצר |
| --- | --- |
| Node.js | 22.23.5 (כל Node 20 ומעלה אמור לעבוד) |
| Playwright | 1.63.0 |
| Chromium | 158.0.8127.36 |
| ffmpeg | 6.1.1, עם libx264 ו־aac |
| GSAP | 3.15.1 |
| @fontsource-variable/noto-sans-hebrew | 5.3.0 |
| @fontsource-variable/heebo | 5.3.0 |
| @fontsource/frank-ruhl-libre | 5.3.0 |

הפסקול זהה ביט בביט בכל הרצה. הפריימים זהים ביט בביט באותה גרסת כרומיום. בגרסת כרומיום אחרת ייתכנו הבדלים זעירים בהחלקת קצוות של אותיות, שלא נראים לעין.

---

## 1. שתי דרכים לשחזר

### דרך א': יש לך גישה למאגר ב־GitHub (הכי פשוט)

הקוד כולו, כולל הפונטים ו־GSAP, כבר נמצא במאגר `elyoz4171363-afk/MUSIC`, בענף `ccr-9f154b3a-sssumc`, בתיקייה `video-tip`.

```bash
git fetch origin ccr-9f154b3a-sssumc && git checkout ccr-9f154b3a-sssumc
cd video-tip
npm run render        # מסנתז את הפסקול ומרנדר ל-tip-video.mp4, כ-6 דקות
```

הקובץ המוכן `tip-video.mp4` ותמונת השער `cover.jpg` כבר נמצאים שם, כך שאפשר להשוות אליהם.

### דרך ב': אין גישה למאגר, בונים מהמסמך הזה

```bash
mkdir -p video-tip/src video-tip/tools video-tip/vendor/fonts video-tip/out && cd video-tip

# 1. צור את כל הקבצים מסעיף 10, בנתיבים שרשומים שם, ואמת md5.

# 2. ספריות צד שלישי (בדיוק הגרסאות האלה)
npm i --no-save gsap@3.15.1 @fontsource-variable/noto-sans-hebrew@5.3.0 @fontsource-variable/heebo@5.3.0 @fontsource/frank-ruhl-libre@5.3.0
cp node_modules/gsap/dist/gsap.min.js vendor/
cp node_modules/@fontsource-variable/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-standard-normal.woff2 vendor/fonts/
cp node_modules/@fontsource-variable/noto-sans-hebrew/files/noto-sans-hebrew-latin-standard-normal.woff2 vendor/fonts/
cp node_modules/@fontsource-variable/heebo/files/heebo-hebrew-wght-normal.woff2 vendor/fonts/
cp node_modules/@fontsource-variable/heebo/files/heebo-latin-wght-normal.woff2 vendor/fonts/
cp node_modules/@fontsource/frank-ruhl-libre/files/frank-ruhl-libre-hebrew-500-normal.woff2 vendor/fonts/
cp node_modules/@fontsource/frank-ruhl-libre/files/frank-ruhl-libre-hebrew-900-normal.woff2 vendor/fonts/

# 3. Playwright, אם הוא לא מותקן כבר בסביבה
npm i --no-save playwright@1.63.0 && npx playwright install chromium

# 4. פסקול ואז רינדור
node tools/audio.mjs
node tools/render.cjs --crf=17 --out=tip-video.mp4
```

md5 של קובצי הצד השלישי אחרי ההעתקה:

| קובץ | md5 |
| --- | --- |
| `vendor/gsap.min.js` | `ff86cb553ce59ae0ba7ece604333b233` |
| `vendor/fonts/noto-sans-hebrew-hebrew-standard-normal.woff2` | `ed981f7fc84d8aa188edc1f473b8d96f` |
| `vendor/fonts/noto-sans-hebrew-latin-standard-normal.woff2` | `ace1cd403b3be6e49d35c5055122f243` |
| `vendor/fonts/heebo-hebrew-wght-normal.woff2` | `de80852899c519f1567600f46f1d2a29` |
| `vendor/fonts/heebo-latin-wght-normal.woff2` | `480b1d24f2aa69252a57d434d50a5288` |
| `vendor/fonts/frank-ruhl-libre-hebrew-500-normal.woff2` | `e67df2ecc64e12405b292dafec504e26` |
| `vendor/fonts/frank-ruhl-libre-hebrew-900-normal.woff2` | `17baafebebc6fdc172d83ddc8b51aa2e` |

---

## 2. מפרט טכני

| | |
| --- | --- |
| גודל | 1080×1920 (אנכי, 9:16) |
| קצב פריימים | 60 |
| אורך | 41.4 שניות, 2,484 פריימים |
| וידאו | H.264 High, yuv420p, BT.709 בטווח מוגבל, CRF 17, preset slow, מפתח כל 2 שניות |
| אודיו | AAC-LC, 256kbps, 48kHz סטריאו, עוצמה ‎-12.4 LUFS, שיא ‎-1.1 dBTP |
| משקל | כ־40MB |
| שפה | עברית, כיווניות מימין לשמאל |

**אזורים בטוחים לרשתות:** כל התוכן החשוב נמצא בין y=206 ל־y=1500 ובין x=80 ל־x=1000. החלק התחתון (מ־1500 ומטה) נשאר ריק בכוונה, כי שם הרשתות מציגות כיתוב וכפתורים.

---

## 3. השפה העיצובית

### צבעים

| שם | ערך | שימוש |
| --- | --- | --- |
| ink | `#0c0a08` | רקע כהה, וטקסט על הכתום |
| cream | `#f6ecd9` | הטקסט הראשי |
| muted | `#8f8573` | טקסט משני |
| amber | `#ffa32b` | הדגשה (ומדרג עד `#ff6a1a`) |
| mint | `#8dffc0` | "מכוון", רק בסצנת הטיונר |
| red | `#ff4a3d` | נקודת ההקלטה בלבד |

הרקע הכהה הוא מדרג מעגלי: `radial-gradient(120% 80% at 50% 40%, #1d150e 0%, #110d0a 48%, #080605 100%)`.
הפאנל הכתום: `radial-gradient(130% 90% at 50% 40%, #ffbe45 0%, #ff9a26 46%, #f7640f 100%)`.

### פונטים

| תפקיד | פונט | הגדרות |
| --- | --- | --- |
| כותרות ענק ("Poster") | Noto Sans Hebrew משתנה | משקל 900, רוחב 62.5% (הכי צר), line-height 0.9 עד 0.96 |
| טקסט רץ ("Text") | Heebo משתנה | משקלים 500 עד 900 |
| הציטוט ("Quote") | Frank Ruhl Libre | משקל 900 |

שורות הענק לא מקבלות גודל קבוע: פונקציה `fit` מודדת את השורה ומגדילה את האות עד שהיא תופסת רוחב של 900 פיקסלים (עם תקרה לכל שורה).

### שכבות קבועות לאורך כל הסרטון

- **תגית עליונה:** "טיפ למוזיקאים" עם נקודה, ב־y=206, Heebo 700 בגודל 30. מתחתיה קו התקדמות בעובי 4 פיקסלים שמתמלא מימין לשמאל לאורך הסרטון. על הכתום התגית הופכת לצבע ink.
- **זוהר:** עיגול כתום רך מאחורי התוכן, שהשקיפות שלו עולה ויורדת לפי עוצמת הנגינה (`0.26 + 0.6 × energy`).
- **וינייטה:** הכהיה של עד 50% בשוליים.
- **גרעיניות פילם:** רעש אפור בקנבס 540×960 שמוגדל פי 2, במצב מיזוג overlay. שקיפות 0.12 על הרקע הכהה ו־0.065 על הכתום. מתחלף 30 פעמים בשנייה מתוך 5 תבניות.

### עקרונות תנועה

- **"נחיתה" (slam):** מילה מגיעה מהגדלה של פי 2.6 עד 3 ושקיפות 0, מאיצה פנימה (`power3.in`) ונוחתת בדיוק על הפעימה, נמעכת ל־0.955 וחוזרת ל־1 (`back.out(2.4)`). ברגע הנחיתה כל הבלוק רועד.
- **"עלייה" (rise):** מילים עולות מתוך מסכה, `yPercent` מ־118 ל־0, `expo.out` באורך 0.6 שניות, בהפרש של 0.055 שניות בין מילה למילה.
- **מיתר רוטט:** גל עומד עם שלושה אופנים, בעוצמה שנגזרת מהפריטות שבפסקול (`stringAmp`). מעל משרעת מסוימת מצוירת גם "מעטפת" שקופה בצורת כישור, כמו הטשטוש שרואים במיתר אמיתי.
- **הכול נגזר מהזמן `t` בלבד.** אין אנימציות CSS ואין שעון אמיתי, ולכן אפשר לקפוץ לכל פריים ולקבל אותה תמונה.

---

## 4. התסריט: כל הטקסטים מילה במילה

| זמן | טקסט על המסך | סגנון |
| --- | --- | --- |
| 0:00 | בועות תלונה: "אין לי זמן", "מאוחר מדי להתחיל", "אין לי ציוד", "אין לי כישרון", "הגיטרה שלי ישנה", "אין לי השראה", "אני לא מספיק טוב" | בועות אפורות קטנות, Heebo 500 בגודל 40 |
| 0:00.15 | **תפסיקו** | ענק, cream |
| 0:00.6 | **להתלונן.** | ענק, cream, נמחק בקו כתום ב־1.5 |
| 0:02.1 | **תתחילו** | ענק, ink על כתום |
| 0:02.4 | **לנגן!** | ענק, ink על כתום |
| 0:04.25 | הגיטרה הישנה / ששוכבת לכם בבית? | Poster, cream, שתי שורות |
| 0:06.9 | היא לא מקולקלת, / היא פשוט מחכה / שתכוונו אותה. | Poster, שורה ראשונה cream, שתי האחרונות amber |
| 0:09.6 | תווית: "שלב 1 מתוך 3". כותרת: **קודם כל, מכוונים.** | |
| 0:10.2 | בתוך הטיונר: "מיתר 6" / E / מי, ואז 5 / A / לה, 4 / D / רה, 3 / G / סול, 2 / B / סי, 1 / E / מי | |
| 0:16.0 | שתי דקות עם טיונר חינמי בטלפון, / **והיא נשמעת כמו חדשה.** | Heebo 500 בגודל 62, ואז Heebo 900 בגודל 76 ב־amber |
| 0:18.0 | תווית: "שלב 2 מתוך 3". כותרת: **ארבעה אקורדים.** תיבות: G, D, Em, C | |
| 0:22.8 | עם ארבעת האקורדים האלה / **כבר מנגנים אלפי שירים.** | |
| 0:24.0 | תווית: "שלב 3 מתוך 3". כותרת: **עשר דקות ביום.** שעון: 00:00 עד 10:00. מתחתיו: "דקות של נגינה". ימים: א׳ ב׳ ג׳ ד׳ ה׳ ו׳ ש׳ | |
| 0:26.4 | עשר דקות כל יום שוות יותר / **משעתיים פעם בשבוע.** | |
| 0:28.8 | תווית: "ועוד דבר אחד". תווית הקלטה: REC 00:00. **תקליטו** / **כל רעיון,** / גם כשהוא עוד לא מושלם. | השורה השלישית Heebo 800 בגודל 72, amber |
| 0:31.2 | ומה עם / **השראה?** | "ומה עם" ב־muted בגודל 150, "השראה?" ענק |
| 0:32.4 | היא לא מגיעה / למי שמחכה לה. | Frank Ruhl 900, cream |
| 0:33.6 | היא מגיעה / למי שכבר מנגן. | Frank Ruhl 900, amber, קו מצויר מתחת ל"מנגן." |
| 0:36.0 | **אז תפסיקו** / **להתלונן,** | ענק, cream, נמחק בקו כתום ב־36.6 |
| 0:37.2 | **ולכו** / **לנגן!** | ענק, ink על כתום |
| 0:38.6 | שלחו את זה למי שהגיטרה / שלו עדיין מעלה אבק | Heebo 800 בגודל 54, ink |

---

## 5. הסצנות בפירוט

### סצנה 1: הפתיחה (0.0 עד 4.2)

- שתי הבועות הראשונות כבר על המסך בפריים הראשון. חמש הנוספות קופצות פנימה ב־0.04, 0.3, 0.46, 0.84 ו־1.02 (scale מ־0.3 ל־1, `back.out(2.2)`). כל בועה מסובבת בזווית קטנה (בין ‎-5° ל־5°).
- "תפסיקו" נוחתת ב־0.15 ו"להתלונן." ב־0.6. כל שורה ברוחב 900.
- ב־1.5 קו כתום בעובי 30 נמתח על "להתלונן." תוך 0.2 שניות. מיד אחריו הטקסט מאפיר (`#6e6658`), הבועות נשאבות לכיוון המרכז ונעלמות, והבלוק מתכווץ ל־0.9.
- ב־2.08 עיגול כתום מתפשט ממרכז (540,900) עד רדיוס 1260 תוך 0.5 שניות (`expo.out`). "תתחילו" מופיעה איתו ו"לנגן!" נוחתת ב־2.4.
- מאחורי הטקסט שישה מיתרים אופקיים בצבע ink (שקיפות 0.42) ב־y = 380 + 212 × מספר המיתר, שרוטטים עם האקורד (משרעת עד 46 פיקסלים).
- מ־3.9 הפאנל הכתום מחליק למעלה ויוצא (`power4.inOut`, חצי שנייה).

### סצנה 2: הגיטרה הישנה (4.2 עד 9.6)

- גיטרה אקוסטית בקווים, מבט מלמעלה, שוכבת (מסובבת ב־‎-86°), כשחור התהודה שלה ב־(678,1090). היא "מצוירת" קו אחרי קו מ־4.35 במשך כשנייה. המיתרים בכתום, ובפינה שבין הצוואר לגוף יש קורי עכביש.
- סביבה מרחפים 30 גרגירי אבק. ב־5.7, עם הפריטה החמוצה, הגיטרה נרעדת ו־22 חלקיקי אבק עפים ממנה.
- ב־6.9 הטקסט הראשון שוקע והשני עולה, שורה אחרי שורה (6.9, 7.45, 7.65).
- מ־8.75 עד 9.7 "המצלמה" מתקרבת אל חור התהודה: הגיטרה מתיישרת (סיבוב ל־0), גדלה פי 6.25 והחור זז ל־(540,930), `expo.inOut`. עובי הקווים נשאר קבוע בזמן ההגדלה. העיגול של החור הופך לטבעת של הטיונר.

### סצנה 3: מכוונים (9.6 עד 18.0)

- **הטיונר:** טבעת ברדיוס 300 סביב (540,930) עם מילוי כהה. בפנים שנתות כל 7° מ־‎-70° עד ‎+70° (100 סנט = 70°), ומעליה משולש יעד. מחוון כתום (קו ונקודה) נע על הטבעת, וקשת כתומה נמתחת ממנו אל הראש. במרכז: "מיתר N", האות הלועזית בגודל 330, והשם העברי.
- **המיתרים:** שישה קווים אנכיים ב־x = 165 + 150 × i. מיתר שלא טופל אפור־שקוף, המיתר הפעיל כתום ורוטט בצורה לא יציבה, ומיתר מכוון מנטה.
- **התגיות:** שש תגיות (128×148) ב־y=1322, כל אחת יושבת על המיתר שלה, עם אות לועזית ושם עברי.
- **הסדר:** מיתר 6 מתחיל ב־10.2 וננעל אחרי 0.84 שניות. החמישה הבאים מתחילים ב־11.4, 12.3, 13.2, 14.1 ו־15.0 וננעלים אחרי 0.58 שניות. נקודת ההתחלה של כל מיתר בסנטים: ‎-92, ‎-58, ‎+54, ‎-74, ‎+46, ‎-86.
- **נעילה:** האות והמחוון הופכים למנטה, טבעת פעימה מתרחבת, והתגית מתמלאת במנטה עם טקסט כהה.
- ב־15.9 הכול מכוון: סימן וי גדול במנטה נמתח במרכז, הטבעת הופכת למנטה, והכותרת מתחלפת למשפט. כל המיתרים רוטטים עם האקורדים C ואז D.

### סצנה 4: ארבעה אקורדים (18.0 עד 24.0)

- כניסה בחיתוך חד עם הבזק קצר (שקיפות 0.24).
- שורת תיבות G, D, Em, C (כל אחת 200×168) ב־y=600. התיבה של האקורד המתנגן מתמלאת בכתום.
- דיאגרמת אקורד: שישה מיתרים ב־x = 290 + 100 × i, אום ב־y=880, ארבעה סריגים במרווח 132. שלוש נקודות כתומות ברדיוס 43 נודדות בין האקורדים:
  - G: מיתר 6 סריג 3, מיתר 5 סריג 2, מיתר 1 סריג 3
  - D: מיתר 3 סריג 2, מיתר 2 סריג 3, מיתר 1 סריג 2
  - Em: מיתר 5 סריג 2, מיתר 4 סריג 2 (הנקודה השלישית נעלמת)
  - C: מיתר 5 סריג 3, מיתר 4 סריג 2, מיתר 2 סריג 1
- מעל האום: עיגול למיתר פתוח, איקס למיתר שלא מנוגן. המיתרים בדיאגרמה מתנדנדים עם כל פריטה.
- האקורד מתחלף ב־18.0, 19.2, 20.4 ו־21.6. ב־22.8 חוזרים ל־G, כל ארבע התיבות נדלקות והכותרת מתחלפת למשפט.

### סצנה 5: עשר דקות ביום (24.0 עד 28.8)

- כניסה במסך כתום שחוצה את הפריים מלמטה למעלה.
- טיימר: טבעת ברדיוס 280 סביב (540,930), עובי 22, עם 60 שנתות מסביב. הקשת הכתומה מתמלאת מ־24.3 עד 26.05 והספרות רצות מ־00:00 עד 10:00. בסיום: פעימה, והספרות הופכות לכתומות.
- שורת שבעה עיגולים (97 פיקסלים) ב־y=1356. מ־26.4 הם מתמלאים בכתום אחד אחרי השני, כל 0.15 שניות, מימין (א׳) לשמאל (ש׳). באותו רגע הכותרת מתחלפת למשפט.

### סצנה 6: תקליטו (28.8 עד 31.2)

- כניסה במסך כתום שחוצה את הפריים לרוחב.
- למעלה משמאל תווית הקלטה עם נקודה אדומה מהבהבת ושעון שסופר שניות.
- "תקליטו" נוחתת ב־29.02 ו"כל רעיון," ב־29.4, שתיהן באותו גודל. השורה השלישית עולה ב־30.0.
- גל קול: 42 עמודות (רוחב 12, מרווח 22) סביב y=1300. העמודות קבועות במקומן, וראש הקלטה נע מימין לשמאל מ־28.9 עד 31.05. כל עמודה "צומחת" כשהראש עובר אותה, והגובה שלה נגזר מעוצמת המוזיקה באותו רגע.

### סצנה 7: השראה (31.2 עד 36.0)

- ב־31.2 המוזיקה נעצרת לאקורד אחד. "ומה עם" עולה, והאותיות של "השראה?" קופצות אחת אחת.
- ב־32.4 הגרוב חוזר, השאלה עפה למעלה, והמשפט הראשון של הציטוט נכנס. ב־33.6 נכנס המשפט השני בכתום והראשון מתעמעם ל־40%. ב־34.22 קו מצויר ביד נמתח מתחת ל"מנגן.".
- למטה שישה מיתרים כתומים דקים ב־y = 1330 + 54 × מספר המיתר, שרוטטים עם המוזיקה.

### סצנה 8: הסיום (36.0 עד 41.4)

- חזרה מכוונת על הפתיחה: "אז תפסיקו" ו"להתלונן," נוחתות, קו כתום מוחק ב־36.6, ועיגול כתום מתפשט ב־37.18.
- "ולכו" מופיעה עם הפיצוץ ו"לנגן!" נוחתת ב־37.5. שורת השיתוף עולה ב־38.6 ונשארת עד הסוף, בזמן שהאקורד האחרון דועך.

---

## 6. הפסקול

הכול מסונתז בקוד (`tools/audio.mjs`), בלי דגימות ובלי קבצים חיצוניים.

- **קצב:** 100 פעימות לדקה. שמינית = 0.3 שניות, אקורד מתחלף כל 1.2 שניות.
- **מהלך האקורדים:** G, D, Em, C (I, V, vi, IV בסול מז'ור), 16 אקורדים מ־18.0 עד 37.2.
- **הגיטרה:** סינתזת Karplus-Strong מורחבת. כל תו הוא קו השהיה עם מסנן בלולאה. העירור הוא פרץ רעש באורך מחזור אחד שעובר שני מסננים מעבירי־נמוכים ו"מיקום מפרט". כשאקורד מתחלף, המיתר הקודם נעצר תוך כ־30 אלפיות שנייה. אחרי הסינתזה: מסנן high-pass ב־70Hz, שיאי תהודה ב־105, 215 ו־420Hz, מדף גבוה ב־4.5kHz ומסנן low-pass ב־8kHz.
- **דפוס הפריטה לכל אקורד:** למטה חזק (0), למעלה חלש (0.3, רק באקורדים זוגיים), למטה (0.6), למעלה (0.9).
- **תופים:** בס־תוף על הפעימה הראשונה, מחיאת כף על השנייה, שייקר על כל שמינית.
- **בס:** טון היסוד של האקורד עם ארבע הרמוניות.

### מה שומעים, לפי הסדר

| זמן | צליל |
| --- | --- |
| 0.0 עד 2.1 | זמזום צורם שמתגבר (שני צלילים במרחק חצי טון: 110 ו־116.54Hz ואוקטבות שלהם). פופים יורדים לכל בועה, מכה עמומה על כל מילה (0.15, 0.6), שריקה על קו המחיקה (1.5), וריסר שעולה (1.25) |
| 2.1, 2.4 | הזמזום נקטע. אקורד G מלא, פעמיים, עם בום ובס־תוף |
| 5.7 | פריטה איטית ועמומה על מיתרים פתוחים לא מכוונים |
| 8.75 | וווש עולה, בזמן הזום |
| 10.2 עד 15.9 | כל מיתר נפרט שלוש פעמים ומחליק אל הצליל הנכון. ברגע הנעילה צלצול קטן באותו תו |
| 15.9 עד 17.7 | Cadd9, ואז D ארבע פעמים בהתגברות, שמוביל אל G |
| 18.0 עד 31.2 | הגרוב המלא |
| 26.05, 26.4 ואילך | בליפ כשהטיימר מגיע ל־10:00, ושבעה בליפים בסולם עולה כשהימים מתמלאים |
| 28.8 | צפצוף הקלטה כפול |
| 31.2 | עצירה: אקורד C אחד שמצלצל, בלי תופים |
| 32.4 עד 36.0 | הגרוב חוזר |
| 36.0 | עצירה שנייה: C אחד עם בס־תוף |
| 37.2, 37.5 | G אחרון, פעמיים, עם בום. מצלצל ודועך עד הסוף |

**מאסטר:** ריוורב (Freeverb), רוויה עדינה, לימיטר עם מבט קדימה של 5 אלפיות שנייה ותקרה של ‎-1.5dBFS, ודעיכה ב־1.4 השניות האחרונות.

**הרעיון שמאחורי הסאונד:** רעש צורם ולא מכוון בהתחלה, שנקטע ברגע שמתחילים לנגן. המוזיקה עצמה נכנסת רק אחרי שהגיטרה מכוונת.

---

## 7. מלכודות שכבר נפתרו (חשוב למי שמשנה משהו)

1. **`fromTo` של GSAP מרנדר את מצב ההתחלה מיד.** לכן אנימציות שחוזרות על אלמנט שכבר על המסך (הבזק, פעימה, קפיצה) עוברות דרך הפונקציה `hit`, שמגדירה `immediateRender: false`.
2. **אין להגדיר `transform` ב־CSS על אלמנט ש־GSAP מזיז באחוזים.** GSAP קורא את ה־transform כפיקסלים ומוסיף את האחוזים מעליו.
3. **`tl.set` בזמן 0 לא מתרנדר כשהראש בדיוק על 0.** לכן `seek` לא יורד מתחת ל־0.0005.
4. **מדידת רוחב שורה:** `fit` חייבת `width: max-content`, אחרת נמדד רוחב הקונטיינר ולא רוחב הטקסט.
5. **אסור לגלול תבנית מחזורית בחצי מחזור לפריים.** גרסה מוקדמת של גל הקול גללה כך והבהבה. לכן העמודות קבועות וראש ההקלטה הוא שנע.
6. **גרעיניות מייקרת את הקידוד מאוד.** היא מתחלפת 30 פעם בשנייה ולא 60, והיא חלשה יותר על הכתום.
7. **אסור לייצר מחדש את `out/soundtrack.wav` בזמן שרינדור רץ.** ffmpeg קורא אותו תוך כדי.
8. **הקוד לא מכיל תווים נסתרים** (סימני כיווניות, רווח קשיח), כדי שהעתקה לא תשבור אותו.

---

## 8. בדיקות קבלה

אחרי הרינדור, הרץ ודווח:

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames,pix_fmt -of default=nw=1 tip-video.mp4
md5sum out/soundtrack.wav
ffmpeg -hide_banner -nostats -i tip-video.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12
```

| בדיקה | תוצאה צפויה |
| --- | --- |
| וידאו | h264, 1080×1920, 60/1, 2484 פריימים, yuv420p |
| אורך | 41.400000 |
| md5 של `out/soundtrack.wav` | `4134860bf1ed4f603cf88379de435b18` |
| עוצמה | ‎-12.4 LUFS (סטייה של עד 0.3) |
| שיא אמיתי | ‎-1.0dBFS או פחות |
| סנכרון | העיגול הכתום מופיע לראשונה בפריים 125 (2.083 שניות), והאקורד מתחיל ב־2.100. אותו דבר ב־37.183 וב־37.200 |
| פריימים כפולים | אין |

בדיקה חזותית: השווה את הפריים ב־1.3 שניות לתמונת השער `cover.jpg`, ואת הפריימים ב־1.3, 3.2, 8.0, 12.6, 20.0, 26.5, 30.6, 31.9, 34.6 ו־40.0 ללוח הסצנות, אם צורפו.

אם ה־md5 של הפסקול שונה, אחד מקובצי המקור לא הועתק במדויק (בדרך כלל `src/timing.js` או `tools/audio.mjs`).

---

## 9. סרטון חדש באותה תבנית

כדי להפיק טיפ אחר באותה רמה ובאותו סגנון, משנים רק את אלה:

- **הטקסטים:** ב־`src/index.html`. שורות הענק מתאימות את עצמן לרוחב.
- **התזמון והמוזיקה:** ב־`src/timing.js` (האובייקט `SC`, רשימות `STRUMS`, `DRUMS`, `SFX`). אחרי שינוי מריצים שוב `node tools/audio.mjs`.
- **התוכן של כל סצנה:** בפונקציה `build` ב־`src/main.js`, שמחולקת לשמונה חלקים מסומנים.

מה לא משנים: הצבעים, הפונטים, כללי התנועה מסעיף 3, המבנה (הוק, בעיה, שלושה שלבים, משפט מפתח, חזרה אל ההוק) והכלל שכל אירוע חזותי יושב על אירוע בפסקול.

---

## 10. קוד המקור המלא

כל קובץ מופיע כאן כפי שהוא. הנתיבים יחסיים לתיקייה `video-tip`. כל קובץ מסתיים בירידת שורה אחת, והקידוד הוא UTF-8 בלי BOM.

| קובץ | md5 | בתים |
| --- | --- | --- |
| `package.json` | `147e40dafa03a0335f7ad85eb9d44bd0` | 456 |
| `.gitignore` | `646fed0aa028d0a8054bbe13f232e04a` | 19 |
| `src/timing.js` | `bd10ccd3dfb93a813f70a6b0f7340785` | 10183 |
| `src/guitar.js` | `52289d536779e2f58e7a3b553b2bf19b` | 4800 |
| `src/index.html` | `be936f447ef1f3a5a3968aced3173cbf` | 7898 |
| `src/style.css` | `81879d4a7f989788284710b960931d85` | 12255 |
| `src/main.js` | `69284ae4247d1df626dcaa719dd8231c` | 43140 |
| `tools/serve.cjs` | `275f4fc990e983364a553872543f32c7` | 2047 |
| `tools/audio.mjs` | `b68ebbbaeba8118f66c14790376dd853` | 21648 |
| `tools/render.cjs` | `73ea1e14f840745739a626eb05fff10b` | 4479 |
| `tools/still.cjs` | `f856540ee6679d038a693440819bdad9` | 2268 |

### `package.json`

md5: `147e40dafa03a0335f7ad85eb9d44bd0`

````json
{
  "name": "video-tip",
  "private": true,
  "type": "module",
  "description": "סרטון טיפ למוזיקאים שנבנה כולו בקוד: אנימציה (HTML + GSAP) ופסקול מסונתז",
  "scripts": {
    "audio": "node tools/audio.mjs",
    "preview": "node tools/audio.mjs && node tools/serve.cjs",
    "render": "node tools/audio.mjs && node tools/render.cjs --crf=17 --out=tip-video.mp4",
    "stills": "node tools/still.cjs"
  }
}
````

### `.gitignore`

md5: `646fed0aa028d0a8054bbe13f232e04a`

````text
out/
node_modules/
````

### `src/timing.js`

md5: `bd10ccd3dfb93a813f70a6b0f7340785`

````js
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
// סריג לכל מיתר (-1 = המיתר לא מנוגן)
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
````

### `src/guitar.js`

md5: `52289d536779e2f58e7a3b553b2bf19b`

````js
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
````

### `src/index.html`

md5: `be936f447ef1f3a5a3968aced3173cbf`

````html
<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>תפסיקו להתלונן. תתחילו לנגן!</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="fitbox">
      <div id="stage">
        <div id="bg"><div id="glow"></div></div>

        <!-- 1 · הפתיחה -->
        <section class="scene" id="s1">
          <div class="bubbles" id="bubbles"></div>
          <div class="poster" id="s1-dark">
            <div class="big" id="h1">תפסיקו</div>
            <div class="big" id="h2">להתלונן.</div>
            <svg class="strike" id="strike1" viewBox="0 0 1080 300" preserveAspectRatio="none">
              <path d="M40 190 C 300 150, 720 170, 1040 96" pathLength="1" />
            </svg>
          </div>
          <div class="amber" id="amber1">
            <canvas class="strings" id="strings1" width="1080" height="1920"></canvas>
            <div class="poster">
              <div class="big ink" id="h3">תתחילו</div>
              <div class="big ink" id="h4">לנגן!</div>
            </div>
          </div>
        </section>

        <!-- 2 · הגיטרה הישנה -->
        <section class="scene" id="s2">
          <div class="msg" id="s2a">
            <div class="display" id="s2a1">הגיטרה הישנה</div>
            <div class="display" id="s2a2">ששוכבת לכם בבית?</div>
          </div>
          <div class="msg" id="s2b">
            <div class="display" id="s2b1">היא לא מקולקלת,</div>
            <div class="display amber-text" id="s2b2">היא פשוט מחכה</div>
            <div class="display amber-text" id="s2b3">שתכוונו אותה.</div>
          </div>
          <svg class="full" id="guitar-svg" viewBox="0 0 1080 1920"></svg>
        </section>

        <!-- 3 · מכוונים -->
        <section class="scene" id="s3">
          <canvas class="strings" id="strings3" width="1080" height="1920"></canvas>
          <div class="head" id="s3h">
            <div class="step"><b>שלב 1</b> מתוך 3</div>
            <div class="display title" id="s3t">קודם כל, מכוונים.</div>
          </div>
          <div class="head alt" id="s3alt">
            <div class="sentence" id="s3s1">שתי דקות עם טיונר חינמי בטלפון,</div>
            <div class="sentence strong" id="s3s2">והיא נשמעת כמו חדשה.</div>
          </div>
          <svg class="full" id="tuner" viewBox="0 0 1080 1920"></svg>
          <div id="note">
            <div class="note-num" id="note-num">מיתר 6</div>
            <div class="note-letter" id="note-letter" dir="ltr">E</div>
            <div class="note-heb" id="note-heb">מי</div>
          </div>
          <div class="chips" id="chips" dir="ltr"></div>
        </section>

        <!-- 4 · ארבעה אקורדים -->
        <section class="scene" id="s4">
          <div class="head" id="s4h">
            <div class="step"><b>שלב 2</b> מתוך 3</div>
            <div class="display title" id="s4t">ארבעה אקורדים.</div>
          </div>
          <div class="head alt" id="s4alt">
            <div class="sentence" id="s4s1">עם ארבעת האקורדים האלה</div>
            <div class="sentence strong" id="s4s2">כבר מנגנים אלפי שירים.</div>
          </div>
          <div class="chordrow" id="chordrow" dir="ltr"></div>
          <svg class="full" id="diagram" viewBox="0 0 1080 1920"></svg>
        </section>

        <!-- 5 · עשר דקות ביום -->
        <section class="scene" id="s5">
          <div class="head" id="s5h">
            <div class="step"><b>שלב 3</b> מתוך 3</div>
            <div class="display title" id="s5t">עשר דקות ביום.</div>
          </div>
          <div class="head alt" id="s5alt">
            <div class="sentence" id="s5s1">עשר דקות כל יום שוות יותר</div>
            <div class="sentence strong" id="s5s2">משעתיים פעם בשבוע.</div>
          </div>
          <svg class="full" id="timer" viewBox="0 0 1080 1920"></svg>
          <div id="clock" dir="ltr"><span class="dg">0</span><span class="dg">0</span><i>:</i><span class="dg">0</span><span class="dg">0</span></div>
          <div id="clock-sub">דקות של נגינה</div>
          <div class="week" id="week"></div>
        </section>

        <!-- 6 · תקליטו -->
        <section class="scene" id="s6">
          <div class="head" id="s6h">
            <div class="step"><b>ועוד דבר</b> אחד</div>
          </div>
          <div class="recpill" id="recpill" dir="ltr"><span class="dot" id="recdot"></span><span>REC</span><span id="rectime">00:00</span></div>
          <div class="poster top" id="s6p">
            <div class="big" id="r1">תקליטו</div>
            <div class="big" id="r2">כל רעיון,</div>
          </div>
          <div class="sentence center amber-text" id="r3">גם כשהוא עוד לא מושלם.</div>
          <canvas class="strings" id="wave" width="1080" height="1920"></canvas>
        </section>

        <!-- 7 · השראה -->
        <section class="scene" id="s7">
          <canvas class="strings" id="strings7" width="1080" height="1920"></canvas>
          <div class="question" id="q">
            <div class="display" id="q1">ומה עם</div>
            <div class="big" id="q2">השראה?</div>
          </div>
          <div class="quote" id="quote">
            <div class="qa" id="qa">
              <div class="serif" id="qa1">היא לא מגיעה</div>
              <div class="serif" id="qa2">למי שמחכה לה.</div>
            </div>
            <div class="qb" id="qb">
              <div class="serif" id="qb1">היא מגיעה</div>
              <div class="serif" id="qb2">למי שכבר <span id="qb-hl">מנגן.<svg id="qb-line" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M392 16 C 280 34, 120 6, 8 24" pathLength="1" /></svg></span></div>
            </div>
          </div>
        </section>

        <!-- 8 · הסיום -->
        <section class="scene" id="s8">
          <div class="poster" id="s8-dark">
            <div class="big" id="c1">אז תפסיקו</div>
            <div class="big" id="c2">להתלונן,</div>
            <svg class="strike" id="strike2" viewBox="0 0 1080 300" preserveAspectRatio="none">
              <path d="M40 190 C 300 150, 720 170, 1040 96" pathLength="1" />
            </svg>
          </div>
          <div class="amber" id="amber2">
            <canvas class="strings" id="strings8" width="1080" height="1920"></canvas>
            <div class="poster">
              <div class="big ink" id="c3">ולכו</div>
              <div class="big ink" id="c4">לנגן!</div>
            </div>
            <div class="share" id="share">
              <div class="share-line">שלחו את זה למי שהגיטרה</div>
              <div class="share-line">שלו עדיין מעלה אבק</div>
            </div>
          </div>
        </section>

        <div id="wipe"></div>
        <div id="flash"></div>

        <div id="chrome">
          <div class="tag"><i></i>טיפ למוזיקאים</div>
          <div class="bar"><div id="bar-fill"></div></div>
        </div>

        <div id="vignette"></div>
        <canvas id="grain" width="540" height="960"></canvas>
      </div>
    </div>

    <div id="ui">
      <button id="play">▶ נגן</button>
      <input id="scrub" type="range" min="0" max="1000" value="0" />
      <span id="tc">0.00</span>
    </div>
    <audio id="audio" src="../out/soundtrack.wav" preload="auto"></audio>

    <script src="../vendor/gsap.min.js"></script>
    <script type="module" src="main.js"></script>
  </body>
</html>
````

### `src/style.css`

md5: `81879d4a7f989788284710b960931d85`

````css
@font-face {
  font-family: 'Poster';
  src: url('../vendor/fonts/noto-sans-hebrew-hebrew-standard-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-stretch: 62.5% 100%;
  unicode-range: U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F;
}
@font-face {
  font-family: 'Poster';
  src: url('../vendor/fonts/noto-sans-hebrew-latin-standard-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-stretch: 62.5% 100%;
  unicode-range: U+0000-00FF, U+2000-206F;
}
@font-face {
  font-family: 'Text';
  src: url('../vendor/fonts/heebo-hebrew-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  unicode-range: U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F;
}
@font-face {
  font-family: 'Text';
  src: url('../vendor/fonts/heebo-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  unicode-range: U+0000-00FF, U+2000-206F;
}
@font-face {
  font-family: 'Quote';
  src: url('../vendor/fonts/frank-ruhl-libre-hebrew-900-normal.woff2') format('woff2');
  font-weight: 900;
}
@font-face {
  font-family: 'Quote';
  src: url('../vendor/fonts/frank-ruhl-libre-hebrew-500-normal.woff2') format('woff2');
  font-weight: 500;
}

:root {
  --ink: #0c0a08;
  --ink2: #16120e;
  --cream: #f6ecd9;
  --muted: #8f8573;
  --line: rgba(246, 236, 217, 0.16);
  --amber: #ffa32b;
  --amber2: #ff6a1a;
  --mint: #8dffc0;
  --red: #ff4a3d;
  --chrome: var(--cream);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  background: #000;
  overflow: hidden;
}
#fitbox {
  position: fixed;
  inset: 0;
}
/* בתצוגה מקדימה הבמה ממורכזת ומוקטנת לגודל החלון (main.js קובע את ה-scale) */
#stage {
  position: absolute;
  left: 50%;
  top: calc(50% - 24px);
  margin: -960px 0 0 -540px;
  width: 1080px;
  height: 1920px;
  overflow: hidden;
  background: var(--ink);
  color: var(--cream);
  font-family: 'Text', sans-serif;
  transform-origin: 50% 50%;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}
body.render #stage {
  left: 0;
  top: 0;
  margin: 0;
}
body.render #ui {
  display: none;
}

/* ---------- רקע ---------- */
#bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 50% 40%, #1d150e 0%, #110d0a 48%, #080605 100%);
}
#glow {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 1500px;
  height: 1500px;
  margin: -750px 0 0 -750px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 140, 40, 0.34) 0%, rgba(255, 110, 30, 0.12) 36%, rgba(255, 110, 30, 0) 68%);
  opacity: 0.3;
}
#vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(115% 85% at 50% 48%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.5) 100%);
}
#grain {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.12;
}

/* ---------- סצנות ---------- */
.scene {
  position: absolute;
  inset: 0;
  visibility: hidden;
  opacity: 0;
}
.full,
.strings {
  position: absolute;
  inset: 0;
  width: 1080px;
  height: 1920px;
}
svg {
  overflow: visible;
}

/* טיפוגרפיה */
.display,
.big {
  font-family: 'Poster', sans-serif;
  font-weight: 900;
  font-stretch: 62.5%;
  line-height: 0.96;
  white-space: nowrap;
}
.big {
  line-height: 0.9;
  width: max-content;
}
.ink {
  color: var(--ink);
}
.amber-text {
  color: var(--amber);
}
.serif {
  font-family: 'Quote', serif;
  font-weight: 900;
  white-space: nowrap;
  line-height: 1.12;
}
.sentence {
  font-family: 'Text', sans-serif;
  font-weight: 500;
  font-size: 62px;
  line-height: 1.22;
  white-space: nowrap;
  color: var(--cream);
}
.sentence.strong {
  font-weight: 900;
  font-size: 76px;
  color: var(--amber);
}
.sentence.center {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

/* מילים שעולות מתוך מסכה */
.w {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0.14em 0.04em 0.2em;
  margin: -0.14em -0.04em -0.2em;
}
.wi {
  display: inline-block;
  will-change: transform;
}
.ch {
  display: inline-block;
  will-change: transform;
}

/* פוסטר: שורות ענק ממורכזות */
.poster {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1780px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.poster.top {
  justify-content: flex-start;
  height: auto;
  top: 470px;
}
.strike {
  position: absolute;
  left: 0;
  width: 1080px;
  height: 300px;
}
.strike path {
  fill: none;
  stroke: var(--amber);
  stroke-width: 30;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

/* הפאנל הכתום */
.amber {
  position: absolute;
  inset: 0;
  background: radial-gradient(130% 90% at 50% 40%, #ffbe45 0%, #ff9a26 46%, #f7640f 100%);
  clip-path: circle(0px at 540px 900px);
}

/* בועות התלונה */
.bubble {
  position: absolute;
  font-size: 40px;
  font-weight: 500;
  color: #b9ae99;
  padding: 18px 30px 20px;
  border-radius: 34px;
  background: #1f1a15;
  border: 2px solid #3a332b;
  white-space: nowrap;
  opacity: 0;
}
/* הזנב של הבועה: ריבוע מסובב שרק חציו התחתון נראה */
.bubble::after {
  content: '';
  position: absolute;
  bottom: -13px;
  width: 24px;
  height: 24px;
  background: #1f1a15;
  border-right: 2px solid #3a332b;
  border-bottom: 2px solid #3a332b;
  transform: rotate(45deg);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  right: 44px;
}
.bubble.l::after {
  right: auto;
  left: 44px;
}

/* כותרות שלבים */
.head {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 318px;
  text-align: right;
}
.head.alt {
  top: 330px;
}
.step {
  display: inline-block;
  font-size: 34px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  padding: 10px 26px 12px;
  border: 2px solid var(--line);
  border-radius: 999px;
  margin-bottom: 26px;
}
.step b {
  color: var(--amber);
  font-weight: 800;
}
.title {
  font-size: 176px;
}

/* הודעות בסצנת הגיטרה */
.msg {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 330px;
  text-align: right;
}
.msg .display {
  width: max-content;
  margin-inline-start: 0;
}

/* טיונר */
#note {
  position: absolute;
  left: 240px;
  top: 630px;
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.note-num {
  font-size: 36px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: -6px;
}
.note-letter {
  font-family: 'Poster';
  font-weight: 900;
  font-stretch: 78%;
  font-size: 330px;
  line-height: 0.92;
}
.note-heb {
  font-size: 76px;
  font-weight: 800;
  line-height: 1;
  margin-top: -8px;
}
.chips {
  position: absolute;
  left: 0;
  top: 1322px;
  width: 1080px;
  height: 150px;
}
.chip {
  position: absolute;
  top: 0;
  width: 128px;
  height: 148px;
  margin-left: -64px;
  border-radius: 26px;
  border: 2px solid var(--line);
  background: #15110d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}
.chip b {
  font-family: 'Poster';
  font-weight: 900;
  font-stretch: 80%;
  font-size: 72px;
  line-height: 0.95;
}
.chip span {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
}

/* אקורדים */
.chordrow {
  position: absolute;
  left: 101px;
  top: 600px;
  width: 878px;
  display: flex;
  gap: 26px;
}
.cc {
  width: 200px;
  height: 168px;
  border-radius: 34px;
  border: 2px solid var(--line);
  display: grid;
  place-items: center;
  font-family: 'Poster';
  font-weight: 900;
  font-stretch: 78%;
  font-size: 118px;
  line-height: 1;
  color: var(--muted);
  position: relative;
  overflow: hidden;
}
.cc i {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #ffbe45, #ff7a1a);
  opacity: 0;
}
.cc span {
  position: relative;
  padding-bottom: 8px;
}

/* טיימר */
#clock {
  position: absolute;
  left: 0;
  width: 1080px;
  top: 806px;
  text-align: center;
  font-family: 'Poster';
  font-weight: 900;
  font-stretch: 70%;
  font-size: 212px;
  line-height: 1;
  white-space: nowrap;
}
#clock .dg {
  display: inline-block;
  width: 0.5em;
  text-align: center;
}
#clock i {
  font-style: normal;
  display: inline-block;
  width: 50px;
  position: relative;
  top: -18px;
}
#clock-sub {
  position: absolute;
  left: 0;
  width: 1080px;
  top: 1034px;
  text-align: center;
  font-size: 38px;
  font-weight: 600;
  color: var(--muted);
}
.week {
  position: absolute;
  left: 107px;
  top: 1356px;
  width: 866px;
  display: flex;
  gap: 31px;
}
.day {
  width: 97px;
  height: 97px;
  border-radius: 50%;
  border: 2px solid var(--line);
  display: grid;
  place-items: center;
  font-size: 44px;
  font-weight: 800;
  color: var(--muted);
  position: relative;
}
.day i {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(160deg, #ffbe45, #ff7a1a);
  transform: scale(0);
}
.day span {
  position: relative;
}

/* הקלטה */
.recpill {
  position: absolute;
  top: 322px;
  left: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 10px 26px 12px 22px;
  border-radius: 999px;
  border: 2px solid rgba(255, 74, 61, 0.5);
  color: var(--cream);
  font-variant-numeric: tabular-nums;
}
.recpill .dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 22px rgba(255, 74, 61, 0.9);
}
#r3 {
  top: 1010px;
  font-weight: 800;
  font-size: 72px;
}

/* השראה */
.question {
  position: absolute;
  left: 0;
  width: 1080px;
  top: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: 50% 50%;
}
#q1 {
  font-size: 150px;
  color: var(--muted);
  margin-bottom: 10px;
}
.quote {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 560px;
  text-align: right;
}
.qa .serif {
  font-size: 122px;
  color: var(--cream);
}
.qb {
  margin-top: 70px;
  position: relative;
}
.qb .serif {
  font-size: 138px;
  color: var(--amber);
}
#qb-hl {
  position: relative;
  display: inline-block;
}
#qb-line {
  position: absolute;
  height: 40px;
  left: -3%;
  width: 106%;
  bottom: -0.14em;
}
#qb-line path {
  fill: none;
  stroke: var(--amber);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
}

/* הסיום */
.share {
  position: absolute;
  left: 0;
  width: 1080px;
  top: 1330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--ink);
}
.share-line {
  font-size: 54px;
  font-weight: 800;
  line-height: 1.22;
  text-align: center;
  white-space: nowrap;
}

/* מעברים */
#wipe {
  position: absolute;
  inset: 0;
  background: linear-gradient(170deg, #ffbe45, #ff7a1a 70%, #f2540f);
  visibility: hidden;
}
#flash {
  position: absolute;
  inset: 0;
  background: #ffd9a0;
  opacity: 0;
  pointer-events: none;
}

/* מסגרת קבועה */
#chrome {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 206px;
  color: var(--chrome);
}
#chrome .tag {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0.86;
}
#chrome .tag i {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: currentColor;
}
#chrome .bar {
  margin-top: 20px;
  height: 4px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 18%, transparent);
  overflow: hidden;
}
#bar-fill {
  height: 100%;
  width: 100%;
  background: currentColor;
  transform-origin: 100% 50%;
  transform: scaleX(0);
}

/* בקרי תצוגה מקדימה */
#ui {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font: 14px system-ui, sans-serif;
  direction: ltr;
}
#ui button {
  font: inherit;
  padding: 6px 14px;
  border-radius: 8px;
  border: 0;
  background: #ffa32b;
  color: #111;
  font-weight: 700;
  cursor: pointer;
}
#ui input {
  flex: 1;
}
````

### `src/main.js`

md5: `69284ae4247d1df626dcaa719dd8231c`

````js
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
    s.textContent = c === ' ' ? '\u00a0' : c;
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
````

### `tools/serve.cjs`

md5: `275f4fc990e983364a553872543f32c7`

````js
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
````

### `tools/audio.mjs`

md5: `b68ebbbaeba8118f66c14790376dd853`

````js
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
````

### `tools/render.cjs`

md5: `73ea1e14f840745739a626eb05fff10b`

````js
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
````

### `tools/still.cjs`

md5: `f856540ee6679d038a693440819bdad9`

````js
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
````
