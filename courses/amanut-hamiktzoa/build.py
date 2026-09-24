#!/usr/bin/env python3
"""Assembles the single-file course 'אמנות המקצוע' from src/ into dist/.

Usage:  python3 build.py
Output: dist/אמנות-המקצוע.html
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
OUT_NAME = "אמנות-המקצוע.html"


def js_string(text: str) -> str:
    """Wrap an HTML fragment as a JS template literal, escaping what would break it."""
    return "`" + text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"


def main() -> int:
    structure = json.loads((SRC / "structure.json").read_text(encoding="utf-8"))
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    tools_js = (SRC / "tools.js").read_text(encoding="utf-8")

    chapters = structure["chapters"]
    declared = sorted(c["n"] for lst in chapters.values() for c in lst)

    content, missing = {}, []
    for n in declared:
        frag = SRC / "chapters" / f"ch{n:02d}.html"
        if frag.exists():
            content[n] = frag.read_text(encoding="utf-8").strip()
        else:
            missing.append(n)

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
    data.append(tools_js)

    html = shell.replace("__DATA__", "\n".join(data))

    DIST.mkdir(exist_ok=True)
    out = DIST / OUT_NAME
    out.write_text(html, encoding="utf-8")

    words = sum(len(re.sub(r"<[^>]+>", " ", c).split()) for c in content.values())
    print(f"built {out}")
    print(f"  {len(structure['volumes'])} volumes · {len(declared)} chapters "
          f"· {len(content)} written · ~{words:,} words · {out.stat().st_size / 1024:.0f} KB")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
