import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Balance, Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const updateBalance = createAsyncThunk<
  Balance,
  Pick<Balance, 'trainingId' | 'available'> | { 'paymentMethod': string },
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
