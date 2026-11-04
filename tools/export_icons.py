#!/usr/bin/env python3
"""
AEMobile 图标库 -> 图床 批量导出/上传工具。

从原 App 的图标 SQLite（items.db / fluids.db / essentia.db）里读取 base64 PNG，
写出本地 PNG，批量上传到 EasyImage，并生成 icon-map.json（显示名/注册名 -> URL）。

用法示例：
  python tools/export_icons.py --db items.db --kind items \
    --base http://123.60.76.132:8088 --token <TOKEN> --category aemobile --out ./icon-out

可选：
  --limit 200        只处理前 200 个（先小规模验证）
  --concurrency 6    并发上传数（默认 6）
  --dry-run          只导出 PNG、不下载也不上传（生成本地映射）
  --skip-upload      只导出 PNG，不上传

说明：
- items.db 表 item_panel(item_name, item_meta, dname, icon)
- fluids.db 表 fluid_icon(fluid, icon, tint)
- essentia.db 表 aspect(tag, icon, tint)
- icon 字段是 base64 文本或 BLOB；脚本两种都兼容。
"""
import argparse
import base64
import json
import os
import re
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"


def sanitize(s, maxlen=90):
    s = re.sub(r"[^A-Za-z0-9_-]+", "_", str(s or "")).strip("_")
    return (s or "icon")[:maxlen]


def decode_icon(val):
    if val is None:
        return None
    if isinstance(val, memoryview):
        val = val.tobytes()
    if isinstance(val, bytes):
        if val[:8] == PNG_MAGIC:
            return val
        try:
            return base64.b64decode(val, validate=False)
        except Exception:
            return None
    if isinstance(val, str):
        v = val.strip()
        if not v:
            return None
        try:
            return base64.b64decode(v, validate=False)
        except Exception:
            return None
    return None


def rows_for(kind, db):
    cur = db.cursor()
    if kind == "items":
        cur.execute(
            "select item_name, item_meta, dname, icon from item_panel "
            "where icon is not null and length(icon) > 0"
        )
        for name, meta, dname, icon in cur.fetchall():
            key = f"{name}:{meta}"
            stem = sanitize(f"{name}__{meta}")
            yield stem, key, (dname or name), icon
    elif kind == "fluids":
        cur.execute("select fluid, icon from fluid_icon where icon is not null and length(icon) > 0")
        for fluid, icon in cur.fetchall():
            yield sanitize(f"fluid__{fluid}"), fluid, fluid, icon
    elif kind == "essentia":
        cur.execute("select tag, icon from aspect where icon is not null and length(icon) > 0")
        for tag, icon in cur.fetchall():
            yield sanitize(f"aspect__{tag}"), tag, tag, icon
    else:
        raise SystemExit(f"unknown kind: {kind}")


def multipart(fields, files):
    boundary = "----AEMobileBoundary" + str(int(time.time() * 1000))
    body = bytearray()
    for k, v in fields.items():
        body += f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    for k, (filename, data, ctype) in files.items():
        body += (
            f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"; '
            f'filename="{filename}"\r\nContent-Type: {ctype}\r\n\r\n'
        ).encode()
        body += data + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    return boundary, bytes(body)


def upload(base, token, category, stem, png, timeout=40):
    fields = {"token": token}
    if category:
        fields["category"] = category
    fields["filename"] = stem
    boundary, body = multipart(fields, {"image": (stem + ".png", png, "image/png")})
    req = urllib.request.Request(
        base.rstrip("/") + "/api/index.php",
        data=body,
        method="POST",
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        js = json.loads(r.read().decode("utf-8", "ignore"))
    if js.get("result") != "success":
        raise RuntimeError(js.get("message") or "upload failed")
    url = js.get("url", "")
    if url and not url.startswith("http"):
        url = base.rstrip("/") + url
    return url


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True)
    ap.add_argument("--kind", default="items", choices=["items", "fluids", "essentia"])
    ap.add_argument("--base", required=True)
    ap.add_argument("--token", required=True)
    ap.add_argument("--category", default="aemobile")
    ap.add_argument("--out", default="./icon-out")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--concurrency", type=int, default=6)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--skip-upload", action="store_true")
    args = ap.parse_args()

    out_icons = os.path.join(args.out, "icons")
    os.makedirs(out_icons, exist_ok=True)

    db = sqlite3.connect(args.db)
    entries = []
    for stem, key, label, icon in rows_for(args.kind, db):
        png = decode_icon(icon)
        if not png:
            continue
        path = os.path.join(out_icons, stem + ".png")
        if not os.path.exists(path):
            with open(path, "wb") as f:
                f.write(png)
        entries.append((stem, key, label, len(png)))
        if args.limit and len(entries) >= args.limit:
            break
    print(f"导出 {len(entries)} 个图标 -> {out_icons}")

    result = {
        "version": time.strftime("%Y-%m-%d %H:%M:%S"),
        "kind": args.kind,
        "category": args.category,
        "base": args.base,
        "count": 0,
        "byName": {},
        "byKey": {},
    }

    if args.dry_run or args.skip_upload:
        for stem, key, label, _size in entries:
            url = f"{out_icons}/{stem}.png"
            result["byName"][label] = url
            result["byKey"][key] = url
        result["count"] = len(entries)
    else:
        ok = fail = 0

        def work(e):
            stem, key, label, _size = e
            with open(os.path.join(out_icons, stem + ".png"), "rb") as f:
                png = f.read()
            return e, upload(args.base, args.token, args.category, stem, png)

        with ThreadPoolExecutor(max_workers=args.concurrency) as ex:
            futs = {ex.submit(work, e): e for e in entries}
            for i, f in enumerate(as_completed(futs), 1):
                e = futs[f]
                try:
                    (stem, key, label, _size), url = f.result()
                    result["byName"][label] = url
                    result["byKey"][key] = url
                    ok += 1
                except Exception as ex2:
                    fail += 1
                    print("FAIL", e[0], ex2)
                if i % 50 == 0 or i == len(entries):
                    print(f"  {i}/{len(entries)} ok={ok} fail={fail}")
        result["count"] = ok

    map_path = os.path.join(args.out, "icon-map.json")
    with open(map_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("完成，映射文件:", map_path)


if __name__ == "__main__":
    main()
