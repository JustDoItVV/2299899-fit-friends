import { AuthStatus, NameSpace, ResponseError, User } from '@2299899-fit-friends/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { dropToken } from '../../../services/token';
import { checkAuthAction, loginUserAction } from '../../api-actions/user-actions';
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
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.currentUser = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
        state.currentUser = null;
        dropToken();
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.currentUser = action.payload;
      })
      .addCase(loginUserAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })
      ;
  },
});

export const { setAuthStatus, setCurrentUser, setResponseError } = appProcess.actions;
