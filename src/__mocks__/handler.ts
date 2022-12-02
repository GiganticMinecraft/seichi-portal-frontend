import { rest } from 'msw';

import { API_URL } from '@/config';

import { mockListFormInfo, mockShowForm } from './api/forms';

export const handlers = [
  rest.get(`${API_URL}/forms`, mockListFormInfo),
  rest.get(`${API_URL}/forms/:formId`, mockShowForm),
];
