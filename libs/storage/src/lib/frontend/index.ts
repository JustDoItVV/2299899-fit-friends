import { createApiService } from '@2299899-fit-friends/services';
import { configureStore } from '@reduxjs/toolkit';

import { redirect } from './middlewares/redirect';
import { rootReducer } from './root-reducer';

export const api = createApiService();

export const frontendStorage = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      thunk: { extraArgument: api },
    }).concat(redirect),
});
