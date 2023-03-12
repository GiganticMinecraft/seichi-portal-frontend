import { components } from './components';
import { endPoints, ResponseFunctionReturn } from './helper';

export const handlers: {
  [usecases: string]: {
    ok: ResponseFunctionReturn;
    [responses: string]: ResponseFunctionReturn;
  };
} = {
  getFormList: {
    ok: endPoints.get('/forms', components.forms),
  },
};

export const defaultHandlers = Object.entries(handlers).map(
  ([_usecases, statusHandlers]) => statusHandlers.ok,
);
