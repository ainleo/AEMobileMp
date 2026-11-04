# tools

## export_icons.py

从 AEMobile 的图标 SQLite 导出 base64 PNG，批量上传到 EasyImage 图床，并生成 `icon-map.json`。

### 准备
- `items.db`（约 186MB，物品图标库；`fluids.db` / `essentia.db` 小库同理）
- 图床 Token（`src/config/imageHost.ts` 里的 EASYIMAGE_TOKEN）

### 小规模验证
```bash
python tools/export_icons.py --db items.db --kind items ^
  --base http://123.60.76.132:8088 --token <TOKEN> --category aemobile ^
  --out ./icon-out --limit 200 --concurrency 4
```

### 全量
```bash
python tools/export_icons.py --db items.db --kind items ^
  --base http://123.60.76.132:8088 --token <TOKEN> --category aemobile ^
  --out ./icon-out --concurrency 8
```

产物：
- `icon-out/icons/*.png`：导出的 PNG
- `icon-out/icon-map.json`：`byName`（显示名→URL）、`byKey`（`item_name:meta`→URL）

> 之后把 `icon-map.json` 放到图床可静态访问的位置（例如 `/i/aemobile/icon-map.json`），
> 小程序 `iconHost.ts` 改为读取该映射即可按显示名取图标。
