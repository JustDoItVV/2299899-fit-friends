import { NameSpace, Training } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchTrainerCatalog } from '../../api-actions/account-trainer-actions';
import { TrainingProcess } from '../../types/training-process.type';

const initialState: TrainingProcess = {
  pageItems: [],
  totalPages: 1,
  currentPage: 0,
};

export const trainingProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    setTrainingCatalog: (state, action: PayloadAction<Training[]>) => {
      state.pageItems = action.payload;
    },
    setTrainingTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTrainerCatalog.fulfilled, (state, action) => {
        state.pageItems = action.payload.entities;
        if (state.totalPages !== action.payload.totalPages) {
          state.totalPages = action.payload.totalPages;
        }
      });
  },
});

export const { setTrainingCatalog, setTrainingTotalPages } = trainingProcess.actions;
