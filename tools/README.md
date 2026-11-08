# tools · 构建脚本

仅在**开发 / 构建期**运行；页面运行时不执行 Python、不联网。

## 依赖

- Python 3.10+
- Pillow（`python -m pip install pillow`）
- 网络（仅 `build_dem.py` 首次下载瓦片；之后走 `tools/.dem-cache/`，不提交）

## 1. DEM 高程

```bash
python tools/build_dem.py --validate
```

- 来源：Mapzen / Joerd Terrain Tiles（AWS Open Data）
- 输出：`frontend/src/data/dem/regions.js`（ESM：`export const dem = {}`，int16le-base64）
- 许可与改动说明：`docs/3d/handoff/DEM_SOURCES.md`

## 2. 2:1 全景 / e11 占位图

```bash
python tools/build_vr_panos.py
```

- 输入：`frontend/public/assets/events/<theme>/<event>.jpg`（16:9）
- 输出：`frontend/public/assets/vr/<theme>/<event>.jpg`（4096×2048，2:1 全景示意）
- 说明：不是全景摄影；中央 180° 为插画，其余为程序化扩展。真全景到位后不要再跑本脚本，否则覆盖同名文件。

## 注意

- `regions.js`、`assets/vr/*.jpg`、`events/wudai/e11.jpg` 是生成物，不要手改。
- `.dem-cache/` 与 `.build-dem.log` 不提交。
