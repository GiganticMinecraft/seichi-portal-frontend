import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

export interface FormListFilter {
  titleSearch: string;
  labels: GetFormLabelsResponse;
}

export const filterForms = (
  forms: GetFormsResponse,
  filter: FormListFilter
): GetFormsResponse => {
  const normalizedSearch = filter.titleSearch.trim().toLowerCase();

  return forms.filter((form) => {
    const matchesTitle =
      normalizedSearch.length === 0 ||
      form.title.toLowerCase().includes(normalizedSearch);
    const formLabelIds = new Set(form.labels.map((label) => label.id));
    const matchesLabels =
      filter.labels.length === 0 ||
      filter.labels.every((label) => formLabelIds.has(label.id));

    return matchesTitle && matchesLabels;
  });
};
