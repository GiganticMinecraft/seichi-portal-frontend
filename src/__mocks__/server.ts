import { setupServer } from 'msw/node';

import { defaultHandlers } from './handlers';

export const mockServer = setupServer(...defaultHandlers);
