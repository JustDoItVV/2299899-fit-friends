import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { FrontendRoute, Order, Pagination, Training, User } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { redirectToRoute } from '../actions/redirect-to-route';
import { setResponseError } from '../reducers/user-process/user-process.slice';
import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';

export const createTrainingAction = createAsyncThunk<
  Training,
  FormData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('training/create', async (formData, { dispatch, extra: api, rejectWithValue }) => {
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
  Pagination<Training>,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainings', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<Training>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}?${query}`
  );
  return pagination;
});

export const fetchTrainingBackgroundPicture = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('user/fetchTrainingBackgroundPicture', async (id, { extra: api }) => {
  const { data: pictureUrl } = await api.get<string>(
    `${ApiRoute.Training}/${id}${ApiRoute.BackgroundPicture}`,
  );
  return pictureUrl;
});

export const fetchTrainerFriends = createAsyncThunk<
  Pagination<User>,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchFriends', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<User>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?${query}`
  );
  return pagination;
});

export const fetchTrainerOrders = createAsyncThunk<
  Pagination<Order>,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchFriends', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<Order>>(
    `${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Orders}?${query}`
  );
  return pagination;
});
