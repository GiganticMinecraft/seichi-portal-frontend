import { describe, expect, it } from 'vitest';

import {
  clampSidebarWidth,
  computeMaxSidebarWidth,
  MIN_SIDEBAR_WIDTH_PX,
  readStoredSidebarWidth,
  SIDEBAR_WIDTH_STORAGE_KEY,
} from '@/generic/sidebarWidth';

describe('computeMaxSidebarWidth', () => {
  it('viewport 幅の 80% を返す', () => {
    expect(computeMaxSidebarWidth(1000)).toBe(800);
    expect(computeMaxSidebarWidth(600)).toBe(480);
  });
});

describe('clampSidebarWidth', () => {
  it('下限 (400px) 未満は 400 にクランプされる', () => {
    expect(clampSidebarWidth(100, 800)).toBe(MIN_SIDEBAR_WIDTH_PX);
    expect(clampSidebarWidth(399, 800)).toBe(MIN_SIDEBAR_WIDTH_PX);
  });

  it('上限を超える値は上限にクランプされる', () => {
    expect(clampSidebarWidth(900, 800)).toBe(800);
  });

  it('範囲内の値はそのまま返る', () => {
    expect(clampSidebarWidth(500, 800)).toBe(500);
  });
});

const createStorage = (value: string | null): Pick<Storage, 'getItem'> => ({
  getItem: (key: string) => (key === SIDEBAR_WIDTH_STORAGE_KEY ? value : null),
});

describe('readStoredSidebarWidth', () => {
  it('保存された数値をそのまま返す', () => {
    expect(readStoredSidebarWidth(createStorage('500'))).toBe(500);
  });

  it('null (未保存) の場合は null を返す', () => {
    expect(readStoredSidebarWidth(createStorage(null))).toBeNull();
  });

  it('空文字の場合は null を返す (NaN フォールバック)', () => {
    expect(readStoredSidebarWidth(createStorage(''))).toBeNull();
  });

  it('数値化できない文字列の場合は null を返す', () => {
    expect(readStoredSidebarWidth(createStorage('not-a-number'))).toBeNull();
  });
});
