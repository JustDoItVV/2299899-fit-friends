import { NameSpace } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    fetchTrainerCatalog, fetchTrainerFriends
} from '../../api-actions/account-trainer-actions';
import { CatalogItems } from '../../types/catalog-items.type';
import { CatalogProcess } from '../../types/catalog-process.type';

const initialState: CatalogProcess = {
  pageItems: [],
  totalPages: 1,
};

export const catalogProcess = createSlice({
  name: NameSpace.Catalog,
  initialState,
  reducers: {
    setPageItems: (state, action: PayloadAction<CatalogItems>) => {
      state.pageItems = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
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
      })
      .addCase(fetchTrainerFriends.fulfilled, (state, action) => {
        state.pageItems = action.payload.entities;
        if (state.totalPages !== action.payload.totalPages) {
          state.totalPages = action.payload.totalPages;
        }
      })
      ;
  },
});

export const { setPageItems, setTotalPages } = catalogProcess.actions;
