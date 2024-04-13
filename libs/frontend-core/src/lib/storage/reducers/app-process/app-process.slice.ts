import { AuthStatus, NameSpace, ResponseError, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { dropToken } from '../../../services/token';
import { checkAuth, loginUser } from '../../api-actions/users-actions';
import { AppProcess } from '../../types/app-process.type';

const initialState: AppProcess = {
  authStatus: AuthStatus.Unknown,
  currentUser: null,
  responseError: null,
};

export const appProcess = createSlice({
  name: NameSpace.App,
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setResponseError: (state, action: PayloadAction<ResponseError | null>) => {
      state.responseError = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
        state.currentUser = null;
        dropToken();
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })
      ;
  },
});

export const { setAuthStatus, setCurrentUser, setResponseError } = appProcess.actions;
