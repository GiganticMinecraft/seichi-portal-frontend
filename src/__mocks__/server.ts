import { setupServer } from 'msw/node';

import { defaultHandlers } from './handler';

export const mockServer = setupServer(...defaultHandlers);
