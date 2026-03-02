import { MAX_BOTTLES } from '../constants';

export interface ValidationResult {
  /** 計算に使う補正済みの値（0以上、MAX_BOTTLES以下の整数） */
  value: number;
  /** エラーメッセージ。問題なければ null */
  error: string | null;
}

/**
 * 本数入力値のバリデーションと補正
 * - 空欄 → 0
 * - 小数点 → 切り捨て（エラー表示）
 * - マイナス → 0 に補正（エラー表示）
 * - MAX_BOTTLES超 → MAX_BOTTLES に補正（エラー表示）
 */
export function validateBottleCount(raw: string): ValidationResult {
  // 空欄は 0 扱い（エラーなし）
  if (raw === '' || raw === null || raw === undefined) {
    return { value: 0, error: null };
  }

  const num = Number(raw);

  // NaN
  if (Number.isNaN(num)) {
    return { value: 0, error: '整数で入力してください' };
  }

  // 小数点チェック
  const hasDecimal = raw.includes('.');
  const floored = Math.floor(num);

  if (hasDecimal) {
    const clamped = Math.max(0, Math.min(floored, MAX_BOTTLES));
    return { value: clamped, error: '整数で入力してください' };
  }

  // マイナスチェック
  if (floored < 0) {
    return { value: 0, error: '0以上で入力してください' };
  }

  // 上限チェック
  if (floored > MAX_BOTTLES) {
    return { value: MAX_BOTTLES, error: `${MAX_BOTTLES}本以下で入力してください` };
  }

  return { value: floored, error: null };
}

/** 円表記フォーマット（¥ + 3桁カンマ） */
export function formatYen(amount: number): string {
  return '¥' + amount.toLocaleString('ja-JP');
}
