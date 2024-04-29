import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    AuthData, AuthStatus, FetchFileParams, FrontendRoute, Pagination, QueryPagination,
    ResponseError, User, UserWithToken
} from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { saveToken } from '../../services/token';
import { redirectToRoute } from '../actions/redirect-to-route';
import { setAuthStatus, setResponseError } from '../reducers/app-process/app-process.slice';
import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const checkAuth = createAsyncThunk<
  UserWithToken,
  undefined,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/checkAuth', async (_arg, { extra: api }) => {
  const { data: tokenData } = await api.post<UserWithToken>(`${ApiRoute.User}${ApiRoute.Check}`);
  const { data } = await api.get<UserWithToken>(`${ApiRoute.User}/${tokenData.id}`);
  return data;
});

export const loginUser = createAsyncThunk<
  UserWithToken | null,
  AuthData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/loginUser', async (authData, { dispatch, extra: api }) => {
  try {
    const { data } = await api.post<UserWithToken>(
      `${ApiRoute.User}${ApiRoute.Login}`,
      authData
    );
    saveToken(data.accessToken);
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(`/${FrontendRoute.Login}`));
    return data;
  } catch (error) {
    if (
      typeof error === 'object'
      && error
      && 'response' in error
      && typeof error.response === 'object'
      && error.response
      && 'data' in error.response
      && typeof error.response.data === 'object'
    ) {
      dispatch(setResponseError(error.response.data as ResponseError));
    }
    return null;
  }
});

export const registerUser = createAsyncThunk<
  UserWithToken | null,
  FormData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/registerUser', async (userData, { dispatch, extra: api }) => {
  try {
    await api.post<User>(`${ApiRoute.User}${ApiRoute.Register}`, userData);
    const { data: loggedData } = await api.post<UserWithToken>(
      `${ApiRoute.User}${ApiRoute.Login}`,
      { email: userData.get('email'), password: userData.get('password') }
    );

    dispatch(setAuthStatus(AuthStatus.Unknown));
    saveToken(loggedData.accessToken);
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(`/${FrontendRoute.Questionnaire}`));
    return loggedData;
  } catch (error) {
    if (
      typeof error === 'object'
      && error
      && 'response' in error
      && typeof error.response === 'object'
      && error.response
      && 'data' in error.response
      && typeof error.response.data === 'object'
    ) {
      dispatch(setResponseError(error.response.data as ResponseError));
    }
    return null;
  }
});

export const fetchUser = createAsyncThunk<
  User,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/fetchUser', async (id, { extra: api }) => {
  const { data: userData } = await api.get(`${ApiRoute.User}/${id}`);
  return userData;
});

export const updateUser = createAsyncThunk<
  User | null,
  { id: string; data: FormData },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>(
  'users/updateUser',
  async ({ id, data }, { dispatch, extra: api }) => {
    try {
      const { data: user } = await api.patch<User>(
        `${ApiRoute.User}/${id}`,
        data
      );
      dispatch(setResponseError(null));
      return user;
    } catch (error) {
      if (
        typeof error === 'object'
        && error
        && 'response' in error
        && typeof error.response === 'object'
        && error.response
        && 'data' in error.response
        && typeof error.response.data === 'object'
      ) {
        dispatch(setResponseError(error.response.data as ResponseError));
      }
      return null;
    }
  }
);

export const fetchUserAvatar = createAsyncThunk<
  string,
  FetchFileParams,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/fetchUserAvatar', async ({ id }, { extra: api }) => {
  const { data: avatarUrl } = await api.get<string>(
    `${ApiRoute.User}/${id}/avatar`
  );
  return avatarUrl;
});

export const fetchUsersCatalog = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('users/fetchUsersCatalog', async (query, { extra: api }) => {
    const { data: pagination } = await api.get<Pagination<User>>(
    `${ApiRoute.User}?${stringify(query)}`
  );
  return pagination;
});
