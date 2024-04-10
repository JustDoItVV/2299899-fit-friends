import { NameSpace, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchUserAction } from '../../api-actions/user-actions';
import { UserProcess } from '../../types/user-process.type';

const initialState: UserProcess = {
  user: null,
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
      .addCase(fetchUserAction.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserAction.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = userProcess.actions;
