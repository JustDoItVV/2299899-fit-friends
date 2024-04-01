import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { TokenPayload } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';

export const checkAuthAction = createAsyncThunk<
  TokenPayload,
  undefined,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/checkAuth', async (_arg, { extra: api }) => {
  const apiRoute = `${ApiRoute.User}${ApiRoute.Check}`;
  const { data } = await api.post<TokenPayload>(apiRoute);
  return data;
});
