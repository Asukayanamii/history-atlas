/*
 * hs.js — 沙盘引擎共享命名空间。
 * 原实现把模块挂在 window.HS 上；改为 ESM 后由本模块导出单例，模块间通过 import 共享。
 */
export const HS = {};
