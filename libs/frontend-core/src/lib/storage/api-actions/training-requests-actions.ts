import { AxiosInstance } from 'axios';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch } from '../types/app-dispatch.type';
import { State } from '../types/state.type';

export const createRequest = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('trainingRequests/createRequest', async (targetId, { extra: api }) => {
    await api.post(`${ApiRoute.TriningRequest}`, { targetId });
});
