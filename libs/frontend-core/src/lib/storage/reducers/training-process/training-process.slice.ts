import { NameSpace, Training } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  // extraReducers(builder) {
  //   builder
  //     .addCase(fetchTrainerCatalog.fulfilled, (state, action) => {
  //       state.pageItems = action.payload.entities;
  //       if (state.totalPages !== action.payload.totalPages) {
  //         state.totalPages = action.payload.totalPages;
  //       }
  //     })
  //     .addCase(fetchTrainerFriends.fulfilled, (state, action) => {
  //       state.pageItems = action.payload.entities;
  //       if (state.totalPages !== action.payload.totalPages) {
  //         state.totalPages = action.payload.totalPages;
  //       }
  //     })
  //     ;
  // },
});

export const { setTraining } = trainingProcess.actions;
