import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { saveToken } from '@2299899-fit-friends/services';
import { AuthData, FrontendRoute, UserWithToken } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { redirectToRoute } from '../actions/redirect-to-route';
import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';
import { setResponseError } from '../user-process/user-process.slice';

export const checkAuthAction = createAsyncThunk<
  UserWithToken,
  undefined,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/checkAuth', async (_arg, { extra: api }) => {
  const apiRouteCheck = `${ApiRoute.User}${ApiRoute.Check}`;
  const { data } = await api.post<UserWithToken>(apiRouteCheck);
  return data;
});

export const loginAction = createAsyncThunk<
  UserWithToken,
  AuthData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/login', async (authData, { dispatch, extra: api, rejectWithValue }) => {
  const apiRoute = `${ApiRoute.User}${ApiRoute.Login}`;
  try {
    const { data } = await api.post<UserWithToken>(apiRoute, authData);
    saveToken(data.accessToken);
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(FrontendRoute.Login));
    return data;
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});
