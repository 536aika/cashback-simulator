// ============================================================
// キャッシュバックシミュレーター 定数定義
// URLを変えたいときは LINE_ESTIMATE_URL を書き換えてください
// ============================================================

/** サイズ定義 */
export type BottleSize = '3L' | '6L' | '15L';

/** 特典単価（30%OFF時の差額）定数 */
export const DIFF_PER_BOTTLE: Record<BottleSize, number> = {
  '3L': 2700,   // ¥21,600 - ¥18,900
  '6L': 7300,   // ¥58,400 - ¥51,100
  '15L': 22500, // ¥180,000 - ¥157,500
} as const;

/** 入力上限本数 */
export const MAX_BOTTLES = 999;

/**
 * 見積もりボタンの遷移先URL（LINE友だち追加）
 * 変更したい場合はここを書き換えてください
 */
export const LINE_ESTIMATE_URL = 'https://lin.ee/K7ODm3J';

/** 画面テキスト定数 */
export const TEXTS = {
  TITLE: 'キャッシュバックシミュレーター',
  SUBTITLE: '本数に応じてアマギフ or キャッシュバック or 割引',
  CTA_BUTTON: '無料で見積もり\u25B6\uFE0E',
} as const;
