#!/usr/bin/env python3
"""Builds a printable PDF pack of the course's document templates.

The course tells the producer to print a Split Sheet, sign it and keep a
copy — and the HTML course has no way to print. Artifacts cannot print at
all (window.print() is inert in the viewer), so the pack is a real file.

    python3 make-pdf.py            # -> dist/אמנות-המקצוע-תבניות.pdf

Path: src/templates.js -> node (JSON) -> RTL HTML -> headless Chrome -> PDF.
Chrome is the only renderer whose bidi engine gets mixed Hebrew/English/
number runs right without hand-ordering the text.
"""
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
OUT = DIST / "אמנות-המקצוע-תבניות.pdf"

CHROME_CANDIDATES = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "google-chrome", "chromium", "chromium-browser",
]

# FreeMono is the one installed monospace face covering both Hebrew and the
# box-drawing characters the templates use for rules; without it the separators
# render as tofu and the aligned colons drift.
BODY_FONT = '"DejaVu Sans", "Liberation Sans", sans-serif'
MONO_FONT = '"FreeMono", "Liberation Mono", monospace'


def find_chrome() -> str:
    for c in CHROME_CANDIDATES:
        p = shutil.which(c) if "/" not in c else (c if pathlib.Path(c).exists() else None)
        if p:
            return p
    sys.exit("no Chrome/Chromium found; install one or add it to CHROME_CANDIDATES")


def load_templates() -> list:
    """Evaluate src/templates.js in node and hand back the array as JSON."""
    js = (
        f"const fs=require('fs');"
        f"const src=fs.readFileSync({json.dumps(str(SRC / 'templates.js'))},'utf8');"
        f"const TEMPLATES=eval(src+';TEMPLATES');"
        f"process.stdout.write(JSON.stringify(TEMPLATES));"
    )
    r = subprocess.run(["node", "-e", js], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"could not read templates.js:\n{r.stderr}")
    return json.loads(r.stdout)


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_html(templates: list, pages_of: dict | None = None) -> str:
    """pages_of maps template id -> 1-based PDF page. Absent on the first
    pass, because the page numbers are only knowable once it is rendered."""
    groups = []
    for t in templates:
        if not groups or groups[-1][0] != t["group"]:
            groups.append((t["group"], []))
        groups[-1][1].append(t)

    def toc_row(t):
        pg = (pages_of or {}).get(t["id"])
        num = f'<span class="toc-pg">{pg}</span>' if pg else '<span class="toc-pg">&nbsp;</span>'
        return (f'<li class="toc-i"><span class="toc-t">{esc(t["title"])}</span>'
                f'<span class="toc-ch">פרק {t["ch"]}</span>{num}</li>')

    toc = "".join(
        f'<li class="toc-g">{esc(g)}</li>' + "".join(toc_row(t) for t in items)
        for g, items in groups
    )

    pages = []
    for g, items in groups:
        for t in items:
            warn = (
                '<div class="warn">דורש עורך דין — זהו שלד לפגישה, לא חוזה. '
                "אין להשתמש בו כהסכם בלי בדיקה של עורך דין המתמחה בדיני בידור ומוזיקה.</div>"
                if t.get("legal")
                else ""
            )
            pages.append(
                f'<section class="tmpl">'
                f'<div class="t-group">{esc(g)}</div>'
                f'<h2>{esc(t["title"])}</h2>'
                f'<div class="t-when">{esc(t["when"])}'
                f'<span class="t-ch">פרק {t["ch"]}</span></div>'
                f"{warn}"
                f'<pre>{esc(t["body"])}</pre>'
                f"</section>"
            )

    return f"""<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>אמנות המקצוע — תבניות</title>
<style>
  @page {{ size: A4; margin: 16mm 15mm 18mm; }}
  * {{ box-sizing: border-box; }}
  body {{ font-family: {BODY_FONT}; direction: rtl; color: #15201c;
          font-size: 11pt; line-height: 1.65; margin: 0; }}

  .cover {{ page-break-after: always; padding-top: 42mm; text-align: center; }}
  .cover .crest {{ font-size: 26pt; color: #9a6f2e; }}
  .cover h1 {{ font-size: 30pt; margin: 6mm 0 2mm; color: #15201c; letter-spacing: -0.5px; }}
  .cover .sub {{ font-size: 13pt; color: #4a5a53; }}
  .cover .rule {{ width: 48mm; height: 2px; background: #9a6f2e; margin: 7mm auto; }}
  .cover .lead {{ max-width: 118mm; margin: 0 auto; text-align: start; font-size: 11pt; color: #2d3b35; }}
  .cover .legal {{ max-width: 118mm; margin: 9mm auto 0; text-align: start; font-size: 9.5pt;
                   border: 1px solid #c8b9a0; border-right: 3px solid #9a6f2e;
                   background: #faf7f1; padding: 5mm 6mm; color: #3a3028; }}
  .cover .legal b {{ color: #15201c; }}

  .toc {{ page-break-after: always; }}
  .toc h2 {{ font-size: 17pt; margin: 0 0 5mm; }}
  .toc ul {{ list-style: none; padding: 0; margin: 0; }}
  .toc-g {{ font-weight: bold; color: #9a6f2e; margin: 5mm 0 1.5mm; font-size: 11.5pt; }}
  .toc-i {{ display: flex; align-items: baseline; gap: 4mm;
            border-bottom: 1px dotted #c9d3ce; padding: 1.6mm 0; }}
  .toc-t {{ flex: 1; }}
  .toc-ch {{ color: #8b968f; font-size: 9pt; white-space: nowrap; }}
  .toc-pg {{ width: 9mm; text-align: start; font-weight: bold; color: #15201c;
             font-size: 10.5pt; white-space: nowrap;
             direction: ltr; unicode-bidi: isolate; }}
  .toc-head {{ display: flex; align-items: baseline; gap: 4mm; font-size: 8.5pt;
               color: #8b968f; letter-spacing: 1px; padding-bottom: 1mm;
               border-bottom: 1px solid #c9d3ce; margin-bottom: 1mm; }}

  .tmpl {{ page-break-before: always; }}
  .t-group {{ font-size: 9pt; letter-spacing: 1.5px; color: #9a6f2e; }}
  .tmpl h2 {{ font-size: 18pt; margin: 1mm 0 2mm; }}
  .t-when {{ font-size: 10pt; color: #4a5a53; margin-bottom: 4mm;
             display: flex; justify-content: space-between; gap: 6mm;
             border-bottom: 1px solid #d7ded9; padding-bottom: 2.5mm; }}
  .t-ch {{ color: #6b7a73; white-space: nowrap; }}
  .warn {{ border: 1px solid #c0705a; border-right: 3px solid #c0705a; background: #fdf3f0;
           color: #8a3a22; font-size: 9.5pt; padding: 3.5mm 5mm; margin-bottom: 4mm; }}

  pre {{ font-family: {MONO_FONT}; font-size: 9.2pt; line-height: 1.62;
         white-space: pre-wrap; word-break: break-word; margin: 0;
         background: #fbfcfb; border: 1px solid #d7ded9; padding: 5mm 6mm; }}

  /* numbers and Latin runs inside Hebrew keep their own order */
  .ltr {{ direction: ltr; unicode-bidi: isolate; }}
</style>
</head>
<body>

<div class="cover">
  <div class="crest">◈</div>
  <h1>אמנות המקצוע</h1>
  <div class="sub">תבניות מסמכים למפיק מוזיקלי</div>
  <div class="rule"></div>
  <p class="lead">{len(templates)} מסמכים להדפסה ולמילוי. כל מה שבסוגריים מרובעים הוא שדה
  למילוי. הרעיון הוא לא למלא הכל בכל פעם, אלא שלא תצטרכו להחליט מחדש בכל
  פרויקט מה צריך להיות במסמך.</p>
  <p class="lead">מומלץ להעתיק אותם פעם אחת לתיקייה שלכם, למלא את מה שקבוע —
  השם שלכם, התעריפים, מספר סבבי התיקונים — ולשמור כתבניות.</p>
  <div class="legal"><b>הבהרה.</b> החומר הזה לימודי, לא ייעוץ משפטי ולא ייעוץ מס.
  המסמכים המסומנים <b>״דורש עורך דין״</b> הם שלדים שנועדו לעזור לכם להבין אילו
  סעיפים אמורים להיות בהסכם ולהגיע מוכנים לפגישה — לא חוזים לשימוש כמות שהם.
  לפני חתימה, העברת זכויות או כל החלטה עם משמעות כספית, התייעצו עם עורך דין
  שמתמחה בדיני בידור ומוזיקה, ועם רואה חשבון לעניינים פיננסיים.</div>
</div>

<div class="toc">
  <h2>תוכן</h2>
  <div class="toc-head"><span style="flex:1">המסמך</span><span>מקור</span><span style="width:9mm">עמ׳</span></div>
  <ul>{toc}</ul>
</div>

{"".join(pages)}
</body>
</html>"""


def render(html: str, chrome: str) -> bool:
    with tempfile.NamedTemporaryFile("w", suffix=".html", encoding="utf-8", delete=False) as fh:
        fh.write(html)
        tmp = fh.name
    r = subprocess.run(
        [chrome, "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", f"--print-to-pdf={OUT}", f"file://{tmp}"],
        capture_output=True, text=True,
    )
    pathlib.Path(tmp).unlink(missing_ok=True)
    if r.returncode or not OUT.exists():
        print(r.stderr, file=sys.stderr)
        return False
    return True


def locate_pages(templates: list) -> dict:
    """Map template id -> 1-based PDF page.

    Matching on the title text does not work: a heading like "פנייה ל-A&R / מפיק"
    mixes scripts, and PDF extraction returns the runs in visual rather than
    logical order, so the needle never matches. Each template instead starts on
    its own page with the only 18pt span on it, so the pages carrying that span,
    in order, are the templates in order.
    """
    try:
        import pymupdf
    except ImportError:
        return {}
    doc = pymupdf.open(OUT)
    starts = []
    for i in range(2, doc.page_count):          # skip cover and contents
        sizes = [sp["size"]
                 for b in doc[i].get_text("dict")["blocks"] if b.get("type") == 0
                 for ln in b["lines"] for sp in ln["spans"]]
        if sizes and max(sizes) > 17:           # the h2 is 18pt; nothing else is
            starts.append(i + 1)
    doc.close()
    if len(starts) != len(templates):
        print(f"WARNING: found {len(starts)} template pages for {len(templates)} "
              f"templates; contents page numbers skipped", file=sys.stderr)
        return {}
    return {t["id"]: pg for t, pg in zip(templates, starts)}


def main() -> int:
    templates = load_templates()
    DIST.mkdir(exist_ok=True)
    chrome = find_chrome()

    # pass 1 gives the pagination; pass 2 puts the real page numbers in the
    # contents. A contents listing chapter numbers where the reader expects
    # page numbers is worse than no numbers at all.
    if not render(build_html(templates), chrome):
        return 2
    pages_of = locate_pages(templates)

    missing = [t["id"] for t in templates if t["id"] not in pages_of]
    if missing:
        print(f"WARNING: no page found for {missing}; contents left blank for those",
              file=sys.stderr)
    if pages_of and not render(build_html(templates, pages_of), chrome):
        return 2

    print(f"built {OUT}")
    print(f"  {len(templates)} templates · {len(pages_of)} located "
          f"· {OUT.stat().st_size / 1024:.0f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
