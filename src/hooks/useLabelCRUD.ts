'use client';

/**
 * ラベルの作成・削除・編集を行う汎用フック。
 * エンドポイントは呼び出し元が指定する。
 *
 * @param createEndpoint  POST 先 URL（例: '/api/proxy/forms/labels/forms'）
 * @param deleteEndpointBase DELETE 先 URL のベース（例: '/api/proxy/forms/labels/forms'）→ `${base}/${id}` で呼ばれる
 * @param editEndpointBase  PATCH 先 URL のベース（例: '/api/proxy/forms/labels/forms'）→ `${base}/${id}` で呼ばれる
 */
export const useLabelCRUD = (
  createEndpoint: string,
  deleteEndpointBase: string,
  editEndpointBase: string
) => {
  const createLabel = async (name: string) => {
    await fetch(createEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  };

  const deleteLabel = async (id: string | number): Promise<{ ok: boolean }> => {
    const response = await fetch(`${deleteEndpointBase}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return { ok: response.ok };
  };

  const editLabel = async (
    id: string | number,
    name: string
  ): Promise<{ ok: boolean }> => {
    const response = await fetch(`${editEndpointBase}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return { ok: response.ok };
  };

  return { createLabel, deleteLabel, editLabel };
};
