import { AuthStatus, NameSpace, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkAuthAction, loginAction } from '../api-actions/user-actions';
import { ResponseError, UserProcess } from '../types/user-process.type';

const initialState: UserProcess = {
  authStatus: AuthStatus.Unknown,
  user: null,
  responseError: null,
};

export const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setResponseError: (state, action: PayloadAction<ResponseError | null>) => {
      state.responseError = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.user = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.user = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      });
  },
});

export const { setUser, setAuthStatus, setResponseError } = userProcess.actions;

