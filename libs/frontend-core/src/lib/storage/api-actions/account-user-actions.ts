import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    Balance, Pagination, QueryPagination, ResponseError, User
} from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setCurrentUser, setResponseError } from '../reducers/app-process/app-process.slice';
import { setUser } from '../reducers/user-process/user-process.slice';
import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const updateBalance = createAsyncThunk<
  Balance,
  Pick<Balance, 'trainingId' | 'available'> | { paymentMethod?: string },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/updateBalance', async (data, { extra: api }) => {
  const { data: balance } = await api.patch<Balance>(
    `${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}`,
    data,
  );
  return balance;
});

export const fetchBalanceCatalog = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/fetchBalanceCatalog', async (query, { extra: api }) => {
    const { data: pagination } = await api.get<Pagination<Balance>>(
    `${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}?${stringify(query)}`
  );
  return pagination;
});

export const addFriend = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/addFriend', async (id, { dispatch, extra: api }) => {
  try {
    await api.post(`${ApiRoute.User}/${id}${ApiRoute.Friend}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
    dispatch(setResponseError(null));
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
  }
});

export const deleteFriend = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/deleteFriend', async (id, { dispatch, extra: api }) => {
  try {
    await api.delete(`${ApiRoute.User}/${id}${ApiRoute.Friend}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
    dispatch(setResponseError(null));
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
  }
});

export const subscribeToTrainer = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/subscribeToTrainer', async (id, { dispatch, extra: api, getState }) => {
  try {
    const state = getState();
    await api.post(`${ApiRoute.User}/${id}${ApiRoute.Subscribe}`);
    await api.post(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${state.APP.currentUser?.id}`);
    dispatch(setCurrentUser(data));
    dispatch(setResponseError(null));
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
  }
});

export const unsubscribeFromTrainer = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/unsubscribeFromTrainer', async (id, { dispatch, extra: api, getState }) => {
  try {
    const state = getState();
    await api.delete(`${ApiRoute.User}/${id}${ApiRoute.Subscribe}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${state.APP.currentUser?.id}`);
    dispatch(setCurrentUser(data));
    dispatch(setResponseError(null));
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
  }
});

export const fetchUserFriends = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/fetchFriends', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<User>>(
    `${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Friends}?${stringify(query)}`
  );
  return pagination;
});

export const sendNewTrainingsMail = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/sendNewTrainingsMail', async (_, { extra: api }) => {
    await api.post(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`);
});
