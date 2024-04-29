import { Middleware } from 'redux';

import { PayloadAction } from '@reduxjs/toolkit';

import { browserHistory } from '../../services/browser-history';
import { rootReducer } from '../root-reducer';

type Reducer = ReturnType<typeof rootReducer>;

export const redirect: Middleware<unknown, Reducer> =
  () => (next) => (action: unknown) => {
    const act = action as PayloadAction<string>;
    if (act.type === 'frontend/redirectToRoute') {
      browserHistory.push(act.payload);
    }

    return next(action);
  };
