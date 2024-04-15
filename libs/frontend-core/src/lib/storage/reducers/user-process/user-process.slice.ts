import { NameSpace, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchUser } from '../../api-actions/users-actions';
import { UserProcess } from '../../types/user-process.type';

const initialState: UserProcess = {
  user: null,
  isLoading: false,
};

export const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      ;
  },
});

export const { setUser } = userProcess.actions;
