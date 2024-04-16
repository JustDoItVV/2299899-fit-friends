import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    FetchFileParams, FrontendRoute, Order, Pagination, QueryPagination, Training, User
} from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { redirectToRoute } from '../actions/redirect-to-route';
import { setResponseError } from '../reducers/app-process/app-process.slice';
import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const createTraining = createAsyncThunk<
  Training,
  FormData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/createTraining', async (formData, { dispatch, extra: api, rejectWithValue }) => {
  try {
    const { data: training } = await api.post<Training>(
      ApiRoute.Training,
      formData
    );
    dispatch(setResponseError(null));
    dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
    return training;
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});

export const fetchTrainerCatalog = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainerCatalog', async (query, { extra: api }) => {
    const { data: pagination } = await api.get<Pagination<Training>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}?${stringify(query)}`
  );
  return pagination;
});

export const fetchTrainingBackgroundPicture = createAsyncThunk<
  string,
  FetchFileParams,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainingBackgroundPicture', async ({ id }, { extra: api }) => {
  const { data: pictureUrl } = await api.get<string>(
    `${ApiRoute.Training}/${id}${ApiRoute.BackgroundPicture}`,
  );
  return pictureUrl;
});

export const fetchTrainingVideo = createAsyncThunk<
  string,
  FetchFileParams,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainingVideo', async ({ id }, { extra: api }) => {
  const { data } = await api.get<Blob>(
    `${ApiRoute.Training}/${id}${ApiRoute.Video}`,
    { responseType: 'blob'}
  );
  const dataUrl = URL.createObjectURL(data);
  return dataUrl;
});

export const fetchTrainerFriends = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainerFriends', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<User>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?${stringify(query)}`
  );
  return pagination;
});

export const fetchTrainerOrders = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainerOrders', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<Order>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Orders}?${stringify(query)}`
  );
  return pagination;
});

export const fetchCertificate = createAsyncThunk<
  string,
  FetchFileParams,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchCertificate', async ({ id, path }, { extra: api }) => {
  const { data } = await api.post<Blob>(
    `${ApiRoute.User}/${id}${ApiRoute.Certificates}`,
    { path },
    { responseType: 'blob'}
  );
  const dataUrl = URL.createObjectURL(data);
  return dataUrl;
});

export const fetchTraining = createAsyncThunk<
  Training,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTraining', async (id, { extra: api }) => {
  const { data } = await api.get<Training>(`${ApiRoute.Training}/${id}`);
  return data;
});

export const updateTraining = createAsyncThunk<
  Training,
  { id: string; data: FormData },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/updateTraining', async ({ id, data }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data: training } = await api.patch<Training>(
        `${ApiRoute.Training}/${id}`,
        data
      );
      dispatch(setResponseError(null));
      return training;
    } catch (error) {
      if (!error.response) {
        throw new Error(error);
      }

      dispatch(setResponseError(error.response.data));
      return rejectWithValue(error.response.data);
    }
  }
);
