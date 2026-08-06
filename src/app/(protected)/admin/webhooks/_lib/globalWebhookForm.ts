export type GlobalWebhookFormValues = {
  url: string;
  disabled: boolean;
};

export const defaultGlobalWebhookFormValues: GlobalWebhookFormValues = {
  url: '',
  disabled: false,
};

export const hasGlobalWebhookPendingChange = (
  values: GlobalWebhookFormValues
): boolean => values.disabled || values.url.trim() !== '';

export const toGlobalWebhookUpdateUrl = (
  values: GlobalWebhookFormValues
): string | null => {
  if (values.disabled) return null;

  const trimmed = values.url.trim();
  return trimmed === '' ? null : trimmed;
};
