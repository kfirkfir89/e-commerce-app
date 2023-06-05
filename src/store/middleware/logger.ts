import { Middleware } from 'redux';

import { RootState } from '../store';

export const loggerMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    if (!action.type) {
      return next(action);
    }

    console.log(
      '%c ACTION: ',
      'color: #dc2626; font-weight: bold; background-color: #e5e7eb; border-radius: 2px; border: 2px solid #a1a1aa;',
      action.type
    );
    console.log(
      '%cPAYLOAD: ',
      'color: #dc2626; font-weight: bold; ',
      action.payload
    );
    console.log(
      '%cCURRENT: ',
      'color: #2563eb; font-weight: bold; ',
      store.getState()
    );

    next(action);

    console.log(
      '%c NEXT: ',
      'color: #2563eb; font-weight: bold; background-color: #e5e7eb; border-radius: 2px; border: 2px solid #22c55e;',
      store.getState()
    );
  };
