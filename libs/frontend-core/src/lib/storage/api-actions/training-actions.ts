import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { FrontendRoute, Training } from '@2299899-fit-friends/types';
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
    dispatch(redirectToRoute(`/${FrontendRoute.Personal}`));
    return training;
  } catch (error) {
    if (!error.response) {
      throw new Error(error);
    }

    dispatch(setResponseError(error.response.data));
    return rejectWithValue(error.response.data);
  }
});
