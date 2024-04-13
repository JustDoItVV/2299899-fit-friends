import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    Pagination, QueryPagination, TrainingRequest, TrainingRequestStatus
} from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const createRequest = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('trainingRequests/createRequest', async (targetId, { extra: api }) => {
    await api.post(`${ApiRoute.TrainingRequest}`, { targetId });
});

export const fetchRequests = createAsyncThunk<
  Pagination<CatalogItem>,
  QueryPagination,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('trainingRequests/fetchRequests', async (query, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<TrainingRequest>>(
    `${ApiRoute.TrainingRequest}?${stringify(query)}`
  );
  return pagination;
});

export const updateRequest = createAsyncThunk<
  void,
  { id: string, status: TrainingRequestStatus },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('trainingRequests/updateRequest', async (data, { extra: api }) => {
    await api.patch(`${ApiRoute.TrainingRequest}/${data.id}`, data);
});
