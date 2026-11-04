"""合并 items/fluids/essentia 的 icon-map.json 为一个 icon-map.json。"""
import json
import sys
import time

paths = sys.argv[1:-1]
out_path = sys.argv[-1]

by_name = {}
by_key = {}
for p in paths:
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
    except Exception as e:
        print("skip", p, e)
        continue
    for k, v in (d.get("byName") or {}).items():
        by_name.setdefault(k, v)
    for k, v in (d.get("byKey") or {}).items():
        by_key.setdefault(k, v)

result = {
    "version": time.strftime("%Y-%m-%d %H:%M:%S"),
    "count": len(by_name),
    "byName": by_name,
    "byKey": by_key,
}
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False)
print("merged", len(by_name), "names,", len(by_key), "keys ->", out_path)
