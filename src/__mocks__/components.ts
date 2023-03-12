import schema from '@/generated/bundled-openapi.json';

export const components = {
  forms:
    schema.paths['/forms'].get.responses[200].content['application/json']
      .examples.all_forms.value,
};
