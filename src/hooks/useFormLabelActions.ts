'use client';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: (string | number)[]) => {
    await fetch(`/api/proxy/forms/${formId}/labels`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: labelIds }),
    });
  };

  return { updateLabels };
};
