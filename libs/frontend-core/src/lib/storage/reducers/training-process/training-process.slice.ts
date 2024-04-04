import { NameSpace, Training } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchTrainerCatalog } from '../../api-actions/account-trainer-actions';
import { checkAuthAction } from '../../api-actions/user-actions';
import { TrainingProcess } from '../../types/training-process.type';

const initialState: TrainingProcess = {
  catalog: [],
};

export const trainingProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    setCatalog: (state, action: PayloadAction<Training[]>) => {
      state.catalog = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrainerCatalog.fulfilled, (state) => {
        state.catalog = [];
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.catalog = [];
      });
  },
});

export const { setCatalog } = trainingProcess.actions;
