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

    if (!matchesTitle) {
      return false;
    }

    const matchesLabels =
      filter.labels.length === 0 ||
      filter.labels.every((label) =>
        form.labels.some((formLabel) => formLabel.id === label.id)
      );

    return matchesLabels;
  });
};
