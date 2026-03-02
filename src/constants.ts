// ============================================================
// キャッシュバックシミュレーター 定数定義
// 本番前にLINE_OFFICIAL_IDを実際の公式LINE IDに変更してください
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

/** 公式LINE ID（本番では実際のIDに変更） */
export const LINE_OFFICIAL_ID = '@your-line-id';

/** 画面テキスト定数 */
export const TEXTS = {
  TITLE: 'キャッシュバックシミュレーター',
  SUBTITLE: '本数に応じてアマギフ or キャッシュバック or 割引',
  CTA_BUTTON: '無料で見積もり\u25B6\uFE0E',
  LINE_MESSAGE_TEMPLATE: (bottles: Record<BottleSize, number>, total: number) =>
    `見積もり希望\n3L：${bottles['3L']}本\n6L：${bottles['6L']}本\n15L：${bottles['15L']}本\n合計特典：¥${total.toLocaleString('ja-JP')}`,
} as const;
