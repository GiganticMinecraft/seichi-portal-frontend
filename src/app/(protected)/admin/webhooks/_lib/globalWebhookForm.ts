export type GlobalWebhookFormValues = {
  url: string;
};

export const defaultGlobalWebhookFormValues: GlobalWebhookFormValues = {
  url: '',
};

export const toGlobalWebhookUpdateUrl = (
  values: GlobalWebhookFormValues
): string | null => {
  const trimmed = values.url.trim();
  return trimmed === '' ? null : trimmed;
};
