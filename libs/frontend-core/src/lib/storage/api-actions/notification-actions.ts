import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Notification } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('notification/fetchNotifications', async (_, { extra: api }) => {
  const { data } = await api.get<Notification[]>(ApiRoute.Notification);
  return data;
});

export const deleteNotification = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('notification/deleteNotification', async (id, { extra: api }) => {
  await api.delete(`${ApiRoute.Notification}/${id}`);
});
