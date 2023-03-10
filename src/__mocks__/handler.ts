import { components } from './components';
import { get } from './helper';

export const handlers = {
  get_form_list: {
    ok: get('/forms', components.forms),
  },
};

export const defaultHandlers = Object.entries(handlers).map(
  ([_path, statusHandlers]) => statusHandlers.ok,
);
