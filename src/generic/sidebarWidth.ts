/**
 * メッセージ・コメント sidebar (Drawer) のリサイズ幅に関する不変条件をまとめた純粋関数群。
 * 副作用 (sessionStorage への実アクセス) を持つ `readStoredWidth` は、
 * `Pick<Storage, 'getItem'>` を引数として受け取ることで fake なしにテスト可能にしている。
 */

/** メッセージ・コメント両方の sidebar (Drawer) で幅を共有するための単一 key。 */
export const SIDEBAR_WIDTH_STORAGE_KEY = 'conversation-sidebar-width';

export const MIN_SIDEBAR_WIDTH_PX = 400;
export const DEFAULT_SIDEBAR_WIDTH_PX = 400;
const MAX_SIDEBAR_WIDTH_VIEWPORT_RATIO = 0.8;

export const computeMaxSidebarWidth = (viewportWidth: number): number =>
  viewportWidth * MAX_SIDEBAR_WIDTH_VIEWPORT_RATIO;

export const clampSidebarWidth = (width: number, maxWidth: number): number =>
  Math.min(Math.max(width, MIN_SIDEBAR_WIDTH_PX), maxWidth);

export const readStoredSidebarWidth = (
  storage: Pick<Storage, 'getItem'>
): number | null => {
  const raw = storage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
  // 空文字は Number('') === 0 になってしまうため、未保存 (null) と同様に扱う。
  if (raw === null || raw === '') return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};
