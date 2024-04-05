
import { configureStore } from '@reduxjs/toolkit';

import { createApiService } from '../services/api';
import { redirect } from './middlewares/redirect';
import { rootReducer } from './root-reducer';

export const api = createApiService();

export const frontendStorage = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: api },
    }).concat(redirect),
});
