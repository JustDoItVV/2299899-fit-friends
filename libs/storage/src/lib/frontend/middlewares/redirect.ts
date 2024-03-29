import { Middleware } from 'redux';

import { browserHistory } from '@2299899-fit-friends/services';
import { PayloadAction } from '@reduxjs/toolkit';

import { rootReducer } from '../root-reducer';

type Reducer = ReturnType<typeof rootReducer>;

export const redirect: Middleware<unknown, Reducer> = () => (next) => (action: PayloadAction<string>) => {
    if (action.type === 'app/redirectToRoute') {
      browserHistory.push(action.payload);
    }

    return next(action);
  };
