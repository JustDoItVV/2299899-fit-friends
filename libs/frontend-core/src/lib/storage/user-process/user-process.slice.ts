import { AuthStatus, NameSpace, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  checkAuthAction,
  fetchUserAction,
  loginUserAction,
} from '../api-actions/user-actions';
import { ResponseError, UserProcess } from '../types/user-process.type';

const initialState: UserProcess = {
  authStatus: AuthStatus.Unknown,
  currentUser: null,
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
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
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
        state.currentUser = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.currentUser = action.payload;
      })
      .addCase(loginUserAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })
      .addCase(fetchUserAction.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserAction.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, setCurrentUser, setAuthStatus, setResponseError } =
  userProcess.actions;
