/*
 * index.js — 数据聚合入口。
 * 三个时期主题、资源清单、许可信息与 DEM 数据在此汇总，引擎只依赖这里的 data 对象。
 */
import { suitang } from './theme.suitang.js';
import { wudai } from './theme.wudai.js';
import { song } from './theme.song.js';
import { project, themeOrder, defaultTheme } from './themes.index.js';
import { manifest } from './assets.js';
import { license } from './license.js';
import { dem } from './dem/regions.js';

export const data = {
  project,
  order: themeOrder,
  defaultTheme,
  themes: { suitang, wudai, song },
  assets: manifest,
  license,
  dem,
};
