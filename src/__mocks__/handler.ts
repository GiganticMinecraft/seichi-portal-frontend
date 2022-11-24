import { rest } from 'msw';

import { API_URL } from '@/config';

import { mockListFormInfo } from './api/forms';

export const handlers = [rest.get(`${API_URL}/forms`, mockListFormInfo)];
