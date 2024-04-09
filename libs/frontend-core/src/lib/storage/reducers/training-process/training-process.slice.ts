import { NameSpace, Training } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchTraining } from '../../api-actions/account-trainer-actions';
import { TrainingProcess } from '../../types/training-process.type';

const initialState: TrainingProcess = {
  training: null,
};

export const trainingProcess = createSlice({
  name: NameSpace.Training,
  initialState,
  reducers: {
    setTraining: (state, action: PayloadAction<Training | null>) => {
      state.training = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTraining.fulfilled, (state, action) => {
        state.training = action.payload;
      })
      .addCase(fetchTraining.rejected, (state) => {
        state.training = null;
      })
      ;
  },
});

export const { setTraining } = trainingProcess.actions;
