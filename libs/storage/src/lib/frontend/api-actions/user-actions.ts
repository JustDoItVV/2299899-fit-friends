import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { saveToken } from '@2299899-fit-friends/services';
import { AuthData, FrontendRoute, User, UserRole, UserWithToken } from '@2299899-fit-friends/types';
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

export const loginUserAction = createAsyncThunk<
  UserWithToken,
  AuthData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/login', async (authData, { dispatch, extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<UserWithToken>(
      `${ApiRoute.User}${ApiRoute.Login}`,
      authData,
    );
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

export const registerUserAction = createAsyncThunk<
  User,
  FormData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/register', async (userData, { dispatch, extra: api, rejectWithValue }) => {
  try {
    const { data: user } = await api.post<User>(
      `${ApiRoute.User}${ApiRoute.Register}`,
      userData,
    );
    const { data: loggedData } = await api.post<UserWithToken>(
      `${ApiRoute.User}${ApiRoute.Login}`,
      { email: userData.get('email'), password: userData.get('password') },
    );
    saveToken(loggedData.accessToken);
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(FrontendRoute.Questionnaire));
    return user;

  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});


export const fetchUserAction = createAsyncThunk<
  User,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/fetchUser', async (id, { extra: api }) => {
  const { data: userData } = await api.get(
    `${ApiRoute.User}/${id}`
  );
  return userData;
});

export const updateUserAction = createAsyncThunk<
  User,
  { id: string, data: FormData },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/updateUser', async ({ id, data }, { dispatch, extra: api, rejectWithValue }) => {
  try {
    const { data: user } = await api.patch<User>(
      `${ApiRoute.User}/${id}`,
      data,
    );
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(data.get('role') === UserRole.Trainer ? FrontendRoute.Personal : FrontendRoute.Main));
    return user;

  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});