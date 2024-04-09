import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { Pagination, Review } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setResponseError } from '../reducers/app-process/app-process.slice';
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
>('reviews/createReview', async ({ id, data }, { dispatch, extra: api, rejectWithValue }) => {
  try {
    const { data: review } = await api.post<Review>(
      `${ApiRoute.Training}/${id}${ApiRoute.Reviews}`,
      data,
    );
    dispatch(setResponseError(null));
    return review;
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});
