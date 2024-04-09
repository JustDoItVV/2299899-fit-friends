import { NameSpace, Review, Training } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchTraining } from '../../api-actions/account-trainer-actions';
import { createReview, fetchReviews } from '../../api-actions/reviews-actions';
import { TrainingProcess } from '../../types/training-process.type';

const initialState: TrainingProcess = {
  training: null,
  reviews: [],
};

export const trainingProcess = createSlice({
  name: NameSpace.Training,
  initialState,
  reducers: {
    setTraining: (state, action: PayloadAction<Training | null>) => {
      state.training = action.payload;
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
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
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.entities as Review[];
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.reviews = [];
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      })
      ;
  },
});

export const { setTraining } = trainingProcess.actions;
