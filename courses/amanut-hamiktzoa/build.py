#!/usr/bin/env python3
"""Assembles the single-file course 'אמנות המקצוע' from src/ into dist/.

Usage:  python3 build.py
Output: dist/אמנות-המקצוע.html
"""
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
OUT_NAME = "אמנות-המקצוע.html"
ARTIFACT_NAME = "artifact.html"


def js_string(text: str) -> str:
    """Wrap an HTML fragment as a JS template literal, escaping what would break it."""
    return "`" + text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"


def to_artifact(html: str) -> str:
    """Strip the outer document wrapper for the Artifact publish skeleton,
    which supplies its own <!doctype>/<html>/<head>/<body> and pins
    color-scheme:light on :root. Everything else is left untouched."""
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)

    keep = []
    for pat in (r"<title>.*?</title>", r'<link[^>]+fonts\.(?:googleapis|gstatic)\.com[^>]*>', r"<style>.*?</style>"):
        keep += re.findall(pat, head, re.S)
    out = "\n".join(keep) + "\n" + body.strip() + "\n"

    # the page is deliberately single-theme dark, so say so for form controls
    # and scrollbars, and keep the sticky bar clear of the phone's status bar
    out = out.replace("  :root {\n", "  :root {\n    color-scheme: dark;\n", 1)
    out = out.replace("position:sticky; top:0; z-index:100;",
                      "position:sticky; top:env(safe-area-inset-top, 0px); z-index:100;", 1)

    # dir="rtl" lived on the <html> tag the skeleton now supplies, so the whole
    # page would render left-to-right without this
    out = out.replace("  body {\n    background:var(--bg);",
                      "  body {\n    direction:rtl;\n    background:var(--bg);", 1)
    if "direction:rtl;\n    background" not in out:
        raise SystemExit("to_artifact: could not set direction:rtl on body")

    # the gallery wants a name; the subtitle goes in the publish description
    out = re.sub(r"<title>[^<]*</title>", "<title>אמנות המקצוע</title>", out, count=1)
    return out


def check_js(html: str) -> str:
    """Syntax-check the generated script block. A stray quote in a data file
    (e.g. an apostrophe inside a single-quoted Hebrew string) breaks the whole
    page silently, so the build refuses to ship it."""
    node = shutil.which("node")
    if not node:
        return ""
    blocks = re.findall(r"<script>(.*?)</script>", html, re.S)
    if not blocks:
        return "no script block found"
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as fh:
        fh.write(blocks[-1])
        tmp = fh.name
    try:
        r = subprocess.run([node, "--check", tmp], capture_output=True, text=True)
        return "" if r.returncode == 0 else r.stderr.strip()
    finally:
        pathlib.Path(tmp).unlink(missing_ok=True)


def main() -> int:
    structure = json.loads((SRC / "structure.json").read_text(encoding="utf-8"))
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    # order matters: data files first, then the tools that read them
    js_files = ["templates.js", "glossary.js", "quizzes.js", "scenarios.js", "diagnostic.js", "tools.js"]
    extra_js = "\n".join((SRC / f).read_text(encoding="utf-8") for f in js_files)

    chapters = structure["chapters"]
    declared = sorted(c["n"] for lst in chapters.values() for c in lst)

    figures = {p.stem: p.read_text(encoding="utf-8").strip()
               for p in sorted((SRC / "figures").glob("*.html"))}

    content, missing, unknown_figs = {}, [], []
    for n in declared:
        frag = SRC / "chapters" / f"ch{n:02d}.html"
        if not frag.exists():
            missing.append(n)
            continue
        text = frag.read_text(encoding="utf-8").strip()
        for name in re.findall(r"\{\{FIG:([a-z0-9_-]+)\}\}", text):
            if name in figures:
                text = text.replace("{{FIG:%s}}" % name, figures[name])
            else:
                unknown_figs.append(f"ch{n:02d} -> {name}")
        content[n] = text

    if unknown_figs:
        print(f"ERROR: unknown figure reference(s): {unknown_figs}", file=sys.stderr)
        return 2

    if missing:
        print(f"WARNING: no content file for chapters {missing}", file=sys.stderr)

    data = []
    data.append("const WORLDS = " + json.dumps(structure["worlds"], ensure_ascii=False) + ";")
    data.append("const VOLUMES = " + json.dumps(structure["volumes"], ensure_ascii=False) + ";")
    data.append("const CHAPTERS = " + json.dumps(chapters, ensure_ascii=False) + ";")
    data.append("const CONTENT = {")
    for n in declared:
        if n in content:
            data.append(f"  {n}: {js_string(content[n])},")
    data.append("};")
    data.append(extra_js)

    # counts live in one place: the data files themselves
    counts = {
        "{GLOSSARY_COUNT}": str(len(re.findall(r"^\['", (SRC / "glossary.js").read_text(encoding="utf-8"), re.M))),
        "{TEMPLATE_COUNT}": str(len(re.findall(r"^  id:'", (SRC / "templates.js").read_text(encoding="utf-8"), re.M))),
    }
    joined = "\n".join(data)
    for token, value in counts.items():
        joined = joined.replace(token, value)

    html = shell.replace("__DATA__", joined)

    DIST.mkdir(exist_ok=True)
    out = DIST / OUT_NAME
    out.write_text(html, encoding="utf-8")

    syntax_error = check_js(html)
    if syntax_error:
        print(f"ERROR: generated JS is invalid\n{syntax_error}", file=sys.stderr)
        return 2

    art = DIST / ARTIFACT_NAME
    art.write_text(to_artifact(html), encoding="utf-8")

    words = sum(len(re.sub(r"<[^>]+>", " ", c).split()) for c in content.values())
    print(f"built {out}")
    used = sum(c.count("<figure") for c in content.values())
    print(f"  {len(structure['volumes'])} volumes · {len(declared)} chapters "
          f"· {len(content)} written · ~{words:,} words")
    print(f"  {len(figures)} figures ({used} placed) · {out.stat().st_size / 1024:.0f} KB")
    print(f"  artifact build: {art} ({art.stat().st_size / 1024:.0f} KB)")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
