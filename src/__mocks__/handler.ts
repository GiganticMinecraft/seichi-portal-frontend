import { rest } from 'msw';

import { API_URL } from '@/config';

import { mockListForms } from './api/forms';

export const handlers = [rest.get(`${API_URL}/forms`, mockListForms)];
