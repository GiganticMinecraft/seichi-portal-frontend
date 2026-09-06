'use client';

import * as React from 'react';

import {
  clampSidebarWidth,
  computeMaxSidebarWidth,
  DEFAULT_SIDEBAR_WIDTH_PX,
  readStoredSidebarWidth,
  SIDEBAR_WIDTH_STORAGE_KEY,
} from '@/generic/sidebarWidth';

const noopSubscribe = () => () => {};

const subscribeToViewportResize = (onStoreChange: () => void) => {
  window.addEventListener('resize', onStoreChange);
  return () => {
    window.removeEventListener('resize', onStoreChange);
  };
};

type DragState = {
  pointerId: number;
  startClientX: number;
  startWidth: number;
};

/**
 * メッセージ・コメントの sidebar (Drawer, anchor="right") をドラッグでリサイズするための hook。
 *
 * - 幅は sessionStorage の単一 key に保存し、メッセージ・コメント間で共有する。
 * - SSR / ハイドレーション直後は固定値を返し、ハイドレーション後に sessionStorage の実値へ
 *   安全に切り替える (`useAnswerRowHighlightAndScroll` と同じパターン)。
 * - 上限はビューポート幅の 80%。マウント時と window の resize で再計算し、
 *   保存済みの幅がその時点の上限を超えていれば表示幅を上限へ再 clamp する。
 * - ドラッグ中は `paperRef` が指す DOM 要素の `style.width` を直接書き換えて即時反映し、
 *   React の state 更新 (および sessionStorage への保存) は pointerup 時にのみ行う。
 *   これにより、ドラッグ中に呼び出し側のサブツリーを毎フレーム再レンダリングしない。
 *
 * 幅の不変条件 (下限・上限・保存値のパース) は `src/generic/sidebarWidth.ts` の
 * 純粋関数へ切り出しており、この hook は state 更新・DOM 操作・イベント購読といった
 * 副作用の組み立てにのみ責務を持つ。
 */
export const useResizableSidebarWidth = () => {
  const paperRef = React.useRef<HTMLDivElement | null>(null);
  const dragStateRef = React.useRef<DragState | null>(null);

  const maxWidth = React.useSyncExternalStore(
    subscribeToViewportResize,
    () => computeMaxSidebarWidth(window.innerWidth),
    // SSR / ハイドレーション直後は上限を計算できないため、clamp が効かない値を返す。
    () => Number.POSITIVE_INFINITY
  );

  const storedWidth = React.useSyncExternalStore(
    noopSubscribe,
    () => readStoredSidebarWidth(window.sessionStorage),
    () => null
  );

  const [draggedWidth, setDraggedWidth] = React.useState<number | null>(null);

  const width = clampSidebarWidth(
    draggedWidth ?? storedWidth ?? DEFAULT_SIDEBAR_WIDTH_PX,
    maxWidth
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const paper = paperRef.current;
      if (!paper) return;

      event.preventDefault();
      dragStateRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startWidth: paper.getBoundingClientRect().width,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    []
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      const paper = paperRef.current;
      if (!dragState || !paper || event.pointerId !== dragState.pointerId) {
        return;
      }

      // anchor="right" の Drawer なので、ハンドルを左へ引く (dx < 0) ほど幅が増える。
      const dx = event.clientX - dragState.startClientX;
      const nextWidth = clampSidebarWidth(
        dragState.startWidth - dx,
        computeMaxSidebarWidth(window.innerWidth)
      );
      paper.style.width = `${nextWidth}px`;
    },
    []
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }
      dragStateRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const paper = paperRef.current;
      const finalWidth = paper
        ? paper.getBoundingClientRect().width
        : dragState.startWidth;
      // ドラッグ中に直接書き換えた inline style を外し、以後の幅を React (sx) 側の
      // 制御へ戻す。残したままだと、次回の window resize による再 clamp が
      // sx 側の class 更新より優先されてしまい表示へ反映されない。
      paper?.style.removeProperty('width');

      setDraggedWidth(finalWidth);
      window.sessionStorage.setItem(
        SIDEBAR_WIDTH_STORAGE_KEY,
        String(finalWidth)
      );
    },
    []
  );

  return {
    paperRef,
    width,
    dragHandleProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  };
};
