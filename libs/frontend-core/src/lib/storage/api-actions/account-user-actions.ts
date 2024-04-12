import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Balance, Pagination, QueryPagination, User } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setResponseError } from '../reducers/app-process/app-process.slice';
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
>('accountUser/addFriend', async (id, { dispatch, extra: api, rejectWithValue }) => {
  try {
    await api.post(`${ApiRoute.User}/${id}${ApiRoute.Friend}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});

export const deleteFriend = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/deleteFriend', async (id, { dispatch, extra: api, rejectWithValue }) => {
  try {
    await api.delete(`${ApiRoute.User}/${id}${ApiRoute.Friend}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});

export const subscribeToTrainer = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/subscribeToTrainer', async (id, { dispatch, extra: api, rejectWithValue }) => {
  try {
    await api.post(`${ApiRoute.User}/${id}${ApiRoute.Subscribe}`);
    await api.post(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
    dispatch(setResponseError(null));
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});

export const unsubscribeFromTrainer = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountUser/unsubscribeFromTrainer', async (id, { dispatch, extra: api, rejectWithValue }) => {
  try {
    await api.delete(`${ApiRoute.User}/${id}${ApiRoute.Subscribe}`);
    const { data } = await api.get<User>(`${ApiRoute.User}/${id}`);
    dispatch(setUser(data));
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});
