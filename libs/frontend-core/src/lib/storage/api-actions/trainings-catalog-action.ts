import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Pagination, QueryPagination, Training } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';

export const fetchTrainingsCatalog = createAsyncThunk<
  Pagination<Training>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('accountTrainer/fetchTrainings', async (query, { extra: api }) => {
    const { data: pagination } = await api.get<Pagination<Training>>(
    `${ApiRoute.Training}?${stringify(query)}`
  );
  return pagination;
});
