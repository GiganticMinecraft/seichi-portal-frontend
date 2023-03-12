import { components } from './components';
import { endPoints, ResponseFunctionReturn } from './helpers';

export const handlers: {
  [usecase: string]: {
    ok: ResponseFunctionReturn;
    [response: string]: ResponseFunctionReturn;
  };
} = {
  getFormList: {
    ok: endPoints.get('/forms', components.forms),
  },
};

export const defaultHandlers = Object.entries(handlers).map(
  ([_usecase, statusHandlers]) => statusHandlers.ok,
);
