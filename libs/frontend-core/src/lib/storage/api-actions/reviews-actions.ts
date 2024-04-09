import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Pagination, Review } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { CatalogItem } from '../types/catalog-item.type';
import { State } from '../types/state.type';

export const fetchReviews = createAsyncThunk<
  Pagination<CatalogItem>,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('reviews/fetchReviews', async (id, { extra: api }) => {
  const { data: pagination } = await api.get<Pagination<Review>>(
    `${ApiRoute.Training}/${id}${ApiRoute.Reviews}`
  );
  return pagination;
});

export const createReview = createAsyncThunk<
  Review,
  { id: string, data: Pick<Review, 'rating' | 'text'> },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('reviews/createReview', async ({ id, data }, { extra: api }) => {
  const { data: review } = await api.post<Review>(
    `${ApiRoute.Training}/${id}${ApiRoute.Reviews}`,
    data,
  );
  return review;
});
