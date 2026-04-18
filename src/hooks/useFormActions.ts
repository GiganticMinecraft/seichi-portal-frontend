'use client';

export const useFormActions = () => {
  const deleteForm = async (formId: string): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/forms/${formId}`, {
      method: 'DELETE',
    });
    return { ok: response.ok };
  };

  return { deleteForm };
};
